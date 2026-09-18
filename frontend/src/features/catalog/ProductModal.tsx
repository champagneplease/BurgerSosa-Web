import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';
import { useCartStore } from '../../store/useCartStore';
import type { Product, Modifier } from '../../store/useCartStore';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [modifierCounts, setModifierCounts] = useState<Record<number, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const incrementModifier = (modId: number) => {
    setModifierCounts(prev => {
      const current = prev[modId] || 0;
      if (current >= 6) return prev;
      return { ...prev, [modId]: current + 1 };
    });
  };

  const decrementModifier = (modId: number) => {
    setModifierCounts(prev => {
      const current = prev[modId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[modId];
        return next;
      }
      return { ...prev, [modId]: current - 1 };
    });
  };

  const toggleModifier = (modId: number) => {
    setModifierCounts(prev => {
      const next = { ...prev };
      if (next[modId]) {
        delete next[modId];
      } else {
        next[modId] = 1;
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    const basePrice = Number(product.price);
    const selectedModifiers: Modifier[] = [];
    let modifiersPrice = 0;

    Object.entries(modifierCounts).forEach(([modId, count]) => {
      const mod = product.modifiers.find(m => m.id === Number(modId));
      if (mod) {
        modifiersPrice += Number(mod.price) * count;
        for (let i = 0; i < count; i++) {
          selectedModifiers.push(mod);
        }
      }
    });

    const unitPrice = basePrice + modifiersPrice;

    addItem({
      id: crypto.randomUUID(),
      product,
      quantity,
      selectedModifiers,
      unitPrice,
      notes: notes.trim() !== '' ? notes.trim() : undefined
    });
    onClose();
  };

  const currentModifiersPrice = Object.entries(modifierCounts).reduce((total, [modId, count]) => {
    const mod = product.modifiers.find(m => m.id === Number(modId));
    return total + (mod ? Number(mod.price) * count : 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-brand-surface rounded-3xl w-full max-w-md overflow-hidden border border-white/10 shadow-2xl relative flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-brand-light transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-full h-48 bg-gradient-to-tr from-brand-accent to-brand-accent/80 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            {product.image ? (
              <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover mix-blend-overlay opacity-50" />
            ) : (
             <div className="w-full h-full flex items-center justify-center text-4xl">🍔</div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-zinc-900 to-transparent">
             <h2 className="text-2xl font-bold text-brand-light">{product.name}</h2>
             <p className="text-brand-light/80 font-medium">${Number(product.price).toLocaleString('es-AR')}</p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-brand-light/60 text-sm mb-6">{product.description || "Deliciosa hamburguesa artesanal."}</p>

          {product.modifiers && product.modifiers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-brand-light font-semibold mb-3">Agregados & Preferencias</h3>
              <div className="space-y-3">
                {product.modifiers.map(mod => {
                   const count = modifierCounts[mod.id] || 0;
                   const isSelected = count > 0;
                   const price = Number(mod.price);
                   return (
                     <div 
                       key={mod.id} 
                       onClick={() => {
                         if (price === 0) {
                           toggleModifier(mod.id);
                         } else if (count === 0) {
                           incrementModifier(mod.id);
                         }
                       }} 
                       className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-brand-accent bg-brand-accent/10' : 'border-white/10 hover:border-white/20'}`}
                     >
                       <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-brand-accent border-brand-accent' : 'border-zinc-600'}`}>
                           {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                         </div>
                         <div>
                           <span className="text-brand-light/90 block">{mod.name}</span>
                           {price > 0 && <span className="text-brand-light/60 text-sm block">+${price.toLocaleString('es-AR')}</span>}
                         </div>
                       </div>
                       
                       {isSelected && price > 0 && (
                         <div className="flex items-center gap-3 bg-brand-surface rounded-lg p-1 border border-white/10" onClick={(e) => e.stopPropagation()}>
                           <button onClick={(e) => { e.stopPropagation(); decrementModifier(mod.id); }} className="p-1 rounded-md hover:bg-white/10 text-brand-light/60 transition-colors">
                             <Minus size={14} />
                           </button>
                           <span className="text-brand-light font-medium w-3 text-center text-sm">{count}</span>
                           <button onClick={(e) => { e.stopPropagation(); incrementModifier(mod.id); }} className="p-1 rounded-md hover:bg-white/10 text-brand-light/60 transition-colors">
                             <Plus size={14} />
                           </button>
                         </div>
                       )}
                     </div>
                   )
                })}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-brand-light font-semibold mb-3">Aclaraciones adicionales</h3>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Sin cebolla, la hamburguesa bien cocida, etc."
              className="w-full bg-brand-dark border border-white/10 text-brand-light rounded-xl p-3 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-amber-500 resize-none h-20 text-sm"
            />
          </div>

          <div className="flex items-center justify-between py-4 border-t border-white/10">
            <span className="text-brand-light font-medium">Cantidad</span>
            <div className="flex items-center gap-4 bg-white/10 rounded-full p-1">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 rounded-full hover:bg-white/20 text-brand-light transition-colors"><Minus size={16} /></button>
              <span className="text-brand-light font-semibold w-4 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity < 6 ? quantity + 1 : 6)} className="p-2 rounded-full hover:bg-white/20 text-brand-light transition-colors"><Plus size={16} /></button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-brand-surface border-t border-white/10">
           <button 
             onClick={handleAddToCart}
             className="w-full bg-brand-accent hover:bg-brand-accent/80 text-black font-bold py-4 rounded-2xl transition-transform active:scale-95 flex items-center justify-between px-6"
           >
             <span>Agregar al pedido</span>
             <span>${((Number(product.price) + currentModifiersPrice) * quantity).toLocaleString('es-AR')}</span>
           </button>
        </div>
      </div>
    </div>
  );
};
