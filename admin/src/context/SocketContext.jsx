import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { StoreContext } from './StoreContext';
import { toast } from 'react-toastify';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const { url, token } = useContext(StoreContext);

  useEffect(() => {
    if (token) {
      // Initialize socket connection
      const socketInstance = io(url, {
        transports: ['websocket'],
      });

      socketInstance.on('connect', () => {
        setConnected(true);
        console.log('Admin connected to server');
        
        // Join admin room for admin-specific notifications
        socketInstance.emit('joinAdmin');
      });

      socketInstance.on('disconnect', () => {
        setConnected(false);
        console.log('Admin disconnected from server');
      });

      // Listen for new orders
      socketInstance.on('newOrder', (data) => {
        toast.info(`New order received from ${data.address.firstName} ${data.address.lastName}`);
        setNewOrdersCount(prev => prev + 1);
        
        // Play notification sound (optional)
      //   const audio = new Audio('/notification.mp3');
      //   audio.catch(() => {}); // Ignore if audio file doesn't exist
       });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [token, url]);

  const resetNewOrdersCount = () => {
    setNewOrdersCount(0);
  };

  const value = {
    socket,
    connected,
    newOrdersCount,
    resetNewOrdersCount
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