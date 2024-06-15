import {
  getRecentBonCommandes,
  obtenirFournisseurs,
  searchFournisseurs,
} from "@/lib/Fournisseur";
import { Fournisseur } from "@prisma/client";
import { create } from "zustand";

type StateType = {
  fournisseur: Fournisseur[];
  bonCommandes: {
    bonCommandId: number;
    nom: string;
    total: string;
    status: string;
    date: string;
  }[];
  loading: boolean;
  fetchFournisseur: (limit: number) => Promise<void>;
  searchFournisseur: (query: string) => Promise<void>;
  fetchBonCommands: (limit: number) => Promise<void>;
};

export const useFournisseur = create<StateType>((set) => ({
  fournisseur: [],
  bonCommandes: [],
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
  fetchBonCommands: async (limit) => {
    set({ loading: true });
    try {
      const bonCommandes = await getRecentBonCommandes(limit);

      set({ loading: false, bonCommandes });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));
