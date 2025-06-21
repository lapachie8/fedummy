import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, ChevronRight, MinusCircle, PlusCircle } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [rentalDays, setRentalDays] = useState(1);
  
  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleRentalDaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRentalDays(parseInt(e.target.value, 10));
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity, rentalDays);
    navigate('/cart');
  };
  
  const totalPrice = product.price * quantity * rentalDays;
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-sm breadcrumbs">
          <ul className="flex items-center text-secondary-600">
            <li>
              <a 
                href="/" 
                className="hover:text-primary-600"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                Home
              </a>
            </li>
            <ChevronRight className="w-4 h-4 mx-2" />
            <li>
              <a 
                href="/products" 
                className="hover:text-primary-600"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/products');
                }}
              >
                Products
              </a>
            </li>
            <ChevronRight className="w-4 h-4 mx-2" />
            <li>{product.name}</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="overflow-hidden rounded-lg">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-accent-600">
                  ${product.price}/{product.priceUnit}
                </span>
              </div>
              
              <div className="mb-6">
                <span className="badge-primary">
                  {product.category}
                </span>
                {product.available ? (
                  <span className="badge-primary bg-success-100 text-success-800 ml-2">
                    Available
                  </span>
                ) : (
                  <span className="badge-primary bg-error-100 text-error-800 ml-2">
                    Unavailable
                  </span>
                )}
              </div>
              
              <p className="text-secondary-600 mb-8">
                {product.description}
              </p>
              
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-600 mb-2">
                      Rental Duration
                    </label>
                    <select
                      value={rentalDays}
                      onChange={handleRentalDaysChange}
                      className="input"
                    >
                      <option value="1">1 Day</option>
                      <option value="2">2 Days</option>
                      <option value="3">3 Days</option>
                      <option value="5">5 Days</option>
                      <option value="7">1 Week</option>
                      <option value="14">2 Weeks</option>
                      <option value="30">1 Month</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-600 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center border border-secondary-300 rounded-md">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="px-3 py-2 text-secondary-600 hover:text-secondary-900"
                        disabled={quantity <= 1}
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                      <span className="flex-grow text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="px-3 py-2 text-secondary-600 hover:text-secondary-900"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-lg font-medium">
                  Total: <span className="text-accent-600">${totalPrice.toFixed(2)}</span>
                </p>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="btn-primary w-full mb-4 py-3"
                disabled={!product.available}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    addToCart(product, quantity, rentalDays);
                    navigate('/checkout/personal-info');
                  }}
                  className="btn-accent w-full py-3"
                  disabled={!product.available}
                >
                  Rent Now
                </button>
              ) : (
                <button
                  onClick={() => {
                    addToCart(product, quantity, rentalDays);
                    navigate('/login', { state: { from: `/checkout/personal-info` } });
                  }}
                  className="btn-accent w-full py-3"
                  disabled={!product.available}
                >
                  Rent Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;