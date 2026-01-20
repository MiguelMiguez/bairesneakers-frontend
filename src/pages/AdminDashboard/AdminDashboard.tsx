// ===========================================
// PAGES - ADMIN DASHBOARD
// ===========================================

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store';
import { useAuth } from '../../hooks';
import { productService } from '../../services';
import { Product, ProductCategory, ProductGenre, ShoeSize } from '../../types';
import { toast, ConfirmDialog } from '../../components';
import { 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  Star,
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  X,
  ImagePlus,
  AlertCircle
} from 'lucide-react';
import styles from './AdminDashboard.module.css';

// Product Form Data Type
interface ProductFormData {
  name: string;
  model: string;
  brand: string;
  category: ProductCategory;
  genre: ProductGenre;
  description: string;
  price: number;
  compareAtPrice?: number;
  thumbnail: string;
  images: string[];
  stock: Array<{ size: ShoeSize; quantity: number }>;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
}

const INITIAL_FORM_DATA: ProductFormData = {
  name: '',
  model: '',
  brand: 'Nike',
  category: 'sneakers',
  genre: 'unisex',
  description: '',
  price: 0,
  compareAtPrice: undefined,
  thumbnail: '',
  images: [],
  stock: [
    { size: 35 as ShoeSize, quantity: 0 },
    { size: 36 as ShoeSize, quantity: 0 },
    { size: 37 as ShoeSize, quantity: 0 },
    { size: 38 as ShoeSize, quantity: 0 },
    { size: 39 as ShoeSize, quantity: 0 },
    { size: 40 as ShoeSize, quantity: 0 },
    { size: 41 as ShoeSize, quantity: 0 },
    { size: 42 as ShoeSize, quantity: 0 },
    { size: 43 as ShoeSize, quantity: 0 },
    { size: 44 as ShoeSize, quantity: 0 },
    { size: 45 as ShoeSize, quantity: 0 },
    { size: 46 as ShoeSize, quantity: 0 },
  ],
  tags: [],
  isActive: true,
  isFeatured: false,
};

const BRANDS = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Converse', 'Vans', 'Jordan'];
const CATEGORIES: ProductCategory[] = ['sneakers', 'boots', 'sandals', 'casual'];
const GENRES: ProductGenre[] = ['masculino', 'femenino', 'unisex', 'niño', 'niña'];

export function AdminDashboard() {
  const { user, isAdmin } = useAuthStore();
  const { logout } = useAuth();
  
  // State
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  
  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [tagInput, setTagInput] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Load data
  useEffect(() => {
    loadProducts();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        model: editingProduct.model,
        brand: editingProduct.brand,
        category: editingProduct.category,
        genre: editingProduct.genre,
        description: editingProduct.description,
        price: editingProduct.price,
        compareAtPrice: editingProduct.compareAtPrice,
        thumbnail: editingProduct.thumbnail,
        images: editingProduct.images || [],
        stock: editingProduct.stock,
        tags: editingProduct.tags || [],
        isActive: editingProduct.isActive,
        isFeatured: editingProduct.isFeatured,
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
    setTagInput('');
    setNewImageUrl('');
  }, [editingProduct, formOpen]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productService.getProducts({}, { page: 1, limit: 100 });
      setProducts(response.data);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStockChange = (size: ShoeSize, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      stock: prev.stock.map(s => s.size === size ? { ...s, quantity } : s),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.model || !formData.price || !formData.thumbnail) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const productData = {
        ...formData,
        sku: editingProduct?.sku || `SKU-${Date.now()}`,
        currency: 'ARS',
        totalStock: formData.stock.reduce((sum, s) => sum + s.quantity, 0),
      };

      if (editingProduct) {
        const updated = await productService.updateProduct(editingProduct.id, productData);
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        toast.success('Producto actualizado exitosamente');
      } else {
        const newProduct = await productService.createProduct(productData as Parameters<typeof productService.createProduct>[0]);
        setProducts(prev => [newProduct, ...prev]);
        toast.success('Producto creado exitosamente');
      }
      
      closeForm();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || 'Error al guardar producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await productService.deleteProduct(productToDelete.id);
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
      toast.success('Producto eliminado');
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || 'Error al eliminar producto');
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const updated = await productService.updateProduct(product.id, {
        isFeatured: !product.isFeatured,
      });
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      toast.success(updated.isFeatured ? 'Producto destacado' : 'Producto quitado de destacados');
    } catch {
      toast.error('Error al actualizar producto');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const updated = await productService.updateProduct(product.id, {
        isActive: !product.isActive,
      });
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      toast.success(updated.isActive ? 'Producto activado' : 'Producto desactivado');
    } catch {
      toast.error('Error al actualizar producto');
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const openDeleteConfirm = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingProduct(null);
    setFormData(INITIAL_FORM_DATA);
  };

  // Filtered products
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    p.model.toLowerCase().includes(searchText.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchText.toLowerCase())
  );

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalStock = products.reduce((sum, p) => sum + p.totalStock, 0);
  const featuredCount = products.filter(p => p.isFeatured).length;

  if (!isAdmin) {
    return (
      <div className={styles.accessDenied}>
        <AlertCircle size={48} />
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder al panel de administración.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Panel de Administración</h1>
            <p>Bienvenido, {user?.displayName || user?.email}</p>
          </div>
          <button onClick={logout} className={styles.logoutBtn}>
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#e3f2fd' }}>
            <Package size={24} color="#1976d2" />
          </div>
          <div>
            <span className={styles.statValue}>{totalProducts}</span>
            <span className={styles.statLabel}>Productos</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#e8f5e9' }}>
            <TrendingUp size={24} color="#388e3c" />
          </div>
          <div>
            <span className={styles.statValue}>{activeProducts}</span>
            <span className={styles.statLabel}>Activos</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fff3e0' }}>
            <ShoppingCart size={24} color="#f57c00" />
          </div>
          <div>
            <span className={styles.statValue}>{totalStock}</span>
            <span className={styles.statLabel}>Stock Total</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fce4ec' }}>
            <Star size={24} color="#c2185b" />
          </div>
          <div>
            <span className={styles.statValue}>{featuredCount}</span>
            <span className={styles.statLabel}>Destacados</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'products' ? styles.active : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Productos ({products.length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Pedidos (0)
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className={styles.content}>
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <button onClick={() => setFormOpen(true)} className={styles.addBtn}>
              <Plus size={18} />
              Agregar Producto
            </button>
          </div>

          {error && (
            <div className={styles.error}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {isLoading ? (
            <div className={styles.loading}>
              <Loader2 size={32} className={styles.spinner} />
              <p>Cargando productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.empty}>
              <Package size={48} />
              <p>No se encontraron productos</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Marca</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Destacado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className={styles.productCell}>
                          <img 
                            src={product.thumbnail} 
                            alt={product.name}
                            className={styles.productImage}
                          />
                          <div>
                            <span className={styles.productName}>{product.name}</span>
                            <span className={styles.productModel}>{product.model}</span>
                          </div>
                        </div>
                      </td>
                      <td>{product.brand}</td>
                      <td>${product.price.toLocaleString('es-AR')}</td>
                      <td>
                        <span className={`${styles.stockBadge} ${
                          product.totalStock === 0 ? styles.outOfStock :
                          product.totalStock < 10 ? styles.lowStock : styles.inStock
                        }`}>
                          {product.totalStock}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`${styles.statusBtn} ${product.isActive ? styles.active : styles.inactive}`}
                          onClick={() => handleToggleActive(product)}
                        >
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td>
                        <button
                          className={`${styles.featuredBtn} ${product.isFeatured ? styles.featured : ''}`}
                          onClick={() => handleToggleFeatured(product)}
                        >
                          <Star size={16} fill={product.isFeatured ? '#f59e0b' : 'none'} />
                        </button>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.editBtn}
                            onClick={() => openEditForm(product)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className={styles.deleteBtn}
                            onClick={() => openDeleteConfirm(product)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className={styles.content}>
          <div className={styles.empty}>
            <ShoppingCart size={48} />
            <p>No hay pedidos todavía</p>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {formOpen && (
        <div className={styles.modalOverlay} onClick={closeForm}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={closeForm} className={styles.closeBtn}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                {/* Basic Info */}
                <div className={styles.formSection}>
                  <h3>Información Básica</h3>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Nombre *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Ej: Air Max 90"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Modelo *</label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        placeholder="Ej: AM90-2024"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Marca</label>
                      <select
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                      >
                        {BRANDS.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Categoría</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Género</label>
                      <select
                        value={formData.genre}
                        onChange={(e) => handleInputChange('genre', e.target.value)}
                      >
                        {GENRES.map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Descripción</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Descripción del producto..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className={styles.formSection}>
                  <h3>Precio</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Precio *</label>
                      <input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => handleInputChange('price', Number(e.target.value))}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Precio Comparativo</label>
                      <input
                        type="number"
                        value={formData.compareAtPrice || ''}
                        onChange={(e) => handleInputChange('compareAtPrice', e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Precio anterior (opcional)"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className={styles.formSection}>
                  <h3>Imágenes</h3>
                  <div className={styles.formGroup}>
                    <label>Thumbnail (URL) *</label>
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                      placeholder="https://..."
                      required
                    />
                  </div>
                  
                  {formData.thumbnail && (
                    <img 
                      src={formData.thumbnail} 
                      alt="Preview" 
                      className={styles.thumbnailPreview}
                    />
                  )}

                  <div className={styles.formGroup}>
                    <label>Imágenes Adicionales</label>
                    <div className={styles.imageInput}>
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="URL de imagen adicional"
                      />
                      <button type="button" onClick={addImage} className={styles.addImageBtn}>
                        <ImagePlus size={18} />
                      </button>
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className={styles.imageList}>
                      {formData.images.map((img, idx) => (
                        <div key={idx} className={styles.imageItem}>
                          <img src={img} alt={`Image ${idx + 1}`} />
                          <button type="button" onClick={() => removeImage(img)}>
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stock */}
                <div className={styles.formSection}>
                  <h3>Stock por Talla</h3>
                  <div className={styles.stockGrid}>
                    {formData.stock.map(item => (
                      <div key={item.size} className={styles.stockItem}>
                        <span>{item.size}</span>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleStockChange(item.size, parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className={styles.formSection}>
                  <h3>Etiquetas</h3>
                  <div className={styles.tagInput}>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Agregar etiqueta..."
                    />
                    <button type="button" onClick={addTag}>Agregar</button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className={styles.tags}>
                      {formData.tags.map(tag => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)}>
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className={styles.formSection}>
                  <h3>Opciones</h3>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      />
                      <span>Producto Activo</span>
                    </label>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      />
                      <span>Producto Destacado</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={closeForm} className={styles.cancelBtn}>
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className={styles.spinner} />
                      Guardando...
                    </>
                  ) : (
                    editingProduct ? 'Actualizar Producto' : 'Crear Producto'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => { setDeleteConfirmOpen(false); setProductToDelete(null); }}
        onConfirm={handleDeleteProduct}
        title="Eliminar Producto"
        message={`¿Estás seguro de que quieres eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
