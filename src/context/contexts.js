import { createContext } from 'react';

// Context objects live here so provider files export only components (keeps Fast Refresh happy).
export const ThemeContext = createContext(null);
export const ShopContext = createContext(null);
export const UIContext = createContext(null);
export const AuthContext = createContext(null);
export const B2BContext = createContext(null);
