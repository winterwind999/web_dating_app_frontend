import { Match } from "@/utils/constants";
import { create } from "zustand";

type UserStore = {
  selectedMatch: Match | null;
  setSelectedMatch: (selectedMatch: Match | null) => void;

  email: string;
  setEmail: (email: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  selectedMatch: null,
  setSelectedMatch: (selectedMatch: Match | null) => {
    set(() => ({ selectedMatch }));
  },

  email: "",
  setEmail: (email: string) => {
    set(() => ({ email }));
  },
}));
