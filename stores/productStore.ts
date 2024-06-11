// stores/productsStore.ts
import { create } from "zustand";
import { getRecentProducts, fetchSearchedProducts } from "@/lib/Produit"; // Adjust the import path accordingly

import { Produit, Categorie, Stock } from "@prisma/client";

export interface ProductsStore {
  products: (Produit & {
    montantTotal?: number;
    categorie: Categorie;
    stock: Stock | null;
  })[];
  loading: boolean;
  fetchProducts: (limit: number) => Promise<void>;
  searchProducts: (searchQuery: string) => Promise<void>;
}

export const useProductsStore = create<ProductsStore>((set) => ({
  products: [],
  loading: false,
  fetchProducts: async (limit: number = 15) => {
    set({ loading: true });
    try {
      const products = await getRecentProducts(limit);
      set({ products, loading: false });
    } catch (error) {
      console.error("Failed to fetch recent products", error);
      set({ loading: false });
    }
  },

  searchProducts: async (searchQuery: string) => {
    set({ loading: true });
    try {
      const products = await fetchSearchedProducts(searchQuery);
      set({ products, loading: false });
    } catch (error) {
      console.error("Failed to fetch recent products", error);
      set({ loading: false });
    }
  },
}));

type ProduitInfoState = {
  isOpen: boolean;
  SelectedProduct:
    | (Produit & { categorie: Categorie; stock: Stock | null })
    | null;
  onSelect: (
    produit: Produit & { categorie: Categorie; stock: Stock | null }
  ) => void;
  onOpen: () => void;
  onClose: () => void;
};

export const useProduitInfoState = create<ProduitInfoState>((set) => ({
  isOpen: false,
  SelectedProduct: null,
  onSelect: (produit) => set({ SelectedProduct: produit }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
