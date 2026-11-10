import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { hydrateStore } from './api/hydrate';
import { errorText } from './api/client';
import './styles/index.css';

const root = createRoot(document.getElementById('root'));

// Store content comes from the Web Portal API: load it first, then render the app.
async function start() {
  try {
    await hydrateStore();
  } catch (err) {
    root.render(
      <div className="boot-state">
        <p className="boot-title">The store is temporarily unavailable</p>
        <p className="boot-text">{errorText(err)}</p>
        <button type="button" className="btn-gold" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>,
    );
    return;
  }

  // Providers and pages are imported after hydration so module-level reads see live data.
  const [{ default: App }, { AuthProvider }, { ShopProvider }, { ThemeProvider }, { UIProvider }] = await Promise.all([
    import('./App'),
    import('./context/AuthContext'),
    import('./context/ShopContext'),
    import('./context/ThemeContext'),
    import('./context/UIContext'),
  ]);

  root.render(
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
}

root.render(
  <div className="boot-state">
    <span className="boot-mark">✦</span>
  </div>,
);
start();
