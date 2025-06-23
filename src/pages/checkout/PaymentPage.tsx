import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { useCart } from '../../contexts/CartContext';
import CheckoutSteps from '../../components/CheckoutSteps';
import { CreditCard, DollarSign } from 'lucide-react';

const PaymentPage: React.FC = () => {
  const { order, setPaymentMethod } = useOrder();
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethodState] = useState('credit-card');
  
  if (!order?.personalInfo) {
    navigate('/checkout/personal-info');
    return null;
  }
  
  const handleContinue = () => {
    setPaymentMethod(paymentMethod);
    navigate('/checkout/shipping');
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <CheckoutSteps currentStep={3} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                
                
                <label className="block p-4 border rounded-md transition-all cursor-pointer hover:border-primary-600 hover:bg-primary-50">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethodState('cash')}
                      className="form-radio text-primary-600 mr-3"
                    />
                    <DollarSign className="w-6 h-6 text-secondary-700 mr-3" />
                    <div>
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-sm text-secondary-600 mt-1">
                        Pay with cash when your rental items are delivered.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => navigate('/checkout/personal-info')}
                  className="btn-outline"
                >
                  Back
                </button>
                
                <button
                  onClick={handleContinue}
                  className="btn-primary"
                >
                  Continue to Shipping
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="border-b border-secondary-200 pb-4 mb-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between mb-2">
                    <span>
                      {item.product.name} x{item.quantity} ({item.rentalDays} days)
                    </span>
                    <span>${(item.product.price * item.quantity * item.rentalDays).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-b border-secondary-200 pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-600">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600">Delivery Fee</span>
                  <span>$0.00</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;