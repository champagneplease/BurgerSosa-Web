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
      className="group relative bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 hover:border-amber-500/50 rounded-2xl p-4 flex gap-4 cursor-pointer transition-all duration-300 hover:bg-zinc-800/60 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.15)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex-shrink-0 flex items-center justify-center overflow-hidden relative z-10 shadow-inner border border-white/5">
        {product.image ? (
           <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
           <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🍔</span>
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 py-1 relative z-10">
        <div>
          <h3 className="text-white font-bold text-lg mb-1 tracking-tight group-hover:text-amber-400 transition-colors">{product.name}</h3>
          <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed font-light">
            {product.description || "Preparada en el momento con ingredientes frescos."}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
           <span className="text-amber-500 font-bold text-lg">${Number(product.price).toLocaleString('es-AR')}</span>
           <div className="w-8 h-8 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-white group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:text-black transition-all shadow-sm group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] group-active:scale-95">
              <span className="text-lg leading-none mb-0.5">+</span>
           </div>
        </div>
      </div>
    </div>
  );
};
