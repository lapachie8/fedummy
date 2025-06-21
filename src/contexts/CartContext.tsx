import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CartItem, Product, CartContextType } from '../types';

const defaultCartContext: CartContextType = {
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  updateRentalDays: () => {},
  clearCart: () => {},
  cartTotal: 0,
};

const CartContext = createContext<CartContextType>(defaultCartContext);

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartTotal, setCartTotal] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Calculate cart total
    const total = cart.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity * item.rentalDays);
    }, 0);
    
    setCartTotal(total);
  }, [cart]);

  const addToCart = (product: Product, quantity: number, rentalDays: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id
      );

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
          rentalDays: rentalDays || updatedCart[existingItemIndex].rentalDays,
        };
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, { product, quantity, rentalDays: rentalDays || 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateRentalDays = (productId: number, days: number) => {
    if (days < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId ? { ...item, rentalDays: days } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateRentalDays,
    clearCart,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};