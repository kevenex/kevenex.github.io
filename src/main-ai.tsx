import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HowIUseAI from './pages/HowIUseAI.tsx';
import { SITE_ACCESS_KEY } from './constants/auth.ts';
import './index.css';

// Behind the same gate as /app/: no stored access, back to the password page.
if (localStorage.getItem(SITE_ACCESS_KEY) !== 'granted') {
  window.location.replace('/');
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <HowIUseAI />
    </StrictMode>
  );
}
