import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export interface HeaderSideProps {
  collapsed: boolean;
  className?: string;
}

const HeaderSide = ({ collapsed, className }: HeaderSideProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [, setCurrentUser] = useState<any>(null);
      
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
        <div className={`w-full ${className || ''}`}>
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-4"} cursor-pointer`} 
                 onClick={() => navigate('/dashboard/profile')}>
                <img
                    src={user?.image || '/default-avatar.png'} 
                    alt="User avatar" 
                    className="w-12 h-12 rounded-full object-cover"
                />
                {!collapsed && (
                    <span className="font-bold">{`${user?.firstName} ${user?.lastName}`}</span>
                )}
            </div>
        </div>
    );
}

export default HeaderSide