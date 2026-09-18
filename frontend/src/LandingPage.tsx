import { useEffect, useState } from 'react';
import { api } from './services/api';
import { getImageUrl } from './utils/imageUrl';
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
    <div className="min-h-screen bg-brand-dark text-brand-light font-sans">
      {/* Header */}
      <header className="absolute top-0 w-full z-40 bg-transparent transition-all">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-brand-light hover:text-brand-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={28} strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <img src="/logo.svg" alt="BurgerSosa Logo" className="w-12 h-12 object-contain" />
              <h1 className="text-2xl font-black tracking-tight uppercase text-brand-light hidden sm:block">Burger<span className="text-brand-accent">Sosa</span></h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-base text-brand-light/80">
            <button onClick={() => scrollToSection('catalog')} className="hover:text-brand-light transition-colors">Catálogo</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-brand-light transition-colors">Sobre Nosotros</button>
          </nav>
          
          <button 
            onClick={() => isStoreOpen && setIsCartOpen(true)}
            className={`relative p-2 transition-colors flex items-center gap-2 ${isStoreOpen ? 'hover:text-brand-accent cursor-pointer text-brand-light' : 'opacity-50 cursor-not-allowed text-brand-light'}`}
          >
            <ShoppingBag size={28} strokeWidth={1.5} />
            {cartCount > 0 && isStoreOpen && (
              <span className="absolute top-0 right-0 bg-brand-accent text-brand-dark text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
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
          <div className="w-64 bg-brand-surface h-full border-r border-white/10 relative z-50 animate-in slide-in-from-left p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="font-black text-lg">Burger<span className="text-brand-accent">Sosa</span></span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-brand-light/60">
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-lg font-medium text-brand-light/80">
              <button onClick={() => scrollToSection('catalog')} className="text-left hover:text-brand-accent">Catálogo</button>
              <button onClick={() => scrollToSection('about')} className="text-left hover:text-brand-accent">Sobre Nosotros</button>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="pt-20 max-w-5xl mx-auto relative min-h-[90vh]">
        <div className="relative w-full h-[60vh] md:h-[70vh] flex flex-col justify-end">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent z-10" />
            <img 
              src="/banner.png" 
              alt="BurgerSosa Banner" 
              className="w-full h-full object-cover object-top opacity-80"
            />
          </div>
          
          <div className="relative z-20 px-6 md:px-12 pb-12 w-full max-w-3xl">
            {isStoreOpen ? (
              <>
                 <h2 className="text-5xl md:text-8xl font-black mb-4 leading-[0.95] text-brand-light tracking-[-0.04em]">
                   hamburguesa<br/>del <span className="text-brand-accent">Valle.</span>
                 </h2>
                 <p className="text-brand-light/80 text-lg md:text-xl mb-8 font-light max-w-md leading-relaxed">
                   Pedí ahora y descubrí por qué todos hablan de nuestro verdadero sabor artesanal.
                 </p>
                 <button 
                   onClick={() => scrollToSection('catalog')}
                   className="group bg-brand-btn text-brand-dark px-8 py-4 rounded-full font-bold text-lg transition-transform active:scale-95 flex items-center gap-2 w-fit"
                 >
                   Ver Menú Digital 
                   <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </>
            ) : (
              <>
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold mb-6">
                    Local Cerrado
                 </div>
                 <h2 className="text-5xl md:text-8xl font-black mb-4 leading-[0.95] text-brand-light tracking-[-0.04em]">
                   nos fuimos a<br/><span className="text-brand-light/40">descansar.</span>
                 </h2>
                 <p className="text-brand-accent text-lg mb-8 font-medium max-w-md">
                   {closedMessage}
                 </p>
                 <button 
                   onClick={() => window.open('https://www.instagram.com/burgersosa_/', '_blank')}
                   className="group bg-brand-btn text-brand-dark px-8 py-4 rounded-full font-bold text-lg transition-transform active:scale-95 flex items-center gap-2 w-fit"
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
              <div className="w-12 h-12 border-4 border-white/10 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-brand-light/40 font-medium">Calentando la plancha...</p>
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
              <p className="text-xl font-medium text-brand-light/40">El menú está apagado por ahora.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer id="about" className="bg-brand-dark border-t border-white/5 pt-16 pb-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="BurgerSosa Logo" className="w-8 h-8 object-contain" />
              <h2 className="text-2xl font-black uppercase">Burger<span className="text-brand-accent">Sosa</span></h2>
            </div>
            <p className="text-brand-light/60 text-sm leading-relaxed mb-6">
              Nos dedicamos a preparar la mejor hamburguesa de Valle Viejo, usando ingredientes frescos, pan artesanal y carne 100% real.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Sobre Nosotros</h3>
            <ul className="space-y-3 text-sm text-brand-light/60">
              <li>Av Felipe Varela 1243. Valle Viejo</li>
              <li>Catamarca, Argentina</li>
              <li>
                <a href="https://www.instagram.com/burgersosa_/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-accent hover:text-amber-400 mt-4 transition-colors">
                  @burgersosa_
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Legal & Contacto</h3>
            <p className="text-sm text-brand-light/60 mb-4">
              Para consultas generales, envíanos un mensaje directo por Instagram o a nuestro WhatsApp oficial.
            </p>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-light/40">
          <p>© {new Date().getFullYear()} Burger Sosa. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart size={14} className="text-red-500" /> por{' '}
            <a href="https://www.instagram.com/_nachomirnd/" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:text-amber-400 transition-colors font-medium">
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
          <div className="w-full max-w-md bg-brand-surface h-full flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-300">
            <div className="p-6 flex items-center justify-between border-b border-white/10">
               <h2 className="text-xl font-bold flex items-center gap-2">
                 <ShoppingBag size={20} className="text-brand-accent" />
                 Tu Pedido
               </h2>
               <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <X size={20} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-brand-light/40 gap-4">
                  <span className="text-6xl opacity-50">🛒</span>
                  <p>Tu carrito está vacío</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-brand-accent font-medium hover:underline">Volver al menú</button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="bg-white/10/50 rounded-2xl p-4 flex gap-4 relative group border border-transparent hover:border-zinc-700 transition-colors">
                    <button 
                      onClick={() => removeCartItem(item.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {item.product.image ? <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-full h-full object-cover rounded-xl" /> : '🍔'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{item.product.name}</h4>
                      {item.selectedModifiers.length > 0 && (
                        <p className="text-xs text-brand-light/60 line-clamp-1 mt-0.5">
                          {item.selectedModifiers.map(m => m.name).join(', ')}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                         <span className="text-sm font-medium text-brand-accent">${(item.unitPrice * item.quantity).toLocaleString('es-AR')}</span>
                         <span className="text-sm bg-white/10 px-2 py-1 rounded-md text-brand-light/80">x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 bg-brand-surface border-t border-white/10">
                <div className="flex items-center justify-between mb-4 text-lg">
                  <span className="text-brand-light/60">Total</span>
                  <span className="text-white font-bold">${cartTotal.toLocaleString('es-AR')}</span>
                </div>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-brand-accent hover:bg-amber-400 text-black font-bold py-4 rounded-2xl transition-transform active:scale-95 flex items-center justify-center gap-2"
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
