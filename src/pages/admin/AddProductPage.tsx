import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { categories } from '../../data/products';
import { saveProductToStorage } from '../../data/products';
import { Upload, Save, ArrowLeft, Image, AlertCircle } from 'lucide-react';

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
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  // Redirect if not admin
  if (!isAdmin) {
    navigate('/');
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Update image preview when imageUrl changes
    if (name === 'imageUrl') {
      setImagePreview(value);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          imageUrl: base64String
        }));
        setImagePreview(base64String);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('Product description is required');
      return false;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save product to localStorage
      const newProduct = saveProductToStorage({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        priceUnit: 'item',
        category: formData.category,
        imageUrl: formData.imageUrl || 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        available: formData.available,
      });
      
      console.log('New product added:', newProduct);
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
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
            The new product has been added to the catalog and is now available for rent.
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
            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-error-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              </div>
            )}
            
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
                    placeholder="Enter product name"
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
                    placeholder="150000"
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
                    Product Image
                  </label>
                  <div className="space-y-3">
                    <div className="flex">
                      <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                        onChange={handleChange}
                        className="input flex-grow"
                        placeholder="https://example.com/image.jpg or /img/product.png"
                      />
                    </div>
                    
                    <div className="text-center">
                      <span className="text-sm text-secondary-500">OR</span>
                    </div>
                    
                    <div>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-secondary-300 border-dashed rounded-lg cursor-pointer bg-secondary-50 hover:bg-secondary-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-secondary-400" />
                          <p className="mb-2 text-sm text-secondary-500">
                            <span className="font-semibold">Click to upload</span> an image
                          </p>
                          <p className="text-xs text-secondary-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-secondary-500 mt-2">
                    You can either provide an image URL or upload a file. Uploaded images will be stored as base64.
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
                    placeholder="Describe the product features, quality, and what makes it special..."
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
              
              {imagePreview && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Image Preview
                  </label>
                  <div className="w-48 h-48 border border-secondary-300 rounded-md overflow-hidden bg-secondary-50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview('')}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding Product...
                    </>
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