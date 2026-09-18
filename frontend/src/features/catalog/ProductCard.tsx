import React from 'react';
import type { Product } from '../../store/useCartStore';
import { getImageUrl } from '../../utils/imageUrl';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className="group relative bg-brand-surface border border-white/5 hover:border-brand-accent/30 rounded-2xl p-4 flex gap-4 cursor-pointer transition-all duration-300 hover:bg-brand-surface/80 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
    >
      <div className="w-28 h-28 rounded-xl bg-brand-dark flex-shrink-0 flex items-center justify-center overflow-hidden relative z-10">
        {product.image ? (
           <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
           <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🍔</span>
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 py-1 relative z-10">
        <div>
          <h3 className="text-brand-light font-bold text-lg mb-1 tracking-tight group-hover:text-brand-accent transition-colors">{product.name}</h3>
          <p className="text-brand-light/70 text-sm line-clamp-2 leading-relaxed font-light">
            {product.description || "Preparada en el momento con ingredientes frescos."}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
           <span className="text-brand-accent font-bold text-lg">${Number(product.price).toLocaleString('es-AR')}</span>
           <div className="w-8 h-8 rounded-full bg-brand-dark/50 border border-white/10 flex items-center justify-center text-brand-light group-hover:bg-brand-accent group-hover:border-brand-accent group-hover:text-brand-dark transition-all group-active:scale-95">
              <span className="text-lg leading-none mb-0.5">+</span>
           </div>
        </div>
      </div>
    </div>
  );
};
