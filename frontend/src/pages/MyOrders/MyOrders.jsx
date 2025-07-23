import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import { useSocket } from "../../context/SocketContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import OrderTracking from "../../components/OrderTracking/OrderTracking";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const { socket } = useSocket();
  const [data, setData] = useState([]);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );
    if (response.data.success) {
      setData(response.data.data);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on('orderStatusUpdate', (updateData) => {
        // Update the local data when order status changes
        setData(prevData => 
          prevData.map(order => 
            order._id === updateData.orderId 
              ? { ...order, status: updateData.status }
              : order
          )
        );
      });

      return () => {
        socket.off('orderStatusUpdate');
      };
    }
  }, [socket]);

  const handleTrackOrder = (orderId) => {
    setTrackingOrderId(orderId);
  };

  const closeTracking = () => {
    setTrackingOrderId(null);
  };
  return (
    <div className="my-orders">
      <h2>Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " X " + item.quantity;
                  } else {
                    return item.name + " X " + item.quantity + ",";
                  }
                })}
              </p>
              <p>${order.amount}.00</p>
              <p>items: {order.items.length}</p>
              <p>
                <span>&#x25cf;</span>
                <b> {order.status}</b>
              </p>
              <button onClick={() => handleTrackOrder(order._id)} className="track-btn">
                Track Order
              </button>
            </div>
          );
        })}
      </div>
      
      {trackingOrderId && (
        <OrderTracking 
          orderId={trackingOrderId} 
          onClose={closeTracking}
        />
      )}
    </div>
  );
};

export default MyOrders;
