import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, User, Menu, X, Plus, FileText, Shield } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            juiweaprent
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-secondary-800 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-secondary-800 hover:text-primary-600 transition-colors">
              Products
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin/add-product" className="flex items-center text-secondary-800 hover:text-primary-600 transition-colors">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Product
                </Link>
                <Link to="/admin/transactions" className="flex items-center text-secondary-800 hover:text-primary-600 transition-colors">
                  <FileText className="w-4 h-4 mr-1" />
                  Transactions
                </Link>
              </>
            )}
            <Link to="/about" className="text-secondary-800 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-secondary-800 hover:text-primary-600 transition-colors">
              Contact
            </Link>
          </nav>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-secondary-800" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  {isAdmin && <Shield className="w-4 h-4 text-accent-600" />}
                  <User className="w-5 h-5 text-secondary-800" />
                  <span className="text-secondary-800">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  {isAdmin ? (
                    <>
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-secondary-800 hover:bg-secondary-50">
                        Admin Dashboard
                      </Link>
                      <Link to="/admin/add-product" className="block px-4 py-2 text-sm text-secondary-800 hover:bg-secondary-50">
                        Add Product
                      </Link>
                      <Link to="/admin/transactions" className="block px-4 py-2 text-sm text-secondary-800 hover:bg-secondary-50">
                        View Transactions
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/account" className="block px-4 py-2 text-sm text-secondary-800 hover:bg-secondary-50">
                        My Account
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-secondary-800 hover:bg-secondary-50">
                        My Orders
                      </Link>
                    </>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-secondary-800 hover:bg-secondary-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Sign In
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-secondary-800" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-secondary-800" />
              ) : (
                <Menu className="w-6 h-6 text-secondary-800" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fadeIn">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-secondary-800 hover:text-primary-600 transition-colors py-2">
                Home
              </Link>
              <Link to="/products" className="text-secondary-800 hover:text-primary-600 transition-colors py-2">
                Products
              </Link>
              {isAdmin && (
                <>
                  <Link to="/admin/add-product" className="flex items-center text-secondary-800 hover:text-primary-600 transition-colors py-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Link>
                  <Link to="/admin/transactions" className="flex items-center text-secondary-800 hover:text-primary-600 transition-colors py-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Transactions
                  </Link>
                </>
              )}
              <Link to="/about" className="text-secondary-800 hover:text-primary-600 transition-colors py-2">
                About
              </Link>
              <Link to="/contact" className="text-secondary-800 hover:text-primary-600 transition-colors py-2">
                Contact
              </Link>
              
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <>
                      <Link to="/admin/dashboard" className="text-secondary-800 hover:text-primary-600 transition-colors py-2">
                        Admin Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/account" className="text-secondary-800 hover:text-primary-600 transition-colors py-2">
                        My Account
                      </Link>
                      <Link to="/orders" className="text-secondary-800 hover:text-primary-600 transition-colors py-2">
                        My Orders
                      </Link>
                    </>
                  )}
                  <button
                    onClick={logout}
                    className="text-left text-secondary-800 hover:text-primary-600 transition-colors py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-primary w-full mt-2">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;