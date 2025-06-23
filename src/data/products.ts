import { Product } from '../types';

// Helper function to get products from localStorage
const getStoredProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem('customProducts');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
    return [];
  }
};

// Helper function to save products to localStorage
export const saveProductToStorage = (product: Omit<Product, 'id'>): Product => {
  try {
    const existingProducts = getStoredProducts();
    const newId = Math.max(0, ...defaultProducts.map(p => p.id), ...existingProducts.map(p => p.id)) + 1;
    
    const newProduct: Product = {
      ...product,
      id: newId
    };
    
    const updatedProducts = [...existingProducts, newProduct];
    localStorage.setItem('customProducts', JSON.stringify(updatedProducts));
    
    return newProduct;
  } catch (error) {
    console.error('Error saving product to localStorage:', error);
    throw new Error('Failed to save product');
  }
};

// Helper function to delete product from localStorage
export const deleteProductFromStorage = (productId: number): void => {
  try {
    const existingProducts = getStoredProducts();
    const updatedProducts = existingProducts.filter(p => p.id !== productId);
    localStorage.setItem('customProducts', JSON.stringify(updatedProducts));
  } catch (error) {
    console.error('Error deleting product from localStorage:', error);
    throw new Error('Failed to delete product');
  }
};

// Default products with corrected image paths
export const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Feixiao Cosplay Set',
    description: 'Aksesoris lengkap untuk bermain Honkai Star-Rail, termasuk controller, headset, dan mouse pad khusus.',
    price: 150000,
    priceUnit: 'item',
    category: 'Honkai Star-Rail',
    imageUrl: '/img/ayang.png',
    available: true
  },
  {
    id: 2,
    name: 'Kafka Cosplay Outfit',
    description: 'Kostum Kafka lengkap dengan aksesoris untuk cosplay Honkai Star-Rail yang sempurna.',
    price: 200000,
    priceUnit: 'item',
    category: 'Honkai Star-Rail',
    imageUrl: '/img/kafka.png',
    available: true
  },
  {
    id: 3,
    name: 'Frieren Magic Staff',
    description: 'Tongkat sihir Frieren yang detail dan berkualitas tinggi untuk cosplay anime.',
    price: 125000,
    priceUnit: 'item',
    category: 'Anime',
    imageUrl: '/img/frieren.png',
    available: true
  },
  {
    id: 4,
    name: 'Gaming Headset Premium',
    description: 'Headset gaming berkualitas tinggi dengan suara jernih dan desain ergonomis.',
    price: 75000,
    priceUnit: 'item',
    category: 'Gaming',
    imageUrl: 'https://images.pexels.com/photos/2582818/pexels-photo-2582818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    available: true
  },
  {
    id: 5,
    name: 'Professional Camera',
    description: 'Kamera profesional untuk dokumentasi cosplay dan fotografi berkualitas tinggi.',
    price: 300000,
    priceUnit: 'item',
    category: 'Photography',
    imageUrl: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    available: true
  },
  {
    id: 6,
    name: 'Cosplay Wig Styling Kit',
    description: 'Set lengkap untuk styling wig cosplay dengan berbagai tools profesional.',
    price: 85000,
    priceUnit: 'item',
    category: 'Cosplay Tools',
    imageUrl: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    available: true
  },
  {
    id: 7,
    name: 'LED Light Panel Set',
    description: 'Panel LED untuk pencahayaan fotografi cosplay yang sempurna.',
    price: 180000,
    priceUnit: 'item',
    category: 'Photography',
    imageUrl: 'https://images.pexels.com/photos/1751550/pexels-photo-1751550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    available: true
  },
  {
    id: 8,
    name: 'Anime Character Mask',
    description: 'Topeng karakter anime berkualitas tinggi dengan detail yang sempurna.',
    price: 95000,
    priceUnit: 'item',
    category: 'Anime',
    imageUrl: 'https://images.pexels.com/photos/3784221/pexels-photo-3784221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    available: true
  },
  {
    id: 9,
    name: 'Samurai Katana Replica',
    description: 'Replika katana samurai berkualitas tinggi untuk cosplay dan koleksi.',
    price: 250000,
    priceUnit: 'item',
    category: 'Anime',
    imageUrl: '/img/katana.png',
    available: true
  },
  {
    id: 10,
    name: 'Fantasy Bow Set',
    description: 'Set busur fantasi lengkap dengan anak panah untuk cosplay archer.',
    price: 175000,
    priceUnit: 'item',
    category: 'Anime',
    imageUrl: '/img/bow1.png',
    available: true
  },
  {
    id: 11,
    name: 'Medieval Sword Replica',
    description: 'Replika pedang medieval yang detail untuk cosplay knight atau warrior.',
    price: 220000,
    priceUnit: 'item',
    category: 'Anime',
    imageUrl: '/img/sword.png',
    available: true
  },
  {
    id: 12,
    name: 'Elven Bow Deluxe',
    description: 'Busur elven mewah dengan ukiran detail untuk cosplay fantasy.',
    price: 195000,
    priceUnit: 'item',
    category: 'Anime',
    imageUrl: '/img/bow2.png',
    available: true
  }
];

// Combined products function
export const getAllProducts = (): Product[] => {
  const storedProducts = getStoredProducts();
  return [...defaultProducts, ...storedProducts];
};

// Export for backward compatibility
export const products = getAllProducts();

export const categories = [
  'All',
  'Honkai Star-Rail',
  'Anime',
  'Gaming',
  'Photography',
  'Cosplay Tools'
];