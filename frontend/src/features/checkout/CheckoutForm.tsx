import React, { useState } from 'react';
import { X, MapPin, Store, Send, Crosshair } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { api } from '../../services/api';
import { formatOrderForWhatsApp } from '../../utils/whatsapp';

interface CheckoutFormProps {
  onClose: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [address, setAddress] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.getTotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización.');
      return;
    }
    setLocationLoading(true);
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
        setAddress(prev => prev ? `${prev} | GPS: ${mapsUrl}` : `GPS: ${mapsUrl}`);
        setLocationLoading(false);
      },
      (err) => {
        console.error(err);
        setError('No pudimos acceder a tu ubicación. Por favor, revisá los permisos de tu navegador.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setLoading(true);
    setError('');

    try {
      // 1. Prepare data for backend
      const payload = {
        customerName: name,
        customerPhone: phone,
        type: type,
        deliveryAddress: type === 'DELIVERY' ? address : null,
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          modifiers: item.selectedModifiers.map(m => m.id),
          notes: item.notes
        }))
      };

      // 2. Send to backend POST /orders
      const response = await api.post('/orders', payload);
      
      // 3. Clear cart
      clearCart();

      // 4. Redirect to WhatsApp
      const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5493834974026';
      const whatsappUrl = formatOrderForWhatsApp(response.data, whatsappNumber);
      
      window.open(whatsappUrl, '_blank');
      onClose();

    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al procesar el pedido. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 rounded-3xl w-full max-w-md overflow-hidden border border-zinc-800 shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
           <h2 className="text-xl font-bold text-white">Finalizar Pedido</h2>
           <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
             <X size={20} />
           </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-sm font-medium mb-1">Nombre y Apellido</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                placeholder="Juan Pérez"
              />
            </div>
            
            <div>
              <label className="block text-zinc-400 text-sm font-medium mb-1">Teléfono (WhatsApp)</label>
              <input 
                required
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                placeholder="3815123456"
              />
            </div>

            <div className="pt-2">
              <label className="block text-zinc-400 text-sm font-medium mb-2">Método de entrega</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('DELIVERY')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${type === 'DELIVERY' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
                >
                  <MapPin size={24} className="mb-2" />
                  <span className="font-semibold">Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('PICKUP')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${type === 'PICKUP' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
                >
                  <Store size={24} className="mb-2" />
                  <span className="font-semibold">Retiro en local</span>
                </button>
              </div>
            </div>

            {type === 'DELIVERY' && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 space-y-3">
                <label className="block text-zinc-400 text-sm font-medium">Dirección de envío</label>
                
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-amber-500 border border-zinc-700 hover:border-amber-500/50 py-3 px-4 rounded-xl transition-all font-medium text-sm"
                >
                  {locationLoading ? (
                    <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Crosshair size={16} />
                  )}
                  {locationLoading ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual (GPS)'}
                </button>

                <textarea 
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                  placeholder="Ej: Calle Falsa 123, Depto 4B. O pegá el link de Maps."
                />
              </div>
            )}

            {type === 'PICKUP' && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 space-y-3">
                <div className="p-4 bg-zinc-800/80 border border-zinc-700 rounded-xl">
                  <h3 className="text-zinc-200 font-medium mb-1">Dirección de retiro</h3>
                  <p className="text-zinc-400 text-sm mb-3">Av Felipe Varela 1243. Valle Viejo</p>
                  <a 
                    href="https://maps.app.goo.gl/YTHAegeqbzpTHpKx8?g_st=iw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors"
                  >
                    <MapPin size={16} />
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-4 bg-zinc-900 border-t border-zinc-800">
           <button 
             type="submit"
             form="checkout-form"
             disabled={loading}
             className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl transition-transform active:scale-95 flex items-center justify-center gap-2"
           >
             {loading ? (
               <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
             ) : (
               <>Enviar Pedido por WhatsApp <Send size={18} /></>
             )}
           </button>
           <p className="text-center text-zinc-500 text-xs mt-3">Total a pagar: ${cartTotal.toLocaleString('es-AR')}</p>
        </div>
      </div>
    </div>
  );
};
