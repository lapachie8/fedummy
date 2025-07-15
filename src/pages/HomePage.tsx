import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { getAllProducts } from '../data/products';
import ProductGrid from '../components/ProductGrid';

interface LandingPageData {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  featuredProducts: any[];
  categories: Array<{
    category: string;
    product_count: number;
    available_count: number;
  }>;
  statistics: {
    totalProducts: number;
    totalCategories: number;
    totalCustomers: number;
    completedOrders: number;
  };
  testimonials: Array<{
    id: number;
    name: string;
    rating: number;
    comment: string;
    avatar: string;
  }>;
}
const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch landing page data from API
    const fetchLandingData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/landing');
        if (response.ok) {
          const data = await response.json();
          setLandingData(data.data);
          setFeaturedProducts(data.data.featuredProducts);
        } else {
          // Fallback to local data if API fails
          const products = getAllProducts();
          setFeaturedProducts(products.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch landing data:', error);
        // Fallback to local data
        const products = getAllProducts();
        setFeaturedProducts(products.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const heroData = landingData?.hero || {
    title: "Sewa Equipment Berkualitas, Untuk Kebutuhan Cosplaymu",
    subtitle: "Produk berkualitas, periode sewa fleksibel, dan layanan yang luar biasa. Rasakan kenyamanan menyewa daripada membeli.",
    cta: "Cari Produk"
  };

  const categories = landingData?.categories || [];
  const statistics = landingData?.statistics;
  const testimonials = landingData?.testimonials || [];

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-white">
                {heroData.title}
              </h1>
              <p className="text-lg mb-8 text-primary-100">
                {heroData.subtitle}
              </p>
              
              <div className="relative mt-8">
                <input
                  type="text"
                  placeholder="mau sewa apa hari ini?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-md text-secondary-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <Link 
                  to={`/products?search=${encodeURIComponent(searchQuery)}`}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600"
                >
                  <Search className="w-5 h-5" />
                </Link>
              </div>
              
              <div className="mt-6">
                <Link to="/products" className="btn-accent">
                  {heroData.cta}
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 lg:pl-12">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden shadow-lg transform translate-y-4">
                    <img 
                      src="/img/ayang.png" 
                      alt="Feixiao" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                      }}
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src="/img/kafka.png" 
                      alt="Kafka" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src="/img/frieren.png" 
                      alt="Frieren" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                      }}
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg transform translate-y-4">
                    <img 
                      src="/img/katana.png" 
                      alt="Gaming Equipment" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/2582818/pexels-photo-2582818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories section */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((categoryData) => (
              <Link 
                key={categoryData.category}
                to={`/products?category=${categoryData.category}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-medium text-lg mb-2">{categoryData.category}</h3>
                <p className="text-sm text-secondary-600">
                  {categoryData.available_count} available
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Statistics section */}
      {statistics && (
        <section className="py-16 bg-primary-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{statistics.totalProducts}+</div>
                <div className="text-secondary-600">Products Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{statistics.totalCategories}</div>
                <div className="text-secondary-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{statistics.totalCustomers}+</div>
                <div className="text-secondary-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{statistics.completedOrders}+</div>
                <div className="text-secondary-600">Orders Completed</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials section */}
      {testimonials.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-secondary-600 italic">"{testimonial.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Ada apa aja?</h2>
            <Link to="/products" className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;