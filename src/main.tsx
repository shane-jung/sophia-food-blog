import React from 'react'
import { createRoot } from 'react-dom/client';
import { App } from './client/containers/App'
import '@/client/styles/index.scss'

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
