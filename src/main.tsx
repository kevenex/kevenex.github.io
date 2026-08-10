import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ComingSoon from './components/ComingSoon.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ComingSoon />
  </StrictMode>
);
