import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Projects from './pages/Projects.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Projects />
  </StrictMode>
);
