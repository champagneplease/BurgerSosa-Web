import React, { useState, useEffect } from 'react';
import { Store, MessageSquare, Map, Shield, Save, Clock, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';

const DAYS_OF_WEEK = [
  { id: '1', label: 'Lunes' },
  { id: '2', label: 'Martes' },
  { id: '3', label: 'Miércoles' },
  { id: '4', label: 'Jueves' },
  { id: '5', label: 'Viernes' },
  { id: '6', label: 'Sábado' },
  { id: '0', label: 'Domingo' },
];

export const SettingsDashboard = () => {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Settings State
  const [storeIsOpen, setStoreIsOpen] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [deliveryCost, setDeliveryCost] = useState('0');
  const [openTime, setOpenTime] = useState('20:00');
  const [closeTime, setCloseTime] = useState('00:00');
  const [closedMessage, setClosedMessage] = useState('');
  const [scheduleDays, setScheduleDays] = useState<string[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setStoreIsOpen(data.storeIsOpen ?? true);
        setWhatsappNumber(data.whatsappNumber || '');
        setDeliveryCost(data.deliveryCost?.toString() || '0');
        setOpenTime(data.openTime || '20:00');
        setCloseTime(data.closeTime || '00:00');
        setClosedMessage(data.closedMessage || '');
        if (data.scheduleDays) {
          setScheduleDays(data.scheduleDays.split(','));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const toggleDay = (dayId: string) => {
    setScheduleDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/settings', {
        storeIsOpen,
        whatsappNumber,
        deliveryCost: parseFloat(deliveryCost),
        openTime,
        closeTime,
        closedMessage,
        scheduleDays: scheduleDays.join(',')
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Configuraciones guardadas exitosamente.');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar las configuraciones.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-zinc-400 flex items-center justify-center h-full">Cargando configuraciones...</div>;
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">Configuración del Local</h2>
        <p className="text-zinc-400">Administrá las preferencias generales de Burger Sosa.</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-8">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section: General */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
              <Store className="text-amber-500" />
              <h3 className="text-lg font-bold text-white">Estado Manual del Local</h3>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <div>
                <p className="font-medium text-white mb-1">Aceptar Pedidos (Forzar Abierto/Cerrado)</p>
                <p className="text-sm text-zinc-400">Si lo desactivas, nadie podrá hacer pedidos sin importar el horario configurado abajo. Úsalo para emergencias.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={storeIsOpen} onChange={(e) => setStoreIsOpen(e.target.checked)} />
                <div className="w-14 h-7 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Section: Schedule */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
              <Clock className="text-amber-500" />
              <h3 className="text-lg font-bold text-white">Días y Horarios de Atención</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-zinc-400 text-sm font-medium mb-3">
                  <Calendar size={16} /> Días de apertura
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(day.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        scheduleDays.includes(day.id)
                          ? 'bg-amber-500 text-black'
                          : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-sm font-medium mb-2">Hora de Apertura</label>
                  <input 
                    type="time" 
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm font-medium mb-2">Hora de Cierre</label>
                  <input 
                    type="time" 
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm font-medium mb-2">Mensaje cuando está cerrado</label>
                <textarea 
                  value={closedMessage}
                  onChange={(e) => setClosedMessage(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 resize-none"
                  placeholder="Ej: Hoy no abrimos, pero prepárate para mañana..."
                />
              </div>
            </div>
          </div>

          {/* Section: Contact & Delivery */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
              <Map className="text-amber-500" />
              <h3 className="text-lg font-bold text-white">Envíos y Contacto</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-zinc-400 text-sm font-medium mb-2">
                  <MessageSquare size={16} /> Número de WhatsApp
                </label>
                <input 
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all font-mono"
                  placeholder="549..."
                />
                <p className="text-xs text-zinc-500 mt-2">A este número llegarán los mensajes de los clientes.</p>
              </div>
              
              <div>
                <label className="block text-zinc-400 text-sm font-medium mb-2">
                  Costo de Envío Fijo ($)
                </label>
                <input 
                  type="number"
                  value={deliveryCost}
                  onChange={(e) => setDeliveryCost(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all font-mono"
                  placeholder="0.00"
                />
                <p className="text-xs text-zinc-500 mt-2">Se sumará al total si eligen "Delivery".</p>
              </div>
            </div>
          </div>

          {/* Section: Account */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
              <Shield className="text-amber-500" />
              <h3 className="text-lg font-bold text-white">Cuenta de Administrador</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-sm font-medium mb-1">Nombre</label>
                <input type="text" disabled value={user?.name || ''} className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-400 rounded-xl px-4 py-3 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm font-medium mb-1">Email</label>
                <input type="email" disabled value={user?.email || ''} className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-400 rounded-xl px-4 py-3 cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
