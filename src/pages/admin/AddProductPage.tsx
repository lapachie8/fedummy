import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { categories } from '../../data/products';
import { Upload, Save, ArrowLeft } from 'lucide-react';

const AddProductPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: categories[1], // Default to first non-"All" category
    imageUrl: '',
    available: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Redirect if not admin
  if (!isAdmin) {
    navigate('/');
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send this data to your backend
      console.log('New product data:', {
        ...formData,
        price: parseFloat(formData.price),
        id: Date.now(), // Generate temporary ID
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Save className="w-8 h-8 text-success-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Product Added Successfully!</h2>
          <p className="text-secondary-600 mb-4">
            The new product has been added to the catalog.
          </p>
          <p className="text-sm text-secondary-500">
            Redirecting to products page...
          </p>
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
          <h1 className="text-3xl font-bold">Add New Product</h1>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-secondary-700 mb-1">
                    Price (Rp) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="input"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-secondary-700 mb-1">
                    Image URL
                  </label>
                  <div className="flex">
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="input flex-grow"
                      placeholder="https://example.com/image.jpg or /img/product.png"
                    />
                    <button
                      type="button"
                      className="btn-outline ml-2"
                      onClick={() => {
                        // In a real app, this would open a file picker
                        alert('File upload functionality would be implemented here');
                      }}
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-secondary-500 mt-1">
                    You can use a URL or upload to /public/img/ folder
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="input"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleChange}
                      className="form-checkbox text-primary-600 h-5 w-5 mr-2"
                    />
                    <span className="text-sm font-medium text-secondary-700">
                      Available for rent
                    </span>
                  </label>
                </div>
              </div>
              
              {formData.imageUrl && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Image Preview
                  </label>
                  <div className="w-32 h-32 border border-secondary-300 rounded-md overflow-hidden">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    'Adding Product...'
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;