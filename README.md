<div align="center">

# BaireSneakers Frontend

**E-commerce moderno de zapatillas construido con React, TypeScript y Vite**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![MUI](https://img.shields.io/badge/MUI-5.15-007FFF?style=flat-square&logo=mui&logoColor=white)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Tabla de Contenidos

- [Tech Stack](#-tech-stack)
- [Arquitectura](#-arquitectura)
- [Patrones de Diseño](#-patrones-de-diseño)
- [Configuración](#-configuración)
- [Rutas y Páginas](#-rutas-y-páginas)
- [Autenticación](#-autenticación)
- [Componentes](#-componentes)
- [Scripts](#-scripts)
- [Contribución](#-contribución)

---

## ► Tech Stack

| Tecnología | Descripción |
|:-----------|:------------|
| ![React](https://img.shields.io/badge/-React%2018-61DAFB?style=flat-square&logo=react&logoColor=black) | Biblioteca de UI con hooks y componentes funcionales |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Tipado estático para mayor robustez |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Build tool ultra rápido con HMR |
| ![React Router](https://img.shields.io/badge/-React%20Router%20v6-CA4245?style=flat-square&logo=reactrouter&logoColor=white) | Enrutamiento SPA declarativo |
| ![Zustand](https://img.shields.io/badge/-Zustand-433E38?style=flat-square&logo=react&logoColor=white) | Gestión de estado global minimalista |
| ![Firebase](https://img.shields.io/badge/-Firebase%20Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black) | Autenticación segura con Google y email |
| ![MUI](https://img.shields.io/badge/-Material%20UI-007FFF?style=flat-square&logo=mui&logoColor=white) | Componentes de UI y DataGrid |
| ![Mercado Pago](https://img.shields.io/badge/-Mercado%20Pago-00B1EA?style=flat-square&logo=mercadopago&logoColor=white) | Integración de pagos |

---

## ◈ Arquitectura

```
src/
├── components/              # Componentes reutilizables
│   ├── AdminRoute/          # » Route guard para admin
│   ├── Breadcrumb/          # » Navegación por migas de pan
│   ├── Cart/                # » Carrito de compras
│   ├── DataTable/           # » Tabla de datos con MUI
│   ├── Dialog/              # » Diálogos de confirmación
│   ├── Filters/             # » Filtros de productos
│   ├── Footer/              # » Footer del sitio
│   ├── Form/                # » Componentes de formulario
│   ├── InfoCard/            # » Tarjetas informativas
│   ├── Modal/               # » Modales genéricos
│   ├── Navbar/              # » Navegación principal
│   ├── ProductCard/         # » Tarjeta de producto
│   ├── ProductCardSkeleton/ # » Skeleton loading
│   ├── ProductDetail/       # » Detalle del producto
│   ├── ProtectedRoute/      # » Route guard autenticado
│   ├── StatsCard/           # » Tarjetas de estadísticas
│   └── Toast/               # » Notificaciones toast
│
├── config/                  # Configuración
│   ├── env.config.ts        # » Variables de entorno
│   └── firebase.config.ts   # » Config de Firebase
│
├── hooks/                   # Custom hooks
│   ├── useAuth.ts           # » Lógica de autenticación
│   ├── useForm.ts           # » Manejo de formularios
│   ├── useOrders.ts         # » Gestión de órdenes
│   └── useProducts.ts       # » Gestión de productos
│
├── pages/                   # Páginas/Vistas
│   ├── AdminDashboard/      # » Panel de administración
│   ├── CheckoutPage/        # » Proceso de checkout
│   ├── ContactPage/         # » Página de contacto
│   ├── HomePage/            # » Landing page
│   ├── LoginPage/           # » Login/Registro
│   ├── ProductDetailPage/   # » Detalle del producto
│   ├── ProductFormPage/     # » Formulario CRUD productos
│   └── ProductsPage/        # » Catálogo con filtros
│
├── services/                # Service Layer (Adapters)
│   ├── interfaces/          # » Contratos de servicios
│   ├── auth.service.ts      # » Servicio de autenticación
│   ├── http.service.ts      # » HTTP client base
│   ├── order.service.ts     # » Servicio de órdenes
│   └── product.service.ts   # » Servicio de productos
│
├── store/                   # Estado global (Zustand)
│   ├── auth.store.ts        # » Store de autenticación
│   └── cart.store.ts        # » Store del carrito
│
├── types/                   # TypeScript types
│   ├── api.types.ts         # » Tipos de API responses
│   ├── order.types.ts       # » Tipos de órdenes
│   ├── product.types.ts     # » Tipos de productos
│   └── user.types.ts        # » Tipos de usuarios
│
├── App.tsx                  # Componente raíz
└── main.tsx                 # Entry point
```

---

## ◆ Patrones de Diseño

### ▸ Service Layer Pattern

Los servicios actúan como adaptadores entre la UI y la API, implementando interfaces para inversión de dependencias:

```typescript
// Interfaz del servicio (contrato)
interface IProductService {
  getProducts(filters?: ProductFilters, pagination?: PaginationOptions): Promise<PaginatedResponse<Product>>;
  getProductById(id: string): Promise<Product>;
  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}

// Implementación con HTTP Client
class ProductService implements IProductService {
  private readonly endpoint = '/products';

  async getProducts(filters?: ProductFilters, pagination?: PaginationOptions) {
    const params = this.buildParams(filters, pagination);
    return httpClient.get<PaginatedResponse<Product>>(this.endpoint, params);
  }

  async getProductById(id: string) {
    return httpClient.get<Product>(`${this.endpoint}/${id}`);
  }
}

export const productService = new ProductService();
```

### ▸ Custom Hooks

Encapsulan lógica de negocio, estado y side effects de forma reutilizable:

```typescript
interface UseProductsOptions {
  filters?: ProductFilters;
  pagination?: PaginationOptions;
  autoFetch?: boolean;
}

function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productService.getProducts(filters, pagination);
      setProducts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch'));
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination]);

  useEffect(() => {
    if (autoFetch) fetchProducts();
  }, [fetchProducts, autoFetch]);

  return { products, isLoading, error, refetch: fetchProducts };
}
```

### ▸ Zustand Store

Estado global simple, performante y con persistencia:

```typescript
interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: ShoeSize, quantity?: number) => void;
  removeItem: (productId: string, size: ShoeSize) => void;
  updateQuantity: (productId: string, size: ShoeSize, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, size, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === product.id && item.size === size
          );
          
          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems };
          }
          
          return { items: [...state.items, { productId: product.id, product, size, quantity }] };
        });
      },
      
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage', storage: createJSONStorage(() => localStorage) }
  )
);
```

---

## ⚙ Configuración

### Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# API Backend
VITE_API_URL=http://localhost:3001/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Mercado Pago (opcional)
VITE_MERCADOPAGO_PUBLIC_KEY=your-public-key
```

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/sneaker-solid-frontend.git
cd sneaker-solid-frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Iniciar servidor de desarrollo
npm run dev
```

---

## ⌘ Rutas y Páginas

| Ruta | Componente | Descripción | Acceso |
|:-----|:-----------|:------------|:-------|
| `/` | `HomePage` | Landing page con productos destacados y hero | Público |
| `/sneakers` | `ProductsPage` | Catálogo completo con filtros y paginación | Público |
| `/sneakers/:id` | `ProductDetailPage` | Detalle del producto con galería de imágenes | Público |
| `/checkout` | `CheckoutPage` | Proceso de checkout con Mercado Pago | Público |
| `/login` | `LoginPage` | Login y registro con Firebase Auth | Público |
| `/contact` | `ContactPage` | Formulario de contacto | Público |
| `/admin` | `AdminDashboard` | Panel de administración con estadísticas | Admin |
| `/admin/products/new` | `ProductFormPage` | Crear nuevo producto | Admin |
| `/admin/products/:id/edit` | `ProductFormPage` | Editar producto existente | Admin |

---

## ⊛ Autenticación

El sistema de autenticación utiliza **Firebase Auth** con las siguientes características:

| Característica | Descripción |
|:---------------|:------------|
| **Providers** | Email/Password y Google Sign-In |
| **Custom Claims** | Roles `admin` y `user` verificados en el backend |
| **Route Guards** | `ProtectedRoute` y `AdminRoute` para proteger rutas |
| **Token Management** | Token JWT automático en headers HTTP |
| **Persistencia** | Sesión persistente con Firebase |

```typescript
// Ejemplo de uso del auth store
const { user, isAdmin, isLoading } = useAuthStore();

// El token se agrega automáticamente a las peticiones HTTP
const token = await firebaseAuth.currentUser?.getIdToken();
headers.set('Authorization', `Bearer ${token}`);
```

---

## ⧉ Componentes

### Componentes Principales

| Componente | Descripción |
|:-----------|:------------|
| `Navbar` | Navegación principal con carrito y menú de usuario |
| `Footer` | Footer con links y redes sociales |
| `ProductCard` | Tarjeta de producto con imagen, precio y acciones |
| `Cart` | Sidebar del carrito con items y total |
| `Filters` | Panel de filtros (categoría, marca, precio, talle) |
| `DataTable` | Tabla de datos con MUI DataGrid |
| `Modal` | Modal genérico reutilizable |
| `Toast` | Sistema de notificaciones con react-hot-toast |

### Sistema de Filtros

```typescript
// Tipos de filtros disponibles
interface ProductFilters {
  category?: ProductCategory;  // sneakers, boots, sandals, casual
  genre?: ProductGenre;        // masculino, femenino, unisex, niño, niña
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
}
```

---

## ⌨ Scripts

| Comando | Descripción |
|:--------|:------------|
| `npm run dev` | Inicia servidor de desarrollo con HMR |
| `npm run build` | Compila TypeScript y genera build de producción |
| `npm run preview` | Preview local del build de producción |
| `npm run lint` | Ejecuta ESLint para análisis de código |

---

## ⊕ Dependencias

### Producción

```
react               ^18.2.0     Biblioteca de UI
react-dom           ^18.2.0     Renderizado DOM
react-router-dom    ^6.21.1     Enrutamiento SPA
zustand             ^4.4.7      Gestión de estado
firebase            ^10.7.1     Autenticación y backend
@mui/material       ^5.15.6     Componentes UI
@mui/x-data-grid    ^6.19.2     Tabla de datos avanzada
@mercadopago/sdk    ^0.0.19     Integración de pagos
lucide-react        ^0.562.0    Iconos
react-hot-toast     ^2.6.0      Notificaciones
```

### Desarrollo

```
typescript          ^5.3.3      Tipado estático
vite                ^7.3.1      Build tool
eslint              ^8.56.0     Linter
@vitejs/plugin-react ^4.2.1     Plugin React para Vite
```

---

## ⟳ Contribución

1. **Fork** del repositorio
2. **Crear branch** para tu feature
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Commit** con conventional commits
   ```bash
   git commit -m 'feat: agregar nueva funcionalidad'
   ```
4. **Push** al branch
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. **Abrir Pull Request**

### Convención de Commits

| Prefijo | Uso |
|:--------|:----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bugs |
| `docs:` | Documentación |
| `style:` | Formateo, sin cambios de código |
| `refactor:` | Refactorización de código |
| `test:` | Tests |
| `chore:` | Tareas de mantenimiento |

---

<div align="center">

## ⊖ Licencia

Este proyecto está bajo la licencia **MIT**.

---

Desarrollado con ♦ por el equipo de BaireSneakers

[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/tu-usuario/sneaker-solid-frontend)

</div>
