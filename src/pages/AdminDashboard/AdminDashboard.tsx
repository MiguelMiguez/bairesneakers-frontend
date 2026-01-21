import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { useAuth } from "@/hooks";
import { productService } from "@/services";
import { Product } from "@/types";
import { toast, ConfirmDialog } from "@/components";
import { StatsGrid, StatCardData } from "@/components/StatsCard";
import { DataTable, Column } from "@/components/DataTable";
import {
  Package,
  TrendingUp,
  ShoppingCart,
  Star,
  LogOut,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import styles from "./AdminDashboard.module.css";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();
  const { logout } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Load data
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productService.getProducts(
        {},
        { page: 1, limit: 100 },
      );
      setProducts(response.data);
    } catch (err) {
      setError("Error al cargar productos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await productService.deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
      toast.success("Producto eliminado");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Error al eliminar producto");
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const updated = await productService.updateProduct(product.id, {
        isFeatured: !product.isFeatured,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
      toast.success(
        updated.isFeatured
          ? "Producto destacado"
          : "Producto quitado de destacados",
      );
    } catch {
      toast.error("Error al actualizar producto");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const updated = await productService.updateProduct(product.id, {
        isActive: !product.isActive,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
      toast.success(
        updated.isActive ? "Producto activado" : "Producto desactivado",
      );
    } catch {
      toast.error("Error al actualizar producto");
    }
  };

  const openDeleteConfirm = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  // Stats data
  const stats: StatCardData[] = [
    {
      id: "total",
      label: "Productos",
      value: products.length,
      icon: <Package size={24} />,
      color: "#1976d2",
      bgColor: "#e3f2fd",
    },
    {
      id: "active",
      label: "Activos",
      value: products.filter((p) => p.isActive).length,
      icon: <TrendingUp size={24} />,
      color: "#388e3c",
      bgColor: "#e8f5e9",
    },
    {
      id: "stock",
      label: "Stock Total",
      value: products.reduce((sum, p) => sum + p.totalStock, 0),
      icon: <ShoppingCart size={24} />,
      color: "#f57c00",
      bgColor: "#fff3e0",
    },
    {
      id: "featured",
      label: "Destacados",
      value: products.filter((p) => p.isFeatured).length,
      icon: <Star size={24} />,
      color: "#c2185b",
      bgColor: "#fce4ec",
    },
  ];

  // Table columns
  const columns: Column<Product>[] = [
    {
      id: "product",
      label: "Producto",
      minWidth: 250,
      sortable: true,
      getValue: (row) => row.name,
      render: (row) => (
        <div className={styles.productCell}>
          <img
            src={row.thumbnail}
            alt={row.name}
            className={styles.productImage}
          />
          <div>
            <span className={styles.productName}>{row.name}</span>
            <span className={styles.productModel}>{row.model}</span>
          </div>
        </div>
      ),
    },
    {
      id: "brand",
      label: "Marca",
      minWidth: 100,
      sortable: true,
      getValue: (row) => row.brand,
    },
    {
      id: "price",
      label: "Precio",
      minWidth: 100,
      sortable: true,
      getValue: (row) => row.price,
      render: (row) => `$${row.price.toLocaleString("es-AR")}`,
    },
    {
      id: "totalStock",
      label: "Stock",
      minWidth: 80,
      align: "center",
      sortable: true,
      getValue: (row) => row.totalStock,
      render: (row) => (
        <span
          className={`${styles.stockBadge} ${
            row.totalStock === 0
              ? styles.outOfStock
              : row.totalStock < 10
                ? styles.lowStock
                : styles.inStock
          }`}
        >
          {row.totalStock}
        </span>
      ),
    },
    {
      id: "isActive",
      label: "Estado",
      minWidth: 100,
      align: "center",
      render: (row) => (
        <button
          className={`${styles.statusBtn} ${
            row.isActive ? styles.active : styles.inactive
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleActive(row);
          }}
        >
          {row.isActive ? "Activo" : "Inactivo"}
        </button>
      ),
    },
    {
      id: "isFeatured",
      label: "Destacado",
      minWidth: 80,
      align: "center",
      render: (row) => (
        <button
          className={`${styles.featuredBtn} ${
            row.isFeatured ? styles.featured : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFeatured(row);
          }}
        >
          <Star size={16} fill={row.isFeatured ? "#f59e0b" : "none"} />
        </button>
      ),
    },
  ];

  // Table actions
  const tableActions = (row: Product) => (
    <div className={styles.actions}>
      <button
        className={styles.editBtn}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/products/${row.id}/edit`);
        }}
      >
        <Edit size={16} />
      </button>
      <button
        className={styles.deleteBtn}
        onClick={(e) => {
          e.stopPropagation();
          openDeleteConfirm(row);
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

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
      <StatsGrid stats={stats} className={styles.stats} />

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "products" ? styles.active : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Productos ({products.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "orders" ? styles.active : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Pedidos (0)
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className={styles.content}>
          <div className={styles.toolbar}>
            <div />
            <button
              onClick={() => navigate("/admin/products/new")}
              className={styles.addBtn}
            >
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

          <DataTable
            columns={columns}
            rows={products}
            getRowId={(row) => row.id}
            isLoading={isLoading}
            searchable
            searchPlaceholder="Buscar productos..."
            emptyMessage="No se encontraron productos"
            emptyIcon={<Package size={48} />}
            actions={tableActions}
            onRowClick={(row) => navigate(`/admin/products/${row.id}/edit`)}
          />
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className={styles.content}>
          <div className={styles.empty}>
            <ShoppingCart size={48} />
            <p>No hay pedidos todavía</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteProduct}
        title="Eliminar Producto"
        message={`¿Estás seguro de que quieres eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}
