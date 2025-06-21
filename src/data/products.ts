import { Product } from '../types';

export const products: Product[] = [
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
  }
];

export const categories = [
  'All',
  'Honkai Star-Rail',
  'Anime',
  'Gaming',
  'Photography',
  'Cosplay Tools'
];