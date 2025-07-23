import mongoose from "mongoose";
import orderModel from "./models/orderModel.js";
import "dotenv/config";

// Connect to database
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/food-del");
  console.log("Connected to MongoDB");
};

const testDeliveryUpdate = async () => {
  try {
    await connectDB();
    
    // Find the first order
    const order = await orderModel.findOne();
    if (!order) {
      console.log("No orders found");
      return;
    }
    
    console.log("Original order:", {
      id: order._id,
      status: order.status,
      deliveryPersonName: order.deliveryPersonName,
      deliveryPersonPhone: order.deliveryPersonPhone
    });
    
    // Test update
    const updateData = {
      status: "Out for delivery",
      deliveryPersonName: "Test Delivery Person",
      deliveryPersonPhone: "+1-555-TEST"
    };
    
    console.log("Updating with:", updateData);
    
    const updatedOrder = await orderModel.findByIdAndUpdate(
      order._id, 
      updateData, 
      { new: true }
    );
    
    console.log("Updated order:", {
      id: updatedOrder._id,
      status: updatedOrder.status,
      deliveryPersonName: updatedOrder.deliveryPersonName,
      deliveryPersonPhone: updatedOrder.deliveryPersonPhone
    });
    
    // Verify by fetching again
    const verifyOrder = await orderModel.findById(order._id);
    console.log("Verification fetch:", {
      id: verifyOrder._id,
      status: verifyOrder.status,
      deliveryPersonName: verifyOrder.deliveryPersonName,
      deliveryPersonPhone: verifyOrder.deliveryPersonPhone
    });
    
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    mongoose.disconnect();
  }
};

testDeliveryUpdate();