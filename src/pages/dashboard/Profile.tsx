import React from 'react'
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Charger les données spécifiques à l'utilisateur
  const getUserData = () => {
    const userData = localStorage.getItem(`userData_${user.id}`);
    return userData ? JSON.parse(userData) : null;
  };

  // Sauvegarder les données spécifiques à l'utilisateur
  const saveUserData = (data: any) => {
    localStorage.setItem(`userData_${user.id}`, JSON.stringify(data));
  };

  return (
    <div>Profile</div>
  )
}

export default Profile