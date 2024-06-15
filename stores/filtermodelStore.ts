import { create } from "zustand";

type filterState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useFilter = create<filterState>((set: any) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
