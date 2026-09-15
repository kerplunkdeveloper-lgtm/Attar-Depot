'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type AdminTheme = 'dark' | 'light';

interface AdminThemeContextType {
  theme: AdminTheme;
  toggleTheme: () => void;
  setTheme: (theme: AdminTheme) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('attar-admin-theme') as AdminTheme;
      if (saved === 'light' || saved === 'dark') {
        setThemeState(saved);
      }
    } catch (e) {
      console.error(e);
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('attar-admin-theme', newTheme);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div
        className={
          theme === 'light'
            ? 'admin-light-mode transition-colors duration-300'
            : 'admin-dark-mode transition-colors duration-300'
        }
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
