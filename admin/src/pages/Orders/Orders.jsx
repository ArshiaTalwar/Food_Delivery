import React from "react";
import "./Orders.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const { socket, newOrdersCount, resetNewOrdersCount } = useSocket();
  const [orders, setOrders] = useState([]);
  const [deliveryPersonName, setDeliveryPersonName] = useState('');
  const [deliveryPersonPhone, setDeliveryPersonPhone] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchAllOrder = async () => {
    const response = await axios.get(url + "/api/order/list", {
      headers: { token },
    });
    if (response.data.success) {
      setOrders(response.data.data);
    }
  };

  const statusHandler = async (event, orderId) => {
  const newStatus = event.target.value;

  if (newStatus === "Out for delivery" && selectedOrderId !== orderId) {
    setSelectedOrderId(orderId);
    toast.info("Please assign a delivery person first");
    return;
  }

  const requestData = {
    orderId,
    status: newStatus,
  };

  if (newStatus === "Out for delivery" && selectedOrderId === orderId) {
    if (!deliveryPersonName || !deliveryPersonPhone) {
      toast.error("Please enter delivery person name and phone number");
      return;
    }
    requestData.deliveryPersonName = deliveryPersonName;
    requestData.deliveryPersonPhone = deliveryPersonPhone;
  }

  const response = await axios.post(
    url + "/api/order/status",
    requestData,
    { headers: { token } }
  );

  if (response.data.success) {
    toast.success(response.data.message);
    await fetchAllOrder();
    setDeliveryPersonName('');
    setDeliveryPersonPhone('');
    setSelectedOrderId(null);
  } else {
    toast.error(response.data.message);
  }
};

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchAllOrder();
    resetNewOrdersCount(); // Reset notification count when viewing orders
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newOrder', (data) => {
        // Refresh orders list when new order arrives
        fetchAllOrder();
      });

      return () => {
        socket.off('newOrder');
      };
    }
  }, [socket]);

  const handleDeliveryAssignment = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleAssignDelivery = async (orderId) => {
    if (!deliveryPersonName || !deliveryPersonPhone) {
      toast.error("Please enter both delivery person name and phone number");
      return;
    }

    const requestData = {
      orderId,
      status: "Out for delivery",
      deliveryPersonName,
      deliveryPersonPhone,
    };

    console.log("Sending delivery assignment data:", requestData);

    const response = await axios.post(
      url + "/api/order/status",
      requestData,
      { headers: { token } }
    );
    
    console.log("Response from server:", response.data);
    
    if (response.data.success) {
      toast.success("Delivery person assigned and status updated successfully!");
      await fetchAllOrder();
      // Reset delivery person fields
      setDeliveryPersonName('');
      setDeliveryPersonPhone('');
      setSelectedOrderId(null);
    } else {
      toast.error(response.data.message);
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="order add">
      <div className="order-header">
        <h3>Order Management</h3>
        {newOrdersCount > 0 && (
          <div className="notification-badge">
            {newOrdersCount} new order{newOrdersCount > 1 ? 's' : ''}
          </div>
        )}
      </div>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
              <p className="order-date">Ordered: {formatDate(order.date)}</p>
              {order.estimatedDeliveryTime && (
                <p className="estimated-delivery">
                  ETA: {formatDate(order.estimatedDeliveryTime)}
                </p>
              )}
              {order.deliveryPersonName && (
                <p className="delivery-person">
                  Delivery: {order.deliveryPersonName} ({order.deliveryPersonPhone})
                </p>
              )}
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <div className="order-controls">
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="status-select"
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready for Pickup">Ready for Pickup</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              
              {order.status !== "Delivered" && order.status !== "Out for delivery" && (
                <button 
                  onClick={() => handleDeliveryAssignment(order._id)}
                  className="assign-delivery-btn"
                >
                  Assign Delivery
                </button>
              )}
              
              {selectedOrderId === order._id && (
                <div className="delivery-form">
                  <input
                    type="text"
                    placeholder="Delivery Person Name"
                    value={deliveryPersonName}
                    onChange={(e) => setDeliveryPersonName(e.target.value)}
                    className="delivery-input"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={deliveryPersonPhone}
                    onChange={(e) => setDeliveryPersonPhone(e.target.value)}
                    className="delivery-input"
                  />

                  <div className="delivery-form-buttons">
                    <button 
                      onClick={() => handleAssignDelivery(order._id)}
                      className="confirm-delivery-btn"
                    >
                      Assign & Set Out for Delivery
                    </button>
                    <button 
                      onClick={() => setSelectedOrderId(null)}
                      className="cancel-delivery-btn"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Orders;
