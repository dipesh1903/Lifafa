import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './config/firebase.config.ts'
import { Theme } from '@radix-ui/themes';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme className='flex justify-center bg-light-surface bg-opacity-50'>
      <App />
    </Theme>
  </StrictMode>,
)
