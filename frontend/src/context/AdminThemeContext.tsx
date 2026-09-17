'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type AdminTheme = 'light';

interface AdminThemeContextType {
  theme: AdminTheme;
  toggleTheme: () => void;
  setTheme: (theme: AdminTheme) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      localStorage.setItem('attar-admin-theme', 'light');
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <AdminThemeContext.Provider
      value={{
        theme: 'light',
        toggleTheme: () => {},
        setTheme: () => {},
      }}
    >
      <div className="admin-light-mode">{children}</div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
