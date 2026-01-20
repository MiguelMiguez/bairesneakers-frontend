// ===========================================
// TYPES - USER INTERFACES
// ===========================================

export type UserRole = 'user' | 'admin';

export interface Address {
  id: string;
  street: string;
  number: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone?: string;
  photoURL?: string;
  role: UserRole;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}
