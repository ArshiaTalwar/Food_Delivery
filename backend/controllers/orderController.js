import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:3000";
  try {
    // Validate required fields
    if (!req.body.userId || !req.body.items || !req.body.amount || !req.body.address) {
      return res.json({ 
        success: false, 
        message: "Missing required fields",
        missing: {
          userId: !req.body.userId,
          items: !req.body.items,
          amount: !req.body.amount,
          address: !req.body.address
        }
      });
    }

    const orderTime = new Date();
    console.log("🕒 Order placed at server time:", orderTime.toLocaleString());
    
    const estimatedTime = new Date(orderTime);
    estimatedTime.setMinutes(estimatedTime.getMinutes() + 30); // 30 minutes estimated delivery
    console.log("🚚 ETA set to:", estimatedTime.toLocaleString());
    
    // Create tracking steps with the exact order time
    const trackingSteps = [
      {
        step: "Order Placed",
        completed: true,
        timestamp: orderTime,
        description: "Your order has been successfully placed"
      },
      {
        step: "Order Confirmed",
        completed: false,
        timestamp: null,
        description: "Restaurant has confirmed your order"
      },
      {
        step: "Preparing",
        completed: false,
        timestamp: null,
        description: "Your food is being prepared"
      },
      {
        step: "Ready for Pickup",
        completed: false,
        timestamp: null,
        description: "Your order is ready and packed"
      },
      {
        step: "Out for Delivery",
        completed: false,
        timestamp: null,
        description: "Your order is on the way"
      },
      {
        step: "Delivered",
        completed: false,
        timestamp: null,
        description: "Order delivered successfully"
      }
    ];

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      date: orderTime, // Use the same timestamp
      estimatedDeliveryTime: estimatedTime,
      trackingSteps: trackingSteps, // Use custom tracking steps with correct timestamp
    });
    
    console.log("💾 Attempting to save order to database...");
    console.log("📋 Order data to save:", {
      userId: req.body.userId,
      itemsCount: req.body.items?.length,
      amount: req.body.amount,
      address: req.body.address ? "✓" : "✗",
      estimatedDeliveryTime: estimatedTime
    });
    
    const savedOrder = await newOrder.save();
    console.log("✅ Order saved successfully with ID:", savedOrder._id);
    
    // Verify order was actually saved to database
    const verifyOrder = await orderModel.findById(savedOrder._id);
    if (!verifyOrder) {
      throw new Error("Order failed to save to database");
    }
    console.log("🔍 Order verified in database");
    
    // Force update the "Order Placed" timestamp after save
    await orderModel.findByIdAndUpdate(newOrder._id, {
      'trackingSteps.0.timestamp': new Date(), // Update first step with current time
    });
    
    console.log("🔄 Updated Order Placed timestamp to current time");
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
    console.error("❌ Error in placeOrder:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.json({ success: false, message: "Failed to place order", error: error.message });
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
      const socketData = {
        orderId: req.body.orderId,
        status: req.body.status,
        trackingSteps: updatedOrder.trackingSteps,
        estimatedDeliveryTime: updatedOrder.estimatedDeliveryTime,
        deliveryPersonName: updatedOrder.deliveryPersonName,
        deliveryPersonPhone: updatedOrder.deliveryPersonPhone,
        timestamp: new Date()
      };
      
      console.log("📡 Emitting orderStatusUpdate to user:", order.userId);
      console.log("🏠 Available rooms:", io.sockets.adapter.rooms);
      console.log("📋 Socket data tracking steps:", socketData.trackingSteps.map(step => ({
        step: step.step,
        completed: step.completed,
        timestamp: step.timestamp
      })));
      
      // Emit to the user's room
      io.to(order.userId).emit('orderStatusUpdate', socketData);
      console.log("✅ Socket emission completed");


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
  
  console.log("🔄 Updating tracking steps for status:", status);
  console.log("📋 Current tracking steps:", trackingSteps.map(step => ({
    step: step.step,
    completed: step.completed,
    timestamp: step.timestamp
  })));
  
  const statusMapping = {
    "Food Processing": 2,  // Maps to "Preparing" step
    "Order Confirmed": 1,
    "Preparing": 2,
    "Ready for Pickup": 3,
    "Out for delivery": 4,  // Lowercase 'd' from admin panel
    "Out for Delivery": 4,  // Uppercase 'D' from tracking steps
    "Delivered": 5
  };
  
  const stepIndex = statusMapping[status];
  console.log("🎯 Status mapping result - Status:", status, "-> Index:", stepIndex);
  
  if (stepIndex !== undefined) {
    console.log("✅ Marking steps 0 to", stepIndex, "as completed");
    // Mark current and previous steps as completed
    for (let i = 0; i <= stepIndex; i++) {
      if (trackingSteps[i] && !trackingSteps[i].completed) {
        console.log("🔄 Completing step", i, ":", trackingSteps[i].step);
        trackingSteps[i].completed = true;
        trackingSteps[i].timestamp = new Date();
      }
    }
    
    // Special handling for "Out for Delivery" - ensure all previous steps are completed
    if (status === "Out for Delivery" || status === "Out for delivery") {
      console.log("🚚 Special handling for Out for Delivery - ensuring all previous steps are completed");
      for (let i = 0; i <= 4; i++) { // Complete steps 0-4 (including "Out for Delivery")
        if (trackingSteps[i]) {
          trackingSteps[i].completed = true;
          if (!trackingSteps[i].timestamp) {
            trackingSteps[i].timestamp = new Date();
          }
        }
      }
    }
  } else {
    console.log("❌ No mapping found for status:", status);
  }
  
  console.log("📋 Final tracking steps after update:", trackingSteps.map(step => ({
    step: step.step,
    completed: step.completed,
    timestamp: step.timestamp
  })));
  
  const updateData = { 
    trackingSteps,
    ...(deliveryPersonName && { deliveryPersonName }),
    ...(deliveryPersonPhone && { deliveryPersonPhone })
  };
  
  const updatedOrder = await orderModel.findByIdAndUpdate(orderId, updateData, { new: true });
  console.log("✅ Order tracking steps updated in database");
  
  // Verify the update by fetching fresh data
  const verifyOrder = await orderModel.findById(orderId);
  console.log("🔍 Database verification - tracking steps after save:", verifyOrder.trackingSteps.map(step => ({
    step: step.step,
    completed: step.completed,
    timestamp: step.timestamp
  })));
  
  return updatedOrder;
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
