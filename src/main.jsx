
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ✅ import providers and toaster
import { AuthProvider } from './context/AuthContext'
import { ModalProvider } from './context/ModalContext'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ModalProvider>
        <App />
        <Toaster position="top-center" />
      </ModalProvider>
    </AuthProvider>
  </React.StrictMode>,
)
