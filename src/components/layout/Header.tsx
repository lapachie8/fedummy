import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { formatCurrency } from '../../utils/currency';
import { ShoppingCart, User, Menu, X, Plus, FileText, Shield, LogOut, Settings, UserCircle, DollarSign } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const { getTotalRevenue } = useTransactions();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const logoutModalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close logout modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoutModalRef.current && !logoutModalRef.current.contains(event.target as Node)) {
        setShowLogoutConfirm(false);
      }
    };

    if (showLogoutConfirm) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLogoutConfirm]);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const totalRevenue = getTotalRevenue();

  const handleLogoutClick = () => {
    setUserMenuOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
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
                  {/* Revenue Display for Admin */}
                  <div className="flex items-center bg-success-50 px-3 py-2 rounded-md border border-success-200">
                    <DollarSign className="w-4 h-4 text-success-600 mr-2" />
                    <div className="text-sm">
                      <span className="text-success-600 font-medium">Revenue:</span>
                      <span className="text-success-800 font-bold ml-1">
                        {formatCurrency(totalRevenue)}
                      </span>
                    </div>
                  </div>
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
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none p-2 rounded-md hover:bg-secondary-100 transition-colors"
                  >
                    {isAdmin && <Shield className="w-4 h-4 text-accent-600" />}
                    <UserCircle className="w-6 h-6 text-secondary-800" />
                    <span className="text-secondary-800 font-medium">{user?.name}</span>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-secondary-200">
                        <p className="text-sm font-medium text-secondary-900">{user?.name}</p>
                        <p className="text-xs text-secondary-500">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800 mt-1">
                            <Shield className="w-3 h-3 mr-1" />
                            Administrator
                          </span>
                        )}
                      </div>
                      
                      {isAdmin ? (
                        <>
                          <Link 
                            to="/admin/add-product" 
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Plus className="w-4 h-4 mr-3" />
                            Add Product
                          </Link>
                          <Link 
                            to="/admin/transactions" 
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FileText className="w-4 h-4 mr-3" />
                            View Transactions
                          </Link>
                          <div className="px-4 py-2 border-t border-secondary-200 mt-1">
                            <div className="flex items-center text-sm">
                              <DollarSign className="w-4 h-4 text-success-600 mr-2" />
                              <span className="text-success-600">Total Revenue:</span>
                            </div>
                            <p className="text-lg font-bold text-success-800 mt-1">
                              {formatCurrency(totalRevenue)}
                            </p>
                          </div>
                          <div className="border-t border-secondary-200 my-1"></div>
                        </>
                      ) : (
                        <>
                          <Link 
                            to="/account" 
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            My Account
                          </Link>
                          <Link 
                            to="/orders" 
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FileText className="w-4 h-4 mr-3" />
                            My Orders
                          </Link>
                          <div className="border-t border-secondary-200 my-1"></div>
                        </>
                      )}
                      
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
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
          <div className="md:hidden bg-white shadow-lg animate-fadeIn border-t border-secondary-200">
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
                    <div className="bg-success-50 p-3 rounded-md border border-success-200">
                      <div className="flex items-center mb-1">
                        <DollarSign className="w-4 h-4 text-success-600 mr-2" />
                        <span className="text-sm text-success-600 font-medium">Total Revenue:</span>
                      </div>
                      <p className="text-lg font-bold text-success-800">
                        {formatCurrency(totalRevenue)}
                      </p>
                    </div>
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
                    <div className="border-t border-secondary-200 pt-4">
                      <div className="flex items-center mb-4">
                        {isAdmin && <Shield className="w-4 h-4 text-accent-600 mr-2" />}
                        <span className="font-medium">{user?.name}</span>
                      </div>
                    </div>
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
                      onClick={handleLogoutClick}
                      className="text-left text-error-600 hover:text-error-700 transition-colors py-2"
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div 
            ref={logoutModalRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center mr-3">
                <LogOut className="w-5 h-5 text-error-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900">
                Confirm Logout
              </h3>
            </div>
            
            <p className="text-secondary-600 mb-6">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="btn bg-error-600 text-white hover:bg-error-700 focus:ring-error-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;