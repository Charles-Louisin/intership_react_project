/** @jsxImportSource react */
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PostProvider } from './context/PostContext';
import Accueil from './pages/dashboard/Accueil';
import Produits from './pages/dashboard/Produits';
import Postes from './pages/dashboard/Postes';
import Profile from './pages/dashboard/Profile';
import Parametres from './pages/dashboard/Parametres';
import Dashboard from './pages/dashboard/Dashboard';
import Panier from './pages/dashboard/Panier';
import { RequireAuth } from './components/RequireAuth';
import { ProfileForm } from './components/auth/ProfileForm';
import { ErrorBoundary } from './utils/errorBoundary';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <PostProvider>
            <Toaster position="top-right" />
            <BrowserRouter>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<ProfileForm />} />
                  <Route path="/dashboard" element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }>
                    <Route index element={<Accueil />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="produits" element={<Produits />} />
                    <Route path="postes" element={<Postes />} />
                    <Route path="panier" element={<Panier />} />
                    <Route path="parametres" element={<Parametres />} />
                  </Route>
                  <Route path="/dashboard/*" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </PostProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
