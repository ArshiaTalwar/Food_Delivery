import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:3000";
  try {
    const estimatedTime = new Date();
    estimatedTime.setMinutes(estimatedTime.getMinutes() + 45); // 45 minutes estimated delivery
    
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      estimatedDeliveryTime: estimatedTime,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    
    // Emit new order event to admin
    const io = req.app.get('io');
    io.to('admin').emit('newOrder', {
      orderId: newOrder._id,
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      timestamp: new Date()
    });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin pannel
const listOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    console.log("Update status request body:", req.body); // Debug log
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const order = await orderModel.findById(req.body.orderId);
      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }

      // Prepare update data
      const updateData = {
        status: req.body.status,
      };

      // Add delivery person details if provided
      if (req.body.deliveryPersonName) {
        updateData.deliveryPersonName = req.body.deliveryPersonName;
        console.log("Adding delivery person name:", req.body.deliveryPersonName);
      }
      if (req.body.deliveryPersonPhone) {
        updateData.deliveryPersonPhone = req.body.deliveryPersonPhone;
        console.log("Adding delivery person phone:", req.body.deliveryPersonPhone);
      }

      console.log("Final update data being sent to MongoDB:", updateData);

      // Update the order status and delivery person info
      const mongoUpdateResult = await orderModel.findByIdAndUpdate(req.body.orderId, updateData, { new: true });
      console.log("MongoDB update result:", {
        id: mongoUpdateResult._id,
        status: mongoUpdateResult.status,
        deliveryPersonName: mongoUpdateResult.deliveryPersonName,
        deliveryPersonPhone: mongoUpdateResult.deliveryPersonPhone
      });

      // Update tracking steps based on status
      const updatedOrder = await updateTrackingSteps(req.body.orderId, req.body.status, req.body.deliveryPersonName, req.body.deliveryPersonPhone);
      
      console.log("Updated order data:", {
        deliveryPersonName: updatedOrder.deliveryPersonName,
        deliveryPersonPhone: updatedOrder.deliveryPersonPhone,
        status: updatedOrder.status
      }); // Debug log
      
      // Emit real-time update to the user
      const io = req.app.get('io');
      io.to(order.userId).emit('orderStatusUpdate', {
        orderId: req.body.orderId,
        status: req.body.status,
        trackingSteps: updatedOrder.trackingSteps,
        estimatedDeliveryTime: updatedOrder.estimatedDeliveryTime,
        deliveryPersonName: updatedOrder.deliveryPersonName,
        deliveryPersonPhone: updatedOrder.deliveryPersonPhone,
        timestamp: new Date()
      });

      res.json({ success: true, message: "Status Updated Successfully" });
    }else{
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Helper function to update tracking steps
const updateTrackingSteps = async (orderId, status, deliveryPersonName = null, deliveryPersonPhone = null) => {
  const order = await orderModel.findById(orderId);
  const trackingSteps = [...order.trackingSteps];
  
  const statusMapping = {
    "Order Confirmed": 1,
    "Food Processing": 2,
    "Preparing": 2,
    "Ready for Pickup": 3,
    "Out for Delivery": 4,
    "Delivered": 5
  };
  
  const stepIndex = statusMapping[status];
  if (stepIndex !== undefined) {
    // Mark current and previous steps as completed
    for (let i = 0; i <= stepIndex; i++) {
      if (trackingSteps[i] && !trackingSteps[i].completed) {
        trackingSteps[i].completed = true;
        trackingSteps[i].timestamp = new Date();
      }
    }
  }
  
  const updateData = { 
    trackingSteps,
    ...(deliveryPersonName && { deliveryPersonName }),
    ...(deliveryPersonPhone && { deliveryPersonPhone })
  };
  
  return await orderModel.findByIdAndUpdate(orderId, updateData, { new: true });
};

// Get single order with tracking details
const getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    
    // Check if user owns this order or is admin
    const userData = await userModel.findById(req.body.userId);
    if (order.userId !== req.body.userId && userData.role !== "admin") {
      return res.json({ success: false, message: "Unauthorized access" });
    }
    
    res.json({ success: true, data: order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, getOrderTracking };
