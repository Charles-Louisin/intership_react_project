import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

export const HeaderSidebar = () => {
  const { user } = useAuth();

   const [ setCurrentUser] = useState<any>(null);
  
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      setCurrentUser(user);
    }, []);

    useEffect(() => {
            const handleProfileUpdate = (event: CustomEvent) => {
              const updatedUser = event.detail;
              setCurrentUser(updatedUser);
              // Mettre à jour l'état local avec la nouvelle photo
              // Par exemple : setUserImage(updatedUser.image)
            };
        
            window.addEventListener('profileUpdate', handleProfileUpdate as EventListener);
        
            return () => {
              window.removeEventListener('profileUpdate', handleProfileUpdate as EventListener);
            };
          }, []);

  return (
    <header className="bg-white border-b border-b-gray-200 h-16">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Profil utilisateur */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              <span className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </span>
              <img
                src={user.image}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
};