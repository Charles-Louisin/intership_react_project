import React from 'react'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/auth/Login';
import { AuthProvider } from './context/AuthContext';
import Accueil from './pages/dashboard/Accueil';
import Produits from './pages/dashboard/Produits';
import Postes from './pages/dashboard/Postes';
import Profile from './pages/dashboard/Profile';
import Parametres from './pages/dashboard/Parametres';
import Dashboard from './pages/dashboard/Dashboard';
import Panier from './pages/dashboard/Panier';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Accueil />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/produits" element={<Produits />} />
              <Route path="/dashboard/postes" element={<Postes />} />
              <Route path="/dashboard/panier" element={<Panier />} />
              <Route path="/dashboard/parametres" element={<Parametres />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
