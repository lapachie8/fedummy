import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { ArrowLeft, Eye, CheckCircle, XCircle, Clock, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';

const TransactionsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { transactions, getTotalRevenue, getCompletedTransactions } = useTransactions();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed' | 'cancelled'>('all');
  
  // Redirect if not admin
  if (!isAdmin) {
    navigate('/');
    return null;
  }
  
  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  
  const filteredTransactions = transactions.filter(transaction => 
    filter === 'all' || transaction.status === filter
  );
  
  const totalRevenue = getTotalRevenue();
  const completedTransactions = getCompletedTransactions();
  const averageOrderValue = completedTransactions.length > 0 
    ? totalRevenue / completedTransactions.length 
    : 0;
  
  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warning-500" />;
      case 'active':
        return <AlertCircle className="w-4 h-4 text-primary-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-error-500" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'active':
        return 'bg-primary-100 text-primary-800';
      case 'completed':
        return 'bg-success-100 text-success-800';
      case 'cancelled':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="btn-outline mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold">Customer Transactions</h1>
        </div>
        
        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-success-500 to-success-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-100 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="bg-success-400 bg-opacity-30 rounded-full p-3">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">Completed Orders</p>
                <p className="text-2xl font-bold">{completedTransactions.length}</p>
              </div>
              <div className="bg-primary-400 bg-opacity-30 rounded-full p-3">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-100 text-sm font-medium">Average Order</p>
                <p className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</p>
              </div>
              <div className="bg-accent-400 bg-opacity-30 rounded-full p-3">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100 text-sm font-medium">Total Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <div className="bg-secondary-400 bg-opacity-30 rounded-full p-3">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'active', 'completed', 'cancelled'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full border transition-all capitalize ${
                  filter === status
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-secondary-300 hover:border-primary-600 hover:bg-primary-50'
                }`}
              >
                {status} ({transactions.filter(t => status === 'all' || t.status === status).length})
              </button>
            ))}
          </div>
        </div>
        
        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-secondary-600">No transactions found for the selected filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-secondary-900">
                            {transaction.customerName}
                          </div>
                          <div className="text-sm text-secondary-500">
                            {transaction.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-secondary-900">
                          {transaction.items.map((item, index) => (
                            <div key={index} className="mb-1">
                              {item.product.name} x{item.quantity} ({item.rentalDays} days)
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                        {formatCurrency(transaction.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1 capitalize">{transaction.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {transaction.createdAt.toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {transaction.dueDate.toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-warning-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Pending</p>
                <p className="text-2xl font-semibold text-secondary-900">
                  {transactions.filter(t => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Active</p>
                <p className="text-2xl font-semibold text-secondary-900">
                  {transactions.filter(t => t.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-success-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Completed</p>
                <p className="text-2xl font-semibold text-secondary-900">
                  {transactions.filter(t => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-error-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Cancelled</p>
                <p className="text-2xl font-semibold text-secondary-900">
                  {transactions.filter(t => t.status === 'cancelled').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;