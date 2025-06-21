import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, 1);
  };
  
  return (
    <Link to={`/product/${product.id}`} className="card group">
      <div className="relative overflow-hidden h-56">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-primary-600 text-white py-2 rounded-md flex items-center justify-center hover:bg-primary-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <span className="badge-accent">
            ${product.price}/{product.priceUnit}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg">{product.name}</h3>
        <p className="text-secondary-600 text-sm line-clamp-2 mt-1">
          {product.description}
        </p>
        <div className="mt-2">
          <span className="badge-primary">{product.category}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;