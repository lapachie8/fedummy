import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductGrid from '../components/ProductGrid';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const featuredProducts = products.slice(0, 4);
  
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-white">
                Sewa Equipment Berkualitas, Untuk Kebutuhan Cosplaymu
              </h1>
              <p className="text-lg mb-8 text-primary-100">
                Produk berkualitas, periode sewa fleksibel, dan layanan yang luar biasa. Rasakan kenyamanan menyewa daripada membeli.
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
                  Cari Produk
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 lg:pl-12">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden shadow-lg transform translate-y-4">
                    <img 
                      src="./public/img/ayang.png" 
                      alt="Feixiao" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src="" 
                      alt="Anime" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src="" 
                      alt="Anime" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg transform translate-y-4">
                    <img 
                      src="" 
                      alt="anime" 
                      className="w-full h-48 object-cover"
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
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(1).map((category) => (
              <Link 
                key={category}
                to={`/products?category=${category}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-medium text-lg mb-2">{category}</h3>
                <p className="text-sm text-secondary-600">
                  View products
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
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
      
      {/* Why choose us section
      <section className="py-16 bg-secondary-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Why Choose Juiweaprent</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Save Time & Money</h3>
              <p className="text-secondary-300">
                Rent only when you need it. No need to buy expensive equipment that you'll rarely use.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Quality Guaranteed</h3>
              <p className="text-secondary-300">
                All our products are regularly maintained and checked to ensure they're in perfect condition.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Flexible Pricing</h3>
              <p className="text-secondary-300">
                Daily, weekly, and monthly rental options to suit your needs and budget.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Easy Delivery</h3>
              <p className="text-secondary-300">
                Choose between pickup or delivery options for maximum convenience.
              </p>
            </div>
          </div>
        </div>
      </section> */}
      
      {/* CTA Section
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to rent your next item?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-primary-100">
            Browse our extensive catalog of high-quality rental items and find exactly what you need.
          </p>
          <Link to="/products" className="btn bg-white text-primary-600 hover:bg-primary-50 focus:ring-white">
            Start Browsing
          </Link>
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;