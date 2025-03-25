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
import Commentaires from './pages/dashboard/Commentaires';
import Profile from './pages/dashboard/Profile';
import Parametres from './pages/dashboard/Parametres';
import Dashboard from './pages/dashboard/Dashboard';

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
              <Route path="profile" element={<Profile />} />
              <Route path="produits" element={<Produits />} />
              <Route path="postes" element={<Postes />} />
              <Route path="commentaires" element={<Commentaires />} />
              <Route path="parametres" element={<Parametres />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
