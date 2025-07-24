import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { StoreContext } from './StoreContext';
import { toast } from 'react-toastify';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { url, token } = useContext(StoreContext);

  useEffect(() => {
    if (token) {
      // Initialize socket connection
      const socketInstance = io(url, {
        transports: ['websocket'],
      });

      socketInstance.on('connect', () => {
        setConnected(true);
        console.log('Connected to server');
        
        // Join user room for personalized notifications
        const userData = localStorage.getItem('token');
        if (userData) {
          // Extract user ID from token (you might need to decode JWT)
          const userId = JSON.parse(atob(userData.split('.')[1])).id;
          console.log('🏠 Joining room with userId:', userId);
          socketInstance.emit('join', userId);
        } else {
          console.log('❌ No token found, cannot join user room');
        }
      });

      socketInstance.on('disconnect', () => {
        setConnected(false);
        console.log('Disconnected from server');
      });

      // Listen for order status updates
      socketInstance.on('orderStatusUpdate', (data) => {
        toast.success(`Order ${data.orderId.slice(-6)} status updated: ${data.status}`);
        // You can add more specific handling here
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [token, url]);

  const value = {
    socket,
    connected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};