import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
          if (typeof window !== 'undefined') {
            if (nextTheme === 'light') {
              document.documentElement.classList.add('light');
              document.documentElement.classList.remove('dark');
              document.body.style.backgroundColor = '#f8fafc';
              document.body.style.color = '#0f172a';
            } else {
              document.documentElement.classList.add('dark');
              document.documentElement.classList.remove('light');
              document.body.style.backgroundColor = '#09090b';
              document.body.style.color = '#ffffff';
            }
          }
          return { theme: nextTheme };
        }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'dinepulse-theme-storage',
    }
  )
);
