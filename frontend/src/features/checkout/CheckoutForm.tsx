import React, { useState } from 'react';
import { X, MapPin, Store, Send, Crosshair, Banknote, CreditCard } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'TRANSFERENCIA'>('EFECTIVO');
  const [paymentAlias, setPaymentAlias] = useState('');

  React.useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data?.paymentAlias) {
        setPaymentAlias(res.data.paymentAlias);
      }
    }).catch(console.error);
  }, []);

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
        paymentMethod: paymentMethod,
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
      <div className="bg-brand-surface rounded-3xl w-full max-w-md overflow-hidden border border-white/10 shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
           <h2 className="text-xl font-bold text-brand-light">Finalizar Pedido</h2>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-brand-light/60">
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
              <label className="block text-brand-light/60 text-sm font-medium mb-1">Nombre y Apellido</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-brand-light rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-amber-500 transition-all"
                placeholder="Juan Pérez"
              />
            </div>
            
            <div>
              <label className="block text-brand-light/60 text-sm font-medium mb-1">Teléfono (WhatsApp)</label>
              <input 
                required
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-brand-light rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-amber-500 transition-all"
                placeholder="3815123456"
              />
            </div>

            <div className="pt-2">
              <label className="block text-brand-light/60 text-sm font-medium mb-2">Método de entrega</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('DELIVERY')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${type === 'DELIVERY' ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-white/20 text-brand-light/60 hover:border-zinc-600'}`}
                >
                  <MapPin size={24} className="mb-2" />
                  <span className="font-semibold">Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('PICKUP')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${type === 'PICKUP' ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-white/20 text-brand-light/60 hover:border-zinc-600'}`}
                >
                  <Store size={24} className="mb-2" />
                  <span className="font-semibold">Retiro en local</span>
                </button>
              </div>
            </div>

            {type === 'DELIVERY' && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 space-y-3">
                <label className="block text-brand-light/60 text-sm font-medium">Dirección de envío</label>
                
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className="w-full flex items-center justify-center gap-2 bg-white/10/80 hover:bg-white/20/80 text-brand-accent border border-white/20 hover:border-brand-accent/50 py-3 px-4 rounded-xl transition-all font-medium text-sm"
                >
                  {locationLoading ? (
                    <div className="w-4 h-4 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
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
                  className="w-full bg-white/10 border border-white/20 text-brand-light rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                  placeholder="Ej: Calle Falsa 123, Depto 4B. O pegá el link de Maps."
                />
              </div>
            )}

            {type === 'PICKUP' && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 space-y-3">
                <div className="p-4 bg-white/10/80 border border-white/20 rounded-xl">
                  <h3 className="text-brand-light/90 font-medium mb-1">Dirección de retiro</h3>
                  <p className="text-brand-light/60 text-sm mb-3">Av Felipe Varela 1243. Valle Viejo</p>
                  <a 
                    href="https://maps.app.goo.gl/YTHAegeqbzpTHpKx8?g_st=iw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-accent/80 text-sm font-medium transition-colors"
                  >
                    <MapPin size={16} />
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-white/10">
              <label className="block text-brand-light/60 text-sm font-medium mb-2">Método de pago</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('EFECTIVO')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${paymentMethod === 'EFECTIVO' ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-white/20 text-brand-light/60 hover:border-zinc-600'}`}
                >
                  <Banknote size={24} className="mb-2" />
                  <span className="font-semibold">Efectivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('TRANSFERENCIA')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${paymentMethod === 'TRANSFERENCIA' ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-white/20 text-brand-light/60 hover:border-zinc-600'}`}
                >
                  <CreditCard size={24} className="mb-2" />
                  <span className="font-semibold">Transferencia</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'TRANSFERENCIA' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                {type === 'DELIVERY' ? (
                  <div className="p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-xl text-center">
                    <p className="text-brand-accent font-medium text-sm mb-1">Costo de envío a confirmar 📍</p>
                    <p className="text-brand-light/60 text-sm mt-2">Por favor <strong>no transfieras todavía</strong>. Envía el pedido y te confirmaremos el costo exacto del envío a tu ubicación junto con el Alias por WhatsApp.</p>
                  </div>
                ) : (
                  <div className="p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-xl text-center">
                    <p className="text-brand-accent font-medium text-sm mb-1">Transferir al Alias / CVU:</p>
                    <p className="text-brand-light font-mono font-bold text-lg select-all">{paymentAlias || 'No configurado'}</p>
                    <p className="text-brand-light/60 text-xs mt-2">No olvides enviar el comprobante de pago por WhatsApp.</p>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="p-4 bg-brand-surface border-t border-white/10">
           <button 
             type="submit"
             form="checkout-form"
             disabled={loading}
             className="w-full bg-brand-accent hover:bg-brand-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl transition-transform active:scale-95 flex items-center justify-center gap-2"
           >
             {loading ? (
               <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
             ) : (
               <>Enviar Pedido por WhatsApp <Send size={18} /></>
             )}
           </button>
           <p className="text-center text-brand-light/40 text-xs mt-3">
             {type === 'DELIVERY' ? (
               <>Total parcial: ${cartTotal.toLocaleString('es-AR')} <span className="text-brand-accent/80">(+ envío a confirmar)</span></>
             ) : (
               `Total a pagar: $${cartTotal.toLocaleString('es-AR')}`
             )}
           </p>
        </div>
      </div>
    </div>
  );
};
