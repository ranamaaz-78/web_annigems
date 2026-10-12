import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { ThemeProvider } from './context/ThemeContext';
import { UIProvider } from './context/UIContext';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ShopProvider>
            <UIProvider>
              <App />
            </UIProvider>
          </ShopProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
