import { Match } from "@/utils/constants";
import { create } from "zustand";

type UserStore = {
  selectedMatch: Match | null;
  setSelectedMatch: (selectedMatch: Match | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  selectedMatch: null,

  setSelectedMatch: (selectedMatch: Match | null) => {
    set(() => ({ selectedMatch }));
  },
}));
