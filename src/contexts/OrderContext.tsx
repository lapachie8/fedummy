import React, { createContext, useState, useContext, ReactNode } from 'react';
import { OrderDetails, OrderContextType } from '../types';
import { useCart } from './CartContext';

const defaultOrderContext: OrderContextType = {
  order: null,
  setPersonalInfo: () => {},
  setPaymentMethod: () => {},
  setShippingMethod: () => {},
  completeOrder: () => {},
  resetOrder: () => {},
};

const OrderContext = createContext<OrderContextType>(defaultOrderContext);

export const useOrder = () => useContext(OrderContext);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const [order, setOrder] = useState<OrderDetails | null>(null);

  // Initialize order with cart items
  React.useEffect(() => {
    if (cart.length > 0 && !order) {
      setOrder({
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          postalCode: '',
        },
        paymentMethod: '',
        shippingMethod: '',
        orderTotal: cartTotal,
        items: [...cart],
      });
    } else if (order) {
      // Update order total if cart changes
      setOrder({
        ...order,
        orderTotal: cartTotal,
        items: [...cart],
      });
    }
  }, [cart, cartTotal, order]);

  const setPersonalInfo = (info: OrderDetails['personalInfo']) => {
    if (order) {
      setOrder({ ...order, personalInfo: info });
    }
  };

  const setPaymentMethod = (method: string) => {
    if (order) {
      setOrder({ ...order, paymentMethod: method });
    }
  };

  const setShippingMethod = (method: string) => {
    if (order) {
      setOrder({ ...order, shippingMethod: method });
    }
  };

  const completeOrder = () => {
    // In a real app, you would send the order to your backend API
    console.log('Order completed:', order);
    // Then clear the cart
    clearCart();
  };

  const resetOrder = () => {
    setOrder(null);
  };

  const value = {
    order,
    setPersonalInfo,
    setPaymentMethod,
    setShippingMethod,
    completeOrder,
    resetOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};