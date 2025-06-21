import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import CheckoutSteps from '../../components/CheckoutSteps';
import { CheckCircle } from 'lucide-react';

const ConfirmationPage: React.FC = () => {
  const { order, completeOrder } = useOrder();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!order?.personalInfo || !order?.paymentMethod || !order?.shippingMethod) {
      navigate('/checkout/shipping');
    } else {
      // Complete the order when the page loads
      completeOrder();
    }
  }, [order, navigate, completeOrder]);
  
  if (!order) {
    return null;
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <CheckoutSteps currentStep={5} />
        
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success-500" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-xl text-secondary-600 mb-6">
              Your order has been successfully placed.
            </p>
            
            <div className="bg-primary-50 p-4 rounded-md text-left mb-6">
              <p className="font-medium mb-2">Order Details:</p>
              <p className="mb-1">
                <span className="font-medium">Name:</span> {order.personalInfo.fullName}
              </p>
              <p className="mb-1">
                <span className="font-medium">Email:</span> {order.personalInfo.email}
              </p>
              <p className="mb-1">
                <span className="font-medium">Phone:</span> {order.personalInfo.phone}
              </p>
              <p className="mb-1">
                <span className="font-medium">Address:</span> {order.personalInfo.address}, {order.personalInfo.city}, {order.personalInfo.postalCode}
              </p>
              <p className="mb-1">
                <span className="font-medium">Payment Method:</span> {order.paymentMethod === 'credit-card' ? 'Credit Card' : 'Cash on Delivery'}
              </p>
              <p>
                <span className="font-medium">Shipping Method:</span> {order.shippingMethod === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
              </p>
            </div>
            
            <p className="text-lg mb-8">
              We'll process your order soon. You'll receive a confirmation email shortly.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/products')}
                className="btn-primary"
              >
                Continue Shopping
              </button>
              
              <button
                onClick={() => navigate('/orders')}
                className="btn-outline"
              >
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;