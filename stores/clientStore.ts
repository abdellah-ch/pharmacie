import { create } from "zustand";

import { Client, Commande } from "@prisma/client";
import {
  getCommandsByClientAndDateRange,
  getRecentClients,
  getRecentCommands,
} from "@/lib/Client";
import { searchClients } from "@/lib/Client";
type StateType = {
  clients: Client[];
  commandes: {
    commandId: number;
    nom: string;
    total: string;
    status: string;
    date: string;
  }[];
  loading: boolean;
  fetchClient: (limit: number) => Promise<void>;
  searchClient: (query: string) => Promise<void>;
  fetchCommands: (limit: number) => Promise<void>;
  fetchCommandsByClientAndDate: (
    clientName: string,
    startDate: Date,
    endDate: Date
  ) => Promise<void>;
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
  searchClient: async (query: string) => {
    set({ loading: true });
    const clients = await searchClients(query);
    set({ loading: false, clients });
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
  fetchCommandsByClientAndDate: async (
    clientName: string,
    startDate: Date,
    endDate: Date
  ) => {
    set({ loading: true });
    try {
      const commandes = await getCommandsByClientAndDateRange(
        clientName,
        startDate,
        endDate
      );
      set({ loading: false, commandes });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));

type CommadeClientState = {
  isOpen: boolean;
  commandId: number;
  onSelect: (commadeId: number) => void;
  onOpen: () => void;
  onClose: () => void;
};

export const useCommadeClientState = create<CommadeClientState>((set) => ({
  isOpen: false,
  commandId: 0,
  onSelect: (commandId) => set({ commandId: commandId }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
