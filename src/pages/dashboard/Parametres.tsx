
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Parametres = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // const getUserSettings = () => {
  //   const settings = localStorage.getItem(`settings_${user.id}`);
  //   return settings ? JSON.parse(settings) : defaultSettings;
  // };

  // const saveUserSettings = (settings: any) => {
  //   localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings));
  // };

  return (
    <div>Parametres</div>
  )
}

export default Parametres