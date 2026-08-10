import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { SITE_ACCESS_KEY } from './constants/auth.ts';
import './index.css';

if (localStorage.getItem(SITE_ACCESS_KEY) !== 'granted') {
  window.location.replace('/');
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
