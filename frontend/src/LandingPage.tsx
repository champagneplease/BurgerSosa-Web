import { useEffect, useState } from 'react';
import { api } from './services/api';
import { useCartStore } from './store/useCartStore';
import type { Product } from './store/useCartStore';
import { CategorySection } from './features/catalog/CategorySection';
import { ProductModal } from './features/catalog/ProductModal';
import { CheckoutForm } from './features/checkout/CheckoutForm';
import { ShoppingBag, ChevronRight, X, Menu, Heart, Store } from 'lucide-react';

function LandingPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Store Settings State
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState('');
  
  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.getTotal());
  const removeCartItem = useCartStore((state) => state.removeItem);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catalogRes, settingsRes] = await Promise.all([
          api.get('/catalog'),
          api.get('/settings')
        ]);
        
        setCategories(catalogRes.data);
        
        // Check Store Open Status
        const settings = settingsRes.data;
        if (settings) {
          setClosedMessage(settings.closedMessage || "Hoy no abrimos, los esperamos en nuestro próximo día hábil.");
          setIsStoreOpen(checkIfStoreIsOpen(settings));
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const checkIfStoreIsOpen = (settings: any) => {
    if (settings.storeIsOpen === false) return false;
    
    if (!settings.scheduleDays) return true; // Default open if not set
    const days = settings.scheduleDays.split(',');
    
    const now = new Date();
    const currentDay = now.getDay().toString();
    const prevDay = (now.getDay() === 0 ? 6 : now.getDay() - 1).toString();
    
    const currentTotalMins = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = (settings.openTime || "20:00").split(':').map(Number);
    const openTotalMins = openH * 60 + openM;

    const [closeH, closeM] = (settings.closeTime || "00:00").split(':').map(Number);
    const closeTotalMins = closeH * 60 + closeM;

    if (openTotalMins <= closeTotalMins) {
      return days.includes(currentDay) && currentTotalMins >= openTotalMins && currentTotalMins <= closeTotalMins;
    } else {
      if (currentTotalMins >= openTotalMins) {
        return days.includes(currentDay);
      }
      if (currentTotalMins <= closeTotalMins) {
        return days.includes(prevDay);
      }
      return false;
    }
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-500 selection:text-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-zinc-800 transition-all">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-zinc-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <img src="/logo.svg" alt="BurgerSosa Logo" className="w-10 h-10 object-contain drop-shadow-md" />
              <h1 className="text-xl font-black tracking-tighter uppercase text-white hidden sm:block">Burger<span className="text-amber-500">Sosa</span></h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-zinc-300">
            <button onClick={() => scrollToSection('catalog')} className="hover:text-amber-500 transition-colors">Catálogo</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-amber-500 transition-colors">Sobre Nosotros</button>
          </nav>
          
          <button 
            onClick={() => isStoreOpen && setIsCartOpen(true)}
            className={`relative p-2 rounded-full transition-colors flex items-center gap-2 ${isStoreOpen ? 'hover:bg-zinc-800 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
          >
            <ShoppingBag size={24} className="text-zinc-300" />
            {cartCount > 0 && isStoreOpen && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="w-64 bg-zinc-900 h-full border-r border-zinc-800 relative z-50 animate-in slide-in-from-left p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="font-black text-lg">Burger<span className="text-amber-500">Sosa</span></span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-400">
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-lg font-medium text-zinc-300">
              <button onClick={() => scrollToSection('catalog')} className="text-left hover:text-amber-500">Catálogo</button>
              <button onClick={() => scrollToSection('about')} className="text-left hover:text-amber-500">Sobre Nosotros</button>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="pt-16 max-w-5xl mx-auto relative min-h-[90vh]">
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
        
        <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden md:rounded-b-[3rem] shadow-[0_20px_50px_rgba(245,158,11,0.15)] md:border-b md:border-x border-zinc-800/50">
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-900/80 to-transparent z-10" />
          <img 
            src="/banner.png" 
            alt="BurgerSosa Banner" 
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-[2s]"
          />
          <div className="absolute z-20 bottom-0 left-0 p-6 md:p-12 w-full max-w-2xl">
            {isStoreOpen ? (
              <>
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-semibold mb-4 md:mb-6 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    La parrilla está encendida
                 </div>
                 <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 leading-[1.1] text-white drop-shadow-2xl tracking-tight">
                   La mejor hamburguesa del <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Valle</span>.
                 </h2>
                 <p className="text-zinc-300 text-base md:text-xl mb-6 md:mb-8 font-light max-w-lg">
                   Pedí ahora y descubrí por qué todos hablan de nuestro verdadero sabor artesanal.
                 </p>
                 <button 
                   onClick={() => scrollToSection('catalog')}
                   className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-base md:text-lg transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] hover:-translate-y-1 flex items-center gap-2"
                 >
                   Ver Menú Digital 
                   <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </>
            ) : (
              <>
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold mb-4 md:mb-6 backdrop-blur-md">
                    Local Cerrado
                 </div>
                 <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 leading-[1.1] text-white drop-shadow-2xl tracking-tight">
                   Nos fuimos a <span className="text-zinc-500">descansar</span>.
                 </h2>
                 <p className="text-amber-500 text-lg md:text-xl mb-6 font-medium max-w-lg bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                   {closedMessage}
                 </p>
                 <button 
                   onClick={() => window.open('https://www.instagram.com/burgersosa_/', '_blank')}
                   className="group bg-zinc-800 hover:bg-zinc-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-base md:text-lg transition-all flex items-center gap-2"
                 >
                   Visitanos en Instagram
                 </button>
              </>
            )}
          </div>
        </div>

        {/* Catalog */}
        <div id="catalog" className="px-4 py-12 md:py-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-zinc-800 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-zinc-500 font-medium">Calentando la plancha...</p>
            </div>
          ) : isStoreOpen ? (
            categories.map(category => (
              <CategorySection 
                key={category.id} 
                category={category} 
                onProductClick={(p) => setSelectedProduct(p)} 
              />
            ))
          ) : (
            <div className="text-center py-20 opacity-50 flex flex-col items-center gap-4">
              <Store size={48} className="text-zinc-700" />
              <p className="text-xl font-medium text-zinc-500">El menú está apagado por ahora.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer id="about" className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="BurgerSosa Logo" className="w-8 h-8 object-contain" />
              <h2 className="text-2xl font-black uppercase">Burger<span className="text-amber-500">Sosa</span></h2>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Nos dedicamos a preparar la mejor hamburguesa de Valle Viejo, usando ingredientes frescos, pan artesanal y carne 100% real.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Sobre Nosotros</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>Av Felipe Varela 1243. Valle Viejo</li>
              <li>Catamarca, Argentina</li>
              <li>
                <a href="https://www.instagram.com/burgersosa_/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-amber-500 hover:text-amber-400 mt-4 transition-colors">
                  @burgersosa_
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Legal & Contacto</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Para consultas generales, envíanos un mensaje directo por Instagram o a nuestro WhatsApp oficial.
            </p>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Burger Sosa. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart size={14} className="text-red-500" /> por{' '}
            <a href="https://www.instagram.com/_nachomirnd/" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition-colors font-medium">
              Nacho Miranda
            </a>
          </p>
        </div>
      </footer>

      {/* Modals */}
      {selectedProduct && isStoreOpen && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {isCheckoutOpen && isStoreOpen && (
        <CheckoutForm onClose={() => setIsCheckoutOpen(false)} />
      )}

      {/* Cart Drawer */}
      {isCartOpen && isStoreOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 h-full flex flex-col border-l border-zinc-800 animate-in slide-in-from-right duration-300">
            <div className="p-6 flex items-center justify-between border-b border-zinc-800">
               <h2 className="text-xl font-bold flex items-center gap-2">
                 <ShoppingBag size={20} className="text-amber-500" />
                 Tu Pedido
               </h2>
               <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                 <X size={20} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
                  <span className="text-6xl opacity-50">🛒</span>
                  <p>Tu carrito está vacío</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-amber-500 font-medium hover:underline">Volver al menú</button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="bg-zinc-800/50 rounded-2xl p-4 flex gap-4 relative group border border-transparent hover:border-zinc-700 transition-colors">
                    <button 
                      onClick={() => removeCartItem(item.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {item.product.image ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded-xl" /> : '🍔'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{item.product.name}</h4>
                      {item.selectedModifiers.length > 0 && (
                        <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                          {item.selectedModifiers.map(m => m.name).join(', ')}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                         <span className="text-sm font-medium text-amber-500">${(item.unitPrice * item.quantity).toLocaleString('es-AR')}</span>
                         <span className="text-sm bg-zinc-800 px-2 py-1 rounded-md text-zinc-300">x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 bg-zinc-900 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-4 text-lg">
                  <span className="text-zinc-400">Total</span>
                  <span className="text-white font-bold">${cartTotal.toLocaleString('es-AR')}</span>
                </div>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-2xl transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  Continuar al pago <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
