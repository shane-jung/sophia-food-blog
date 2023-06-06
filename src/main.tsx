import React from 'react'
import { createRoot } from 'react-dom/client';
import { App } from './client/containers/App'
import '@/client/styles/index.scss'
import { AuthProvider } from './client/contexts/AuthProvider';
import { Provider } from 'react-redux';
import { store } from './client/slices/store';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store = {store}> 
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
    
  </React.StrictMode>,
)
