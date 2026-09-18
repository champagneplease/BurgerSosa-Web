import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '../../store/useCartStore';

interface Category {
  id: number;
  name: string;
  description?: string;
  products: Product[];
}

interface CategorySectionProps {
  category: Category;
  onProductClick: (product: Product) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category, onProductClick }) => {
  if (!category.products || category.products.length === 0) return null;

  return (
    <section className="py-8 scroll-mt-24" id={`category-${category.id}`}>
      <h2 className="text-3xl font-black text-brand-light mb-2 tracking-tight">
        {category.name}
      </h2>
      {category.description && (
        <p className="text-brand-light/60 mb-6">{category.description}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {category.products.map(product => (
          <ProductCard key={product.id} product={product} onClick={onProductClick} />
        ))}
      </div>
    </section>
  );
};
