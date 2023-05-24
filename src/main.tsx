import React from 'react'
import { createRoot } from 'react-dom/client';
import { App } from './client/containers/App'
import '@/client/styles/index.scss'
import { AuthProvider } from './client/contexts/AuthProvider';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
