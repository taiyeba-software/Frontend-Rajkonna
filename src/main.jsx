
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ✅ import providers and toaster
import { AuthProvider } from './context/AuthContext'
import { ModalProvider } from './context/ModalContext'
import { ProductProvider } from './context/ProductContext'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ModalProvider>
        <ProductProvider>
          <App />
          <Toaster position="top-center" />
        </ProductProvider>
      </ModalProvider>
    </AuthProvider>
  </React.StrictMode>,
)
