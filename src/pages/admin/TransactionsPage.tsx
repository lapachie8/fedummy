import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { ArrowLeft, Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const TransactionsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed' | 'cancelled'>('all');
  
  // Redirect if not admin
  if (!isAdmin) {
    navigate('/');
    return null;
  }
  
  useEffect(() => {
    // Mock data - in a real app, this would come from your backend
    const mockTransactions: Transaction[] = [
      {
        id: 'TXN001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            product: {
              id: 1,
              name: 'Feixiao Cosplay Set',
              description: 'Complete cosplay set',
              price: 150000,
              priceUnit: 'item',
              category: 'Honkai Star-Rail',
              imageUrl: '/img/ayang.png',
              available: true
            },
            quantity: 1,
            rentalDays: 3
          }
        ],
        total: 450000,
        status: 'active',
        createdAt: new Date('2024-01-15'),
        dueDate: new Date('2024-01-18')
      },
      {
        id: 'TXN002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        items: [
          {
            product: {
              id: 2,
              name: 'Kafka Cosplay Outfit',
              description: 'Premium cosplay outfit',
              price: 200000,
              priceUnit: 'item',
              category: 'Honkai Star-Rail',
              imageUrl: '/img/kafka.png',
              available: true
            },
            quantity: 1,
            rentalDays: 7
          }
        ],
        total: 1400000,
        status: 'pending',
        createdAt: new Date('2024-01-16'),
        dueDate: new Date('2024-01-23')
      },
      {
        id: 'TXN003',
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        items: [
          {
            product: {
              id: 3,
              name: 'Frieren Magic Staff',
              description: 'Detailed magic staff',
              price: 125000,
              priceUnit: 'item',
              category: 'Anime',
              imageUrl: '/img/frieren.png',
              available: true
            },
            quantity: 2,
            rentalDays: 5
          }
        ],
        total: 1250000,
        status: 'completed',
        createdAt: new Date('2024-01-10'),
        dueDate: new Date('2024-01-15')
      }
    ];
    
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);
  
  const filteredTransactions = transactions.filter(transaction => 
    filter === 'all' || transaction.status === filter
  );
  
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
        
        {/* Summary Cards */}
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