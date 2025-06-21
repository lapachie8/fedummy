export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  category: string;
  imageUrl: string;
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  rentalDays: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
}

export interface OrderDetails {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  shippingMethod: string;
  orderTotal: number;
  items: CartItem[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, rentalDays: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateRentalDays: (productId: number, days: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

export interface OrderContextType {
  order: OrderDetails | null;
  setPersonalInfo: (info: OrderDetails['personalInfo']) => void;
  setPaymentMethod: (method: string) => void;
  setShippingMethod: (method: string) => void;
  completeOrder: () => void;
  resetOrder: () => void;
}