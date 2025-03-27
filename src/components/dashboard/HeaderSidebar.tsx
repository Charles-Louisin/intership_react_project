import { useAuth } from '../../context/AuthContext';
import React from 'react';

export const HeaderSidebar = () => {
  const { user } = useAuth();

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