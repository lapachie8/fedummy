import React from 'react';
import { categories } from '../data/products';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full border transition-all ${
              selectedCategory === category
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-secondary-300 hover:border-primary-600 hover:bg-primary-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;