import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartItem from '../components/CartItem';
import CheckoutSteps from '../components/CheckoutSteps';
import { ShoppingBag } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout/personal-info');
    } else {
      navigate('/login', { state: { from: '/checkout/personal-info' } });
    }
  };
  
  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="w-16 h-16 text-secondary-400" />
            </div>
            
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-secondary-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            
            <button
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <CheckoutSteps currentStep={1} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="hidden sm:flex text-sm font-medium text-secondary-600 border-b border-secondary-200 pb-4">
                <div className="w-24"></div>
                <div className="flex-grow">Product</div>
                <div className="w-24 text-center">Quantity</div>
                <div className="w-24 text-center">Duration</div>
                <div className="w-24 text-center">Price</div>
                <div className="w-10"></div>
              </div>
              
              <div className="divide-y divide-secondary-200">
                {cart.map(item => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => navigate('/products')}
                  className="btn-outline"
                >
                  Continue Shopping
                </button>
                
                <button
                  onClick={clearCart}
                  className="btn bg-error-50 text-error-600 hover:bg-error-100"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="border-b border-secondary-200 pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-600">Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600">Delivery Fee</span>
                  <span>$0.00</span>
                </div>
              </div>
              
              <div className="py-4 border-b border-secondary-200">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="btn-primary w-full mt-6"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;