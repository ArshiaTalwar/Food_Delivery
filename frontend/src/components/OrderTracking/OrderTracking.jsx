import React, { useState, useEffect, useContext } from 'react';
import './OrderTracking.css';
import { StoreContext } from '../../context/StoreContext';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';

const OrderTracking = ({ orderId, onClose }) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { url, token } = useContext(StoreContext);
  const { socket } = useSocket();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (socket) {
      console.log('📡 Setting up orderStatusUpdate listener for order:', orderId);
      
      socket.on('orderStatusUpdate', (data) => {
        console.log('📨 Received orderStatusUpdate:', data);
        console.log('🎯 Current orderId:', orderId, 'Received orderId:', data.orderId);
        
        if (data.orderId === orderId) {
          console.log('✅ OrderId matches, updating order data');
          console.log('📋 Received tracking steps:', data.trackingSteps.map(step => ({
            step: step.step,
            completed: step.completed,
            timestamp: step.timestamp
          })));
          
          // SIMPLE APPROACH: Just refresh the data from database
          console.log('📨 Socket update received, refreshing order data...');
          fetchOrderDetails();
        } else {
          console.log('❌ OrderId does not match, ignoring update');
        }
      });

      return () => {
        socket.off('orderStatusUpdate');
      };
    }
  }, [socket, orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${url}/api/order/track/${orderId}`, {
        headers: { token }
      });
      if (response.data.success) {
        setOrderData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDeliveryTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="order-tracking-modal">
        <div className="order-tracking-content">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="order-tracking-modal">
        <div className="order-tracking-content">
          <div className="error-message">Order not found</div>
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-modal">
      <div className="order-tracking-content">
        <div className="tracking-header">
          <h2>Order Tracking</h2>
          <div>
            <button onClick={fetchOrderDetails} className="refresh-btn" style={{marginRight: '10px'}}>
              🔄 Refresh
            </button>
            <button onClick={onClose} className="close-btn">×</button>
          </div>
        </div>

        <div className="order-summary">
          <div className="order-info">
            <h3>Order #{orderData._id.slice(-8)}</h3>
            <p className="order-status">{orderData.status}</p>
            {orderData.estimatedDeliveryTime && (
              <p className="estimated-time">
                Estimated Delivery: {formatDeliveryTime(orderData.estimatedDeliveryTime)}
              </p>
            )}
          </div>
          
          {orderData.deliveryPersonName && (
            <div className="delivery-person">
              <h4>Delivery Person</h4>
              <p><strong>{orderData.deliveryPersonName}</strong></p>
              {orderData.deliveryPersonPhone && (
                <p>📞 {orderData.deliveryPersonPhone}</p>
              )}
            </div>
          )}
        </div>

        <div className="tracking-timeline">
          {orderData.trackingSteps.map((step, index) => (
            <div 
              key={index} 
              className={`timeline-item ${step.completed ? 'completed' : 'pending'}`}
            >
              <div className="timeline-marker">
                <div className="marker-circle">
                  {step.completed ? '✓' : index + 1}
                </div>
                {index < orderData.trackingSteps.length - 1 && (
                  <div className="timeline-line"></div>
                )}
              </div>
              <div className="timeline-content">
                <h4>{step.step}</h4>
                <p>{step.description}</p>
                {step.completed && step.timestamp && (
                  <span className="timestamp">{formatTime(step.timestamp)}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="order-items">
          <h4>Order Items</h4>
          {orderData.items.map((item, index) => (
            <div key={index} className="order-item">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="order-total">
            <strong>Total: ${orderData.amount}.00</strong>
          </div>
        </div>

        <div className="delivery-address">
          <h4>Delivery Address</h4>
          <p>{orderData.address.street}</p>
          <p>{orderData.address.city}, {orderData.address.state} {orderData.address.zipcode}</p>
          <p>{orderData.address.country}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;