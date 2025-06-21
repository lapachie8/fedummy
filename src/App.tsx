import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import PersonalInfoPage from './pages/checkout/PersonalInfoPage';
import PaymentPage from './pages/checkout/PaymentPage';
import ShippingPage from './pages/checkout/ShippingPage';
import ConfirmationPage from './pages/checkout/ConfirmationPage';

// Admin Pages
import AddProductPage from './pages/admin/AddProductPage';
import TransactionsPage from './pages/admin/TransactionsPage';

// PrivateRoute component
const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('user');
  
  return isAuthenticated ? element : <Navigate to="/login" state={{ from: window.location.pathname }} />;
};

// AdminRoute component
const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const user = localStorage.getItem('user');
  const isAdmin = user ? JSON.parse(user).role === 'admin' : false;
  
  return isAdmin ? element : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Protected checkout routes */}
                  <Route 
                    path="/checkout/personal-info" 
                    element={<PrivateRoute element={<PersonalInfoPage />} />} 
                  />
                  <Route 
                    path="/checkout/payment" 
                    element={<PrivateRoute element={<PaymentPage />} />} 
                  />
                  <Route 
                    path="/checkout/shipping" 
                    element={<PrivateRoute element={<ShippingPage />} />} 
                  />
                  <Route 
                    path="/checkout/confirmation" 
                    element={<PrivateRoute element={<ConfirmationPage />} />} 
                  />
                  
                  {/* Admin routes */}
                  <Route 
                    path="/admin/add-product" 
                    element={<AdminRoute element={<AddProductPage />} />} 
                  />
                  <Route 
                    path="/admin/transactions" 
                    element={<AdminRoute element={<TransactionsPage />} />} 
                  />
                </Routes>
              </main>
              
              <Footer />
            </div>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;