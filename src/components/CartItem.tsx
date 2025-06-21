import React, { useState } from 'react';
import { CartItem as CartItemType } from '../types';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { product, quantity, rentalDays } = item;
  const { updateQuantity, updateRentalDays, removeFromCart } = useCart();
  const [localRentalDays, setLocalRentalDays] = useState(rentalDays);
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(product.id, newQuantity);
    }
  };
  
  const handleRentalDaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const days = parseInt(e.target.value, 10);
    setLocalRentalDays(days);
    updateRentalDays(product.id, days);
  };
  
  const handleRemove = () => {
    removeFromCart(product.id);
  };
  
  const subtotal = product.price * quantity * rentalDays;
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-secondary-200">
      <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 sm:mr-4">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-secondary-600">${product.price}/{product.priceUnit}</p>
      </div>
      
      <div className="w-full sm:w-auto mt-4 sm:mt-0 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
        <div className="flex items-center">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="text-secondary-600 hover:text-secondary-900"
            disabled={quantity <= 1}
          >
            <MinusCircle className="w-5 h-5" />
          </button>
          <span className="mx-2 w-8 text-center">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="text-secondary-600 hover:text-secondary-900"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center">
          <select
            value={localRentalDays}
            onChange={handleRentalDaysChange}
            className="border border-secondary-300 rounded-md px-2 py-1"
          >
            {[1, 2, 3, 5, 7, 14, 30].map(day => (
              <option key={day} value={day}>
                {day} {day === 1 ? 'day' : 'days'}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-right sm:text-center font-medium">
          ${subtotal.toFixed(2)}
        </div>
        
        <div className="text-right">
          <button
            onClick={handleRemove}
            className="text-error-500 hover:text-error-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;