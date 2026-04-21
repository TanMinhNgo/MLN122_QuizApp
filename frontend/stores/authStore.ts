"use client";

import { create } from "zustand";

import { api } from "@/lib/api";
import { User } from "@/types";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: async (email, password) => {
    const response = await api.post<{ accessToken: string; user: User }>("/auth/login", {
      email,
      password,
    });

    const { accessToken, user } = response.data;
    window.localStorage.setItem("accessToken", accessToken);
    set({ accessToken, user, isAuthenticated: true });
  },
  register: async (name, email, password) => {
    await api.post("/auth/register", { name, email, password });
    await get().login(email, password);
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      window.localStorage.removeItem("accessToken");
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
  refreshToken: async () => {
    const response = await api.post<{ accessToken: string; user?: User }>(
      "/auth/refresh-token",
      {},
    );

    const { accessToken, user } = response.data;
    window.localStorage.setItem("accessToken", accessToken);
    set((state) => ({
      accessToken,
      user: user ?? state.user,
      isAuthenticated: true,
    }));
  },
  hydrate: async () => {
    const token = window.localStorage.getItem("accessToken");
    if (!token) {
      set({ user: null, accessToken: null, isAuthenticated: false });
      return;
    }

    set({ accessToken: token, isAuthenticated: true });

    try {
      const response = await api.get<User>("/auth/me");
      set({ user: response.data, isAuthenticated: true });
    } catch {
      window.localStorage.removeItem("accessToken");
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
}));
