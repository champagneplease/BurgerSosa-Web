import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { PackagePlus, Settings2, AlertTriangle, History, Edit2 } from 'lucide-react';

export const InventoryDashboard = () => {
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  
  // Modal states
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<any>(null);
  const [adjustMode, setAdjustMode] = useState<'RELATIVE' | 'ABSOLUTE'>('ABSOLUTE');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', unit: '', minStock: '' });

  const fetchIngredients = async () => {
    try {
      const response = await api.get('/inventory/ingredients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIngredients(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredient) return;

    let finalQuantity = Number(adjustAmount);
    
    if (adjustMode === 'ABSOLUTE') {
      // Si el usuario quiere FIJAR el stock (ej: dice "ahora tengo 100", y había 60, entonces sumamos 40)
      finalQuantity = finalQuantity - selectedIngredient.currentStock;
    }

    if (finalQuantity === 0) {
      alert('La cantidad resultante no modifica el stock actual.');
      return;
    }

    try {
      await api.post('/inventory/movements', {
        ingredientId: selectedIngredient.id,
        quantity: finalQuantity,
        type: 'ADJUSTMENT',
        reason: adjustReason || (adjustMode === 'ABSOLUTE' ? 'Corrección absoluta manual' : 'Ajuste manual desde panel')
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsAdjustmentOpen(false);
      setAdjustAmount('');
      setAdjustReason('');
      fetchIngredients(); // Refresh table
    } catch (error) {
      console.error('Error adjusting stock:', error);
      alert('Error al ajustar stock');
    }
  };

  const openAdjustment = (ing: any) => {
    setSelectedIngredient(ing);
    setIsAdjustmentOpen(true);
  };

  const openEdit = (ing: any) => {
    setSelectedIngredient(ing);
    setEditFormData({ name: ing.name, unit: ing.unit, minStock: ing.minStock.toString() });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredient) return;
    try {
      await api.patch(`/inventory/ingredients/${selectedIngredient.id}`, {
        name: editFormData.name,
        unit: editFormData.unit,
        minStock: Number(editFormData.minStock)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditOpen(false);
      fetchIngredients();
    } catch (error) {
      console.error('Error updating ingredient:', error);
      alert('Error al actualizar ingrediente');
    }
  };

  if (loading) {
    return <div className="text-zinc-400 flex items-center justify-center h-full">Cargando inventario...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Inventario y Stock</h2>
          <p className="text-zinc-400">Controlá tus ingredientes y ajustá cantidades.</p>
        </div>
        <button className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
          <PackagePlus size={18} />
          Nuevo Ingrediente
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Ingrediente</th>
                <th className="px-6 py-4 font-semibold">Unidad de Medida</th>
                <th className="px-6 py-4 font-semibold">Stock Actual</th>
                <th className="px-6 py-4 font-semibold">Stock Mínimo</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {ingredients.map((ing) => {
                const isLowStock = ing.currentStock <= ing.minStock;
                return (
                  <tr key={ing.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{ing.name}</td>
                    <td className="px-6 py-4 text-zinc-400">{ing.unit}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-base ${isLowStock ? 'text-red-400' : 'text-green-400'}`}>
                          {ing.currentStock}
                        </span>
                        {isLowStock && <AlertTriangle size={14} className="text-red-400" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-mono">{ing.minStock}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openAdjustment(ing)}
                          className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="Ajustar Stock"
                        >
                          <Settings2 size={16} />
                        </button>
                        <button 
                          onClick={() => openEdit(ing)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                          title="Editar Ingrediente"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                          title="Historial de Movimientos"
                        >
                          <History size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {ingredients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No hay ingredientes configurados. ¡Agregá el primero!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Ajuste de Stock */}
      {isAdjustmentOpen && selectedIngredient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Ajustar Stock</h3>
            <p className="text-zinc-400 text-sm mb-6">Ingrediente: <span className="text-amber-400">{selectedIngredient.name}</span></p>
            
            <form onSubmit={handleAdjustmentSubmit} className="space-y-4">
              <div className="flex bg-zinc-950 p-1 rounded-xl mb-4">
                <button 
                  type="button"
                  onClick={() => setAdjustMode('ABSOLUTE')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${adjustMode === 'ABSOLUTE' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  Fijar Total Exacto
                </button>
                <button 
                  type="button"
                  onClick={() => setAdjustMode('RELATIVE')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${adjustMode === 'RELATIVE' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  Sumar / Restar
                </button>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm font-medium mb-1">
                  {adjustMode === 'ABSOLUTE' ? 'Nuevo Stock Real' : 'Cantidad a Ajustar (usá negativo para restar)'}
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.01"
                    min={adjustMode === 'ABSOLUTE' ? 0 : undefined}
                    required
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all font-mono"
                    placeholder={adjustMode === 'ABSOLUTE' ? 'Ej: 0 o 100' : 'Ej: 5 o -2'}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">{selectedIngredient.unit}</span>
                </div>
                {adjustMode === 'ABSOLUTE' && adjustAmount !== '' && (
                  <p className="text-xs mt-2 text-zinc-500">
                    Stock actual: {selectedIngredient.currentStock} {selectedIngredient.unit}. Diferencia calculada: {(Number(adjustAmount) - selectedIngredient.currentStock).toFixed(2)}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-zinc-400 text-sm font-medium mb-1">Razón / Motivo</label>
                <input 
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all"
                  placeholder="Ej: Compra a proveedor"
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsAdjustmentOpen(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-bold transition-colors"
                >
                  Confirmar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {isEditOpen && selectedIngredient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Editar Ingrediente</h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-sm font-medium mb-1">Nombre</label>
                <input 
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-sm font-medium mb-1">Unidad</label>
                  <input 
                    type="text"
                    required
                    value={editFormData.unit}
                    onChange={(e) => setEditFormData({...editFormData, unit: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm font-medium mb-1">Stock Mínimo</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editFormData.minStock}
                    onChange={(e) => setEditFormData({...editFormData, minStock: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-bold transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
