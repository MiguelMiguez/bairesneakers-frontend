// ===========================================
// PAGES - PRODUCT FORM PAGE TYPES
// ===========================================

import { ProductCategory, ProductGenre, ShoeSize } from "@/types";

export interface ProductFormData {
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

export const INITIAL_FORM_DATA: ProductFormData = {
  name: "",
  model: "",
  brand: "Nike",
  category: "sneakers",
  genre: "unisex",
  description: "",
  price: 0,
  compareAtPrice: undefined,
  thumbnail: "",
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

export const BRANDS = [
  "Nike",
  "Adidas",
  "Puma",
  "New Balance",
  "Reebok",
  "Converse",
  "Vans",
  "Jordan",
];

export const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "sneakers", label: "Sneakers" },
  { value: "boots", label: "Boots" },
  { value: "sandals", label: "Sandalias" },
  { value: "casual", label: "Casual" },
];

export const GENRES: { value: ProductGenre; label: string }[] = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
  { value: "unisex", label: "Unisex" },
  { value: "niño", label: "Niño" },
  { value: "niña", label: "Niña" },
];
