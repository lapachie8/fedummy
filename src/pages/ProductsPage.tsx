import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllProducts } from '../data/products';
import ProductGrid from '../components/ProductGrid';
import CategoryFilter from '../components/CategoryFilter';
import { Search, RefreshCw } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [filteredProducts, setFilteredProducts] = useState(getAllProducts());
  const [loading, setLoading] = useState(false);
  
  const refreshProducts = () => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      const products = getAllProducts();
      applyFilters(products);
      setLoading(false);
    }, 500);
  };
  
  const applyFilters = (products = getAllProducts()) => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(result);
  };
  
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, searchQuery]);
  
  // Refresh products when component mounts to show newly added products
  useEffect(() => {
    refreshProducts();
  }, []);
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchParams(params => {
      if (category === 'All') {
        params.delete('category');
      } else {
        params.set('category', category);
      }
      return params;
    });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(params => {
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      return params;
    });
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Our Rental Products</h1>
          <button
            onClick={refreshProducts}
            className="btn-outline flex items-center"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters column */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
              
              <CategoryFilter 
                selectedCategory={selectedCategory} 
                onSelectCategory={handleCategorySelect} 
              />
              
              <div className="pt-4 border-t border-secondary-200">
                <h3 className="text-lg font-medium mb-3">Availability</h3>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox text-primary-600 h-5 w-5" defaultChecked />
                  <span className="ml-2">Show only available items</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Products column */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3"></div>
                <span>Loading products...</span>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-secondary-600">
                    Showing {filteredProducts.length} products
                  </p>
                  <select 
                    className="input w-auto"
                    defaultValue="recommended"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
                
                <ProductGrid products={filteredProducts} />
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-secondary-600 mb-8">
                  Try adjusting your filters or search criteria.
                </p>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setSearchParams({});
                    refreshProducts();
                  }}
                  className="btn-primary"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;