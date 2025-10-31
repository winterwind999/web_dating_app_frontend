import { create } from "zustand";

type AuthStore = {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  csrfToken: string | null;
  setCsrfToken: (csrfToken: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken: string | null) => {
    set({ accessToken });
  },
  csrfToken: null,
  setCsrfToken: (csrfToken: string | null) => {
    set({ csrfToken });
  },
  logout: () => {
    set(() => ({
      accessToken: null,
      csrfToken: null,
    }));
  },
}));
