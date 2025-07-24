import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false },
  trackingSteps: {
    type: Array,
    default: function() {
      return [
        {
          step: "Order Placed",
          completed: true,
          timestamp: new Date(),
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
    }
  },
  estimatedDeliveryTime: { type: Date, default: null },
  deliveryPersonName: { type: String, default: null },
  deliveryPersonPhone: { type: String, default: null },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
