import { Match } from "@/utils/constants";
import { create } from "zustand";

type ChatStore = {
  selectedMatch: Match | null;
  setSelectedMatch: (selectedMatch: Match | null) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  selectedMatch: null,

  setSelectedMatch: (selectedMatch: Match | null) => {
    set(() => ({ selectedMatch }));
  },
}));
