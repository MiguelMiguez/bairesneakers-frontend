// ===========================================
// CONFIG - ENVIRONMENT VARIABLES
// ===========================================

export const config = {
  // API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',

  // Firebase
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },

  // Mercado Pago
  mercadoPago: {
    publicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY,
  },

  // App
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
