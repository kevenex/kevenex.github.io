import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HowIUseAI from './pages/HowIUseAI.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HowIUseAI />
  </StrictMode>
);
