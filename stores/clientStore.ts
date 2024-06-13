import { create } from "zustand";

import { Client, Commande } from "@prisma/client";
import { getRecentClients, getRecentCommands } from "@/lib/Client";

type StateType = {
  clients: Client[];
  commandes: {
    nom: string;
    total: string;
    status: string;
    date: string;
  }[];
  loading: boolean;
  fetchClient: (limit: number) => Promise<void>;
  fetchCommands: (limit: number) => Promise<void>;
};

export const useClient = create<StateType>((set) => ({
  clients: [],
  commandes: [],
  loading: false,
  fetchClient: async (limit: number = 5) => {
    set({ loading: true });
    try {
      const clients = await getRecentClients(limit);
      set({ loading: false, clients });
    } catch (error) {
      console.error(error);

      set({ loading: false });
    }
  },
  fetchCommands: async (limit) => {
    set({ loading: true });
    try {
      const commandes = await getRecentCommands(limit);

      set({ loading: false, commandes });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));
