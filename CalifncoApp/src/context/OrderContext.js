import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_ORDERS } from '../data/mockData';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  useEffect(() => {
    AsyncStorage.getItem('@califnco_orders').then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
          }
        } catch (e) {}
      }
    }).catch(() => {});
  }, []);

  const saveOrders = (updatedList) => {
    setOrders(updatedList);
    AsyncStorage.setItem('@califnco_orders', JSON.stringify(updatedList)).catch(() => {});
  };

  // Place new order
  const placeOrder = (orderData) => {
    const isDealer = orderData.role === 'dealer';
    const newOrder = {
      id: `${isDealer ? 'CAL-DLR' : 'CAL-ORD'}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      trackingNumber: `DTDC-IN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      deliveryPartner: 'DTDC Express Courier',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      ...orderData
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);
    return newOrder;
  };

  // Admin updates order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    saveOrders(updated);
  };

  // Get orders filtered by user role / email
  const getCustomerOrders = (email) => {
    return orders.filter(o => o.role === 'customer' || o.email === email);
  };

  const getDealerOrders = (email) => {
    return orders.filter(o => o.role === 'dealer' || o.email === email);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        getCustomerOrders,
        getDealerOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
