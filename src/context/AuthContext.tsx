/** @jsxImportSource react */
import { createContext, useContext, useState, useEffect } from 'react';
import { safeSetItem } from '../utils/storage';
import { User } from '../types';

interface AuthUser extends User {
  sessionId: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (data: AuthUser) => void;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      const savedProfile = savedUser ? JSON.parse(savedUser) : null;
      if (savedProfile?.id) {
        const userProfile = localStorage.getItem(`userProfile_${savedProfile.id}`);
        if (userProfile) {
          const fullProfile = JSON.parse(userProfile);
          // Fusionner les données essentielles avec l'image du profil complet
          return {
            ...savedProfile,
            image: fullProfile.image || savedProfile.image
          };
        }
      }
      return savedProfile;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  });

  // Ajouter un événement personnalisé pour la synchronisation
  const dispatchProfileUpdate = (userData: any) => {
    const event = new CustomEvent('profileUpdate', { detail: userData });
    window.dispatchEvent(event);
  };

  const login = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    // Nettoyer les données spécifiques à l'utilisateur
    if (user) {
      localStorage.removeItem(`userPosts_${user.id}`);
      localStorage.removeItem(`userComments_${user.id}`);
    }
  };

  const updateUser = async (userData: Partial<AuthUser>) => {
    try {
      const updatedUser = {
        ...user,
        ...userData,
      } as AuthUser;
      
      // Sauvegarder les données essentielles uniquement
      const essentialData = {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        image: updatedUser.image,
        username: updatedUser.username
      };
      
      await safeSetItem('currentUser', essentialData);
      
      if (updatedUser.id) {
        const success = await safeSetItem(`userProfile_${updatedUser.id}`, {
          ...updatedUser,
          lastUpdated: new Date().toISOString()
        });
        
        if (!success) {
          console.warn('Profile data was compressed due to storage limitations');
        }
      }
      
      setUser(prevUser => ({
        ...prevUser,
        ...essentialData,
        sessionId: prevUser?.sessionId || ''
      } as AuthUser));
      dispatchProfileUpdate(essentialData);
      
    } catch (error) {
      console.warn('Erreur lors de la mise à jour des données utilisateur:', error);
    }
  };

  // Ajouter un effet pour vérifier la session
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
