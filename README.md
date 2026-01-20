# Sneaker Solid - Frontend

Frontend de la aplicación de E-commerce Sneaker Solid, construido con React, TypeScript y Vite.

## 🚀 Tech Stack

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router v6** - Enrutamiento SPA
- **Zustand** - Gestión de estado global
- **Firebase Auth** - Autenticación
- **CSS Modules** - Estilos encapsulados

## 📁 Arquitectura

```
src/
├── components/          # Componentes reutilizables
│   ├── AdminRoute/      # Route guard para admin
│   ├── Cart/            # Carrito de compras
│   ├── Footer/          # Footer del sitio
│   ├── Navbar/          # Navegación principal
│   ├── ProductCard/     # Tarjeta de producto
│   └── ProtectedRoute/  # Route guard autenticado
├── config/              # Configuración
│   ├── env.config.ts    # Variables de entorno
│   └── firebase.config.ts
├── hooks/               # Custom hooks
│   ├── useAuth.ts       # Autenticación
│   ├── useOrders.ts     # Gestión de órdenes
│   └── useProducts.ts   # Gestión de productos
├── pages/               # Páginas/Vistas
│   ├── AdminDashboard/
│   ├── CheckoutPage/
│   ├── HomePage/
│   ├── LoginPage/
│   ├── ProductDetailPage/
│   └── ProductsPage/
├── services/            # Service Layer (Adapters)
│   ├── interfaces/      # Contratos de servicios
│   ├── auth.service.ts
│   ├── http.service.ts  # HTTP client base
│   ├── order.service.ts
│   └── product.service.ts
├── store/               # Estado global (Zustand)
│   ├── auth.store.ts
│   └── cart.store.ts
├── types/               # TypeScript types
├── App.tsx              # Componente raíz
└── main.tsx             # Entry point
```

## 🏗️ Patrones de Diseño

### Service Layer Pattern
Los servicios actúan como adaptadores entre la UI y la API:

```typescript
// Interfaz del servicio
interface IProductService {
  getAll(filters?: ProductFilters): Promise<ApiResponse<PaginatedResponse<Product>>>;
  getById(id: string): Promise<ApiResponse<Product>>;
}

// Implementación
const productService: IProductService = {
  getAll: (filters) => httpClient.get('/products', { params: filters }),
  getById: (id) => httpClient.get(`/products/${id}`),
};
```

### Custom Hooks
Encapsulan lógica de negocio y estado:

```typescript
function useProducts({ filters, page }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productService.getAll(filters).then(/* ... */);
  }, [filters, page]);

  return { products, isLoading, setFilters, setPage };
}
```

### Zustand para Estado Global
Estado simple y performante:

```typescript
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env.local`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview
```

## 📱 Páginas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | HomePage | Landing page con productos destacados |
| `/sneakers` | ProductsPage | Catálogo con filtros |
| `/sneakers/:id` | ProductDetailPage | Detalle del producto |
| `/checkout` | CheckoutPage | Proceso de checkout |
| `/login` | LoginPage | Login/Registro |
| `/admin` | AdminDashboard | Panel de administración |

## 🔐 Autenticación

- Firebase Auth con email/password y Google
- Custom Claims para roles (`admin`, `user`)
- Route guards para proteger rutas
- Token automático en headers HTTP

## 🎨 Estilos

CSS Modules para estilos encapsulados:

```typescript
import styles from './Component.module.css';

<div className={styles.container}>
  <h1 className={styles.title}>...</h1>
</div>
```

## 🧪 Scripts

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Preview del build
npm run lint      # Linting con ESLint
npm run type-check # Verificación de tipos
```

## 📦 Dependencias Principales

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.x",
  "zustand": "^4.x",
  "firebase": "^10.x"
}
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

MIT
