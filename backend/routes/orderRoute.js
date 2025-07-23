import express from "express";
import authMiddleware from "../middleware/auth.js";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, getOrderTracking } from "../controllers/orderController.js";
import orderModel from "../models/orderModel.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/status",authMiddleware,updateStatus);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list",authMiddleware,listOrders);
orderRouter.get("/track/:orderId",authMiddleware,getOrderTracking);

// Test route for debugging delivery updates
orderRouter.post("/test-delivery", authMiddleware, async (req, res) => {
  try {
    const { orderId, deliveryPersonName, deliveryPersonPhone } = req.body;
    console.log("Test delivery update received:", { orderId, deliveryPersonName, deliveryPersonPhone });
    
    if (!orderId) {
      return res.json({ success: false, message: "Order ID required" });
    }
    
    const updateData = {
      deliveryPersonName: deliveryPersonName || "Test Delivery Person",
      deliveryPersonPhone: deliveryPersonPhone || "+1-555-TEST",
      status: "Out for delivery"
    };
    
    console.log("Updating order with:", updateData);
    
    const result = await orderModel.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );
    
    if (!result) {
      return res.json({ success: false, message: "Order not found" });
    }
    
    console.log("Update successful:", {
      id: result._id,
      status: result.status,
      deliveryPersonName: result.deliveryPersonName,
      deliveryPersonPhone: result.deliveryPersonPhone
    });
    
    res.json({ 
      success: true, 
      message: "Test delivery update successful",
      data: {
        id: result._id,
        status: result.status,
        deliveryPersonName: result.deliveryPersonName,
        deliveryPersonPhone: result.deliveryPersonPhone
      }
    });
  } catch (error) {
    console.error("Test delivery update failed:", error);
    res.json({ success: false, message: "Test failed", error: error.message });
  }
});

export default orderRouter;