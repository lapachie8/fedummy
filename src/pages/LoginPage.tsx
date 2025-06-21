import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, User, Shield, AlertCircle } from 'lucide-react';

interface LocationState {
  from?: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = (location.state as LocationState) || { from: '/' };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (loginType === 'admin') {
          setError('Admin accounts cannot be registered. Please contact system administrator.');
          setLoading(false);
          return;
        }
        await register(email, password, name);
      }
      navigate(from);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginTypeChange = (type: 'user' | 'admin') => {
    setLoginType(type);
    setError('');
    // Clear form when switching types
    setEmail('');
    setPassword('');
    setName('');
    
    // Pre-fill admin credentials for demo
    if (type === 'admin') {
      setEmail('admin');
      setPassword('admin123');
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-secondary-50 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">
              {isLogin ? 'Sign In to Your Account' : 'Create a New Account'}
            </h1>

            {/* Login Type Selector - Only show for login */}
            {isLogin && (
              <div className="mb-6">
                <div className="flex rounded-lg border border-secondary-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleLoginTypeChange('user')}
                    className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium transition-colors ${
                      loginType === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-secondary-700 hover:bg-secondary-50'
                    }`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    User Login
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoginTypeChange('admin')}
                    className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium transition-colors ${
                      loginType === 'admin'
                        ? 'bg-accent-600 text-white'
                        : 'bg-white text-secondary-700 hover:bg-secondary-50'
                    }`}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Login
                  </button>
                </div>
              </div>
            )}

            {/* Admin Login Info */}
            {isLogin && loginType === 'admin' && (
              <div className="mb-4 p-3 bg-accent-50 border border-accent-200 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-accent-800 mb-1">Admin Access</p>
                    <p className="text-accent-700">
                      Use credentials: <strong>admin</strong> / <strong>admin123</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-error-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  {loginType === 'admin' ? 'Username' : 'Email Address'}
                </label>
                <input
                  type={loginType === 'admin' ? 'text' : 'email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder={loginType === 'admin' ? 'admin' : 'you@example.com'}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                className={`w-full py-2.5 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  loginType === 'admin'
                    ? 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500'
                    : 'btn-primary'
                }`}
                disabled={loading}
              >
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            
            <div className="text-center mt-6">
              <p className="text-secondary-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setLoginType('user');
                    setEmail('');
                    setPassword('');
                    setName('');
                  }}
                  className="ml-1 text-primary-600 hover:text-primary-700 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Demo Accounts Info */}
            <div className="mt-6 pt-6 border-t border-secondary-200">
              <h3 className="text-sm font-medium text-secondary-700 mb-3">Demo Accounts:</h3>
              <div className="space-y-2 text-xs text-secondary-600">
                <div className="flex justify-between">
                  <span>Admin:</span>
                  <span className="font-mono">admin / admin123</span>
                </div>
                <div className="flex justify-between">
                  <span>User:</span>
                  <span>Register or use any email/password</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;