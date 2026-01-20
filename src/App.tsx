// ===========================================
// APP COMPONENT - ROUTER CONFIGURATION
// ===========================================

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/config/firebase.config";
import { useAuthStore } from "@/store";
import { Navbar, Cart, Footer, AdminRoute, ToastProvider } from "@/components";
import {
  HomePage,
  ProductsPage,
  ProductDetailPage,
  CheckoutPage,
  LoginPage,
  AdminDashboard,
} from "@/pages";
import "./App.css";

function App() {
  const { setUser, setLoading, setAdmin, reset } = useAuthStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

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
            displayName: firebaseUser.displayName || undefined,
            role: isAdmin ? "admin" : "user",
            createdAt:
              firebaseUser.metadata.creationTime || new Date().toISOString(),
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

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <BrowserRouter>
      <ToastProvider />
      <div className="app">
        <Navbar onCartClick={toggleCart} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sneakers" element={<ProductsPage />} />
            <Route path="/sneakers/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </BrowserRouter>
  );
}

export default App;
