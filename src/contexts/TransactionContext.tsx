import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Transaction, CartItem } from '../types';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;
  getTotalRevenue: () => number;
  getCompletedTransactions: () => Transaction[];
}

const defaultTransactionContext: TransactionContextType = {
  transactions: [],
  addTransaction: () => {},
  updateTransactionStatus: () => {},
  getTotalRevenue: () => 0,
  getCompletedTransactions: () => [],
};

const TransactionContext = createContext<TransactionContextType>(defaultTransactionContext);

export const useTransactions = () => useContext(TransactionContext);

interface TransactionProviderProps {
  children: ReactNode;
}

// Helper functions for localStorage operations
const getStoredTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((transaction: any) => ({
        ...transaction,
        createdAt: new Date(transaction.createdAt),
        dueDate: new Date(transaction.dueDate)
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading transactions from localStorage:', error);
    return [];
  }
};

const saveTransactionsToStorage = (transactions: Transaction[]) => {
  try {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
};

// Generate mock transactions for demo
const generateMockTransactions = (): Transaction[] => {
  return [
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
      status: 'completed',
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
      status: 'active',
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
    },
    {
      id: 'TXN004',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah@example.com',
      items: [
        {
          product: {
            id: 9,
            name: 'Samurai Katana Replica',
            description: 'High-quality katana replica',
            price: 250000,
            priceUnit: 'item',
            category: 'Anime',
            imageUrl: '/img/katana.png',
            available: true
          },
          quantity: 1,
          rentalDays: 14
        }
      ],
      total: 3500000,
      status: 'completed',
      createdAt: new Date('2024-01-05'),
      dueDate: new Date('2024-01-19')
    },
    {
      id: 'TXN005',
      customerName: 'Alex Chen',
      customerEmail: 'alex@example.com',
      items: [
        {
          product: {
            id: 10,
            name: 'Fantasy Bow Set',
            description: 'Complete bow set for archery cosplay',
            price: 175000,
            priceUnit: 'item',
            category: 'Anime',
            imageUrl: '/img/bow1.png',
            available: true
          },
          quantity: 1,
          rentalDays: 7
        }
      ],
      total: 1225000,
      status: 'completed',
      createdAt: new Date('2024-01-12'),
      dueDate: new Date('2024-01-19')
    }
  ];
};

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Load transactions from localStorage or initialize with mock data
    const stored = getStoredTransactions();
    if (stored.length === 0) {
      const mockTransactions = generateMockTransactions();
      setTransactions(mockTransactions);
      saveTransactionsToStorage(mockTransactions);
    } else {
      setTransactions(stored);
    }
  }, []);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `TXN${Date.now()}`,
      createdAt: new Date()
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveTransactionsToStorage(updatedTransactions);
  };

  const updateTransactionStatus = (id: string, status: Transaction['status']) => {
    const updatedTransactions = transactions.map(transaction =>
      transaction.id === id ? { ...transaction, status } : transaction
    );
    setTransactions(updatedTransactions);
    saveTransactionsToStorage(updatedTransactions);
  };

  const getTotalRevenue = (): number => {
    return transactions
      .filter(transaction => transaction.status === 'completed')
      .reduce((total, transaction) => total + transaction.total, 0);
  };

  const getCompletedTransactions = (): Transaction[] => {
    return transactions.filter(transaction => transaction.status === 'completed');
  };

  const value = {
    transactions,
    addTransaction,
    updateTransactionStatus,
    getTotalRevenue,
    getCompletedTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};