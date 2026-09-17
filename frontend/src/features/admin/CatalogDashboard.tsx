import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Plus, Edit2, Tag, EyeOff, Eye } from 'lucide-react';

export const CatalogDashboard = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: ''
  });

  const fetchCatalog = async () => {
    try {
      const response = await api.get('/catalog/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        categoryId: product.categoryId.toString(),
        image: product.image || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: categories.length > 0 ? categories[0].id.toString() : '',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
        image: formData.image
      };

      if (editingProduct) {
        await api.patch(`/catalog/products/${editingProduct.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/catalog/products', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsModalOpen(false);
      await fetchCatalog();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto.');
    }
  };

  const toggleProductActive = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/catalog/products/${id}`, { isActive: !currentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCatalog();
    } catch (error) {
      console.error('Error toggling product:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    setUploadingImage(true);
    try {
      const response = await api.post('/catalog/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      // La URL que devuelve el backend ya viene con /uploads/... 
      // Al usar proxy, Vite se encarga de rutear /uploads al backend automáticamente.
      setFormData(prev => ({ ...prev, image: response.data.url }));
    } catch (error) {
      console.error('Error uploading image', error);
      alert('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return <div className="text-zinc-400 flex items-center justify-center h-full">Cargando catálogo...</div>;
  }

  // Flatten products for the table
  const allProducts = categories.flatMap(cat => cat.products.map((p: any) => ({ ...p, categoryName: cat.name })));

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Catálogo de Productos</h2>
          <p className="text-zinc-400">Gestioná los productos que se muestran en el menú público.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Producto</th>
                <th className="px-6 py-4 font-semibold">Categoría</th>
                <th className="px-6 py-4 font-semibold">Precio</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {allProducts.map((product) => (
                <tr key={product.id} className={`transition-colors ${product.isActive ? 'hover:bg-zinc-800/30' : 'bg-zinc-950/30 opacity-75'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-zinc-800" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-lg">🍔</div>
                      )}
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-zinc-500 truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-md w-fit text-xs">
                      <Tag size={12} />
                      {product.categoryName}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-white">
                    ${Number(product.price).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {product.isActive ? 'Activo' : 'Pausado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleProductActive(product.id, product.isActive)}
                        className={`p-2 rounded-lg transition-colors ${product.isActive ? 'text-amber-400 hover:bg-amber-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                        title={product.isActive ? 'Pausar Producto' : 'Activar Producto'}
                      >
                        {product.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                        title="Editar Producto"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {allProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No hay productos configurados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-sm font-medium mb-1">Nombre</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all"
                  placeholder="Ej: Hamburguesa Clásica"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-sm font-medium mb-1">Precio ($)</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all font-mono"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm font-medium mb-1">Categoría</label>
                  <select 
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm font-medium mb-1">Descripción</label>
                <textarea 
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all resize-none"
                  placeholder="Descripción breve del producto..."
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-sm font-medium mb-2">Imagen del Producto (Opcional)</label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover bg-zinc-800 shrink-0" />
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full bg-zinc-950 border border-dashed border-zinc-700 hover:border-amber-500 hover:bg-amber-500/5 text-zinc-400 rounded-xl px-4 py-4 flex flex-col items-center justify-center transition-all">
                      {uploadingImage ? (
                        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="text-sm font-medium mb-1 text-center text-zinc-300">Hacé clic o arrastrá una imagen</span>
                          <span className="text-xs opacity-50 text-center">Formatos soportados: JPG, PNG, WEBP</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-bold transition-colors"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
