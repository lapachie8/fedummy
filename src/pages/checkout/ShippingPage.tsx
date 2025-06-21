import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { useCart } from '../../contexts/CartContext';
import CheckoutSteps from '../../components/CheckoutSteps';
import { Truck, MapPin } from 'lucide-react';

const ShippingPage: React.FC = () => {
  const { order, setShippingMethod } = useOrder();
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  
  const [shippingMethod, setShippingMethodState] = useState('delivery');
  
  if (!order?.personalInfo || !order?.paymentMethod) {
    navigate('/checkout/payment');
    return null;
  }
  
  const handleCompleteOrder = () => {
    setShippingMethod(shippingMethod);
    navigate('/checkout/confirmation');
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <CheckoutSteps currentStep={4} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Shipping Method</h2>
              
              <div className="space-y-4">
                <label className="block p-4 border rounded-md transition-all cursor-pointer hover:border-primary-600 hover:bg-primary-50">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="delivery"
                      checked={shippingMethod === 'delivery'}
                      onChange={() => setShippingMethodState('delivery')}
                      className="form-radio text-primary-600 mr-3"
                    />
                    <Truck className="w-6 h-6 text-secondary-700 mr-3" />
                    <div>
                      <span className="font-medium">Home Delivery</span>
                      <p className="text-sm text-secondary-600 mt-1">
                        We'll deliver your rental items to your address.
                      </p>
                    </div>
                  </div>
                </label>
                
                <label className="block p-4 border rounded-md transition-all cursor-pointer hover:border-primary-600 hover:bg-primary-50">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="pickup"
                      checked={shippingMethod === 'pickup'}
                      onChange={() => setShippingMethodState('pickup')}
                      className="form-radio text-primary-600 mr-3"
                    />
                    <MapPin className="w-6 h-6 text-secondary-700 mr-3" />
                    <div>
                      <span className="font-medium">Store Pickup</span>
                      <p className="text-sm text-secondary-600 mt-1">
                        Pick up your rental items from our store.
                      </p>
                    </div>
                  </div>
                  
                  {shippingMethod === 'pickup' && (
                    <div className="mt-4 pl-10">
                      <p className="font-medium mb-2">Select Pickup Location:</p>
                      
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="pickupLocation"
                            defaultChecked
                            className="form-radio text-primary-600 mr-2"
                          />
                          <span>Main Store - 123 Rental Street, City</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="pickupLocation"
                            className="form-radio text-primary-600 mr-2"
                          />
                          <span>Downtown Branch - 456 Central Avenue, City</span>
                        </label>
                      </div>
                    </div>
                  )}
                </label>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => navigate('/checkout/payment')}
                  className="btn-outline"
                >
                  Back
                </button>
                
                <button
                  onClick={handleCompleteOrder}
                  className="btn-primary"
                >
                  Complete Order
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
              
              <div className="mt-4 p-3 bg-primary-50 text-primary-700 rounded-md">
                <p className="text-sm">
                  <strong>Delivery Address:</strong><br />
                  {order.personalInfo.fullName}<br />
                  {order.personalInfo.address}<br />
                  {order.personalInfo.city}, {order.personalInfo.postalCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;