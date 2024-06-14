import { obtenirFournisseurs, searchFournisseurs } from "@/lib/Fournisseur";
import { Fournisseur } from "@prisma/client";
import { create } from "zustand";

type StateType = {
  fournisseur: Fournisseur[];
  loading: boolean;
  fetchFournisseur: (limit: number) => Promise<void>;
  searchFournisseur: (query: string) => Promise<void>;
};

export const useFournisseur = create<StateType>((set) => ({
  fournisseur: [],
  loading: false,
  fetchFournisseur: async (limit: number = 5) => {
    set({ loading: true });
    try {
      const fournisseur = await obtenirFournisseurs(limit);
      set({ loading: false, fournisseur });
    } catch (error) {
      console.error(error);

      set({ loading: false });
    }
  },
  searchFournisseur: async (query: string) => {
    set({ loading: true });
    const fournisseur = await searchFournisseurs(query);
    set({ loading: false, fournisseur });
  },
}));
