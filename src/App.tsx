import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/config/firebase.config";
import { useAuthStore } from "@/store";
import { Navbar, Footer, AdminRoute, ToastProvider } from "@/components";
import {
  HomePage,
  ProductsPage,
  ProductDetailPage,
  CheckoutPage,
  LoginPage,
  ContactPage,
  AdminDashboard,
  ProductFormPage,
} from "@/pages";
import "./App.css";

function App() {
  const { setUser, setLoading, setAdmin, reset } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (firebaseUser) => {
        if (firebaseUser) {
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const isAdmin = idTokenResult.claims.role === "admin";

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "",
            firstName: "",
            lastName: "",
            role: isAdmin ? "admin" : "user",
            addresses: [],
            createdAt: new Date(
              firebaseUser.metadata.creationTime || Date.now(),
            ),
            updatedAt: new Date(),
          });
          setAdmin(isAdmin);
        } else {
          reset();
        }
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [setUser, setLoading, setAdmin, reset]);

  return (
    <BrowserRouter>
      <ToastProvider />
      <div className="app">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sneakers" element={<ProductsPage />} />
            <Route path="/sneakers/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <AdminRoute>
                  <ProductFormPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/:id/edit"
              element={
                <AdminRoute>
                  <ProductFormPage />
                </AdminRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
