// ===========================================
// CONFIG - FIREBASE INITIALIZATION
// ===========================================

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { config } from './env.config';

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
};

// Initialize Firebase (Singleton)
let firebaseApp: FirebaseApp;
let firebaseAuth: Auth;

if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
} else {
  firebaseApp = getApps()[0]!;
  firebaseAuth = getAuth(firebaseApp);
}

export { firebaseApp, firebaseAuth };
