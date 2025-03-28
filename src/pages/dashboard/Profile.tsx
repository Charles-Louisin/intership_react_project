import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2, Edit, Save, X, Camera, Mail, Phone, Calendar, MapPin, GraduationCap, Briefcase, CreditCard, Coins, ShoppingCart, FileText, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { safeSetItem } from '../../utils/storage';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: { color: string; type: string };
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  university: string;
  company: {
    department: string;
    name: string;
    title: string;
  };
  bank: {
    cardExpire: string;
    cardType: string;
    currency: string;
  };
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
}

interface Purchase {
  id: string;
  items: any[];
  total: number;
  paymentMethod: string;
  date: string;
}

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UserData>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState({
    profile: true,
    posts: true,
    comments: true,
    purchases: true,
    saving: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    if (user?.id) {
      // Charger d'abord les données locales
      const localData = localStorage.getItem(`userProfile_${user.id}`);
      if (localData) {
        const parsedData = JSON.parse(localData);
        // S'assurer que l'image du profil est synchronisée
        if (user.image !== parsedData.image) {
          parsedData.image = user.image;
          localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(parsedData));
        }
        setUserData(parsedData);
        setIsLoading(prev => ({ ...prev, profile: false }));
      } else {
        // Si pas de données locales, charger depuis l'API
        fetch(`https://dummyjson.com/users/${user.id}`)
          .then(res => res.json())
          .then(data => {
            // Fusionner avec les données utilisateur actuelles
            const mergedData = {
              ...data,
              image: user.image || data.image
            };
            setUserData(mergedData);
            try {
              localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(mergedData));
            } catch (e) {
              console.warn('Impossible de sauvegarder dans le localStorage');
            }
            setIsLoading(prev => ({ ...prev, profile: false }));
          })
          .catch(() => setIsLoading(prev => ({ ...prev, profile: false })));
      }

      // Fetch user posts
      fetch(`https://dummyjson.com/posts/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setPosts(data.posts || []);
          setIsLoading(prev => ({ ...prev, posts: false }));
        })
        .catch(() => {
          setPosts([]);
          setIsLoading(prev => ({ ...prev, posts: false }));
        });

      // Simule les commentaires puisque l'endpoint n'existe pas
      setComments([]);
      setIsLoading(prev => ({ ...prev, comments: false }));

      // Fetch purchases from localStorage avec gestion d'erreur
      try {
        const storedPurchases = localStorage.getItem(`purchases_${user.id}`);
        if (storedPurchases) {
          setPurchases(JSON.parse(storedPurchases));
        }
      } catch (e) {
        console.warn('Impossible de charger les achats');
      }
      setIsLoading(prev => ({ ...prev, purchases: false }));
    }
  }, [user?.id, user?.image]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData || {});
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setEditedData(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderEditableField = (label: string, value: string | number, field: string, icon?: React.ReactNode) => {
    return (
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          {icon && <span className="mr-2 text-orange-500">{icon}</span>}
          {label}
        </label>
        <input
          type={typeof value === 'number' ? 'number' : 'text'}
          value={editedData[field as keyof typeof editedData] || value}
          onChange={e => {
            const newValue = typeof value === 'number' ? parseFloat(e.target.value) : e.target.value;
            setEditedData({ ...editedData, [field]: newValue });
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
        />
      </div>
    );
  };

  const renderReadOnlyField = (label: string, value: string | number, icon?: React.ReactNode) => {
    return (
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          {icon && <span className="mr-2 text-orange-500">{icon}</span>}
          {label}
        </label>
        <div className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
          {value || '-'}
        </div>
      </div>
    );
  };

  const handleSave = async () => {
    setIsLoading(prev => ({ ...prev, saving: true }));
    try {
      if (userData && editedData) {
        const updatedData = { ...userData };
        
        Object.entries(editedData).forEach(([key, value]) => {
          if (key.includes('.')) {
            const [parent, child] = key.split('.');
            if (!updatedData[parent]) updatedData[parent] = {};
            updatedData[parent][child] = value;
          } else {
            updatedData[key] = value;
          }
        });

        // Mettre à jour le contexte avec les données essentielles
        const essentialData = {
          id: updatedData.id,
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          email: updatedData.email,
          image: updatedData.image,
          username: updatedData.username
        };

        await updateUser(essentialData);

        const success = await safeSetItem(`userProfile_${user.id}`, updatedData);
        if (!success) {
          toast.error('Certaines données n\'ont pas pu être sauvegardées', {
            duration: 3000,
          });
        } else {
          setUserData(updatedData);
          setIsEditing(false);
          setEditedData({});
          setImagePreview(null);
          
          toast.success('Profil mis à jour avec succès!', {
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(prev => ({ ...prev, saving: false }));
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading.profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!userData) {
    return <div className="text-center py-10">Erreur de chargement du profil</div>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex md:flex-row flex-col ite:ms-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex flex-col md:items-center items-start md:flex-row w-full md:w-fit">
            <div className="relative w-full flex justify-center md:flex md:w-full mb-4 md:mb-0 group">
              <img
                src={imagePreview || userData?.image}
                alt={userData?.username}
                className="w-32 h-32 md:w-32 md:h-32 md:rounded-full rounded-full object-cover border-4 border-orange-100"
              />
              {isEditing && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <div className="text-white flex flex-col items-center">
                      <Camera className="w-6 h-6" />
                      <span className="text-xs mt-1">Modifier</span>
                    </div>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </>
              )}
            </div>
            <div className="ml-0 md:ml-4 text-center md:text-left w-full">
              <h1 className="text-2xl font-bold text-gray-800 mb-2 md:flex md:items-center md:space-x-2 md:mb-1">
                {isEditing ? (
                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-fit">
                    <input
                      type="text"
                      value={editedData.firstName || userData?.firstName}
                      onChange={e => setEditedData({ ...editedData, firstName: e.target.value })}
                      className="border rounded-lg px-3 py-1 focus:ring-2 focus:ring-orange-500 w-full md:w-[200px]"
                      placeholder="Prénom"
                    />
                    <input
                      type="text"
                      value={editedData.lastName || userData?.lastName}
                      onChange={e => setEditedData({ ...editedData, lastName: e.target.value })}
                      className="border rounded-lg px-3 py-1 focus:ring-2 focus:ring-orange-500 w-full md:w-[200px]"
                      placeholder="Nom"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                    <span>{userData?.firstName}</span>
                    <span>{userData?.lastName}</span>
                  </div>
                )}
              </h1>
              <p className="text-gray-600 flex items-center justify-center md:justify-start">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                  @{userData?.username}
                </span>
              </p>
            </div>
          </div>
          {isEditing ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={handleSave}
                disabled={isLoading.saving}
                className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
              >
                {isLoading.saving ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={18} />
                    Enregistrer
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setImagePreview(null);
                }}
                className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
              >
                <X className="mr-2" size={18} />
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="flex items-center justify-center bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors w-full md:w-auto"
            >
              <Edit className="mr-2" size={18} />
              Modifier le profil
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Details Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800 flex items-center">
              <span className="bg-orange-100 p-2 rounded-lg mr-2">
                <FileText className="text-orange-500" size={18} />
              </span>
              Informations personnelles
            </h2>
            {isEditing ? (
              <div>
                {renderEditableField('Age', userData.age, 'age')}
                {renderEditableField('Genre', userData.gender, 'gender')}
                {renderEditableField('Date de naissance', userData.birthDate, 'birthDate', <Calendar size={18} />)}
                {renderEditableField('Email', userData.email, 'email', <Mail size={18} />)}
                {renderEditableField('Téléphone', userData.phone, 'phone', <Phone size={18} />)}
              </div>
            ) : (
              <div>
                {renderReadOnlyField('Age', userData.age)}
                {renderReadOnlyField('Genre', userData.gender)}
                {renderReadOnlyField('Date de naissance', userData.birthDate, <Calendar size={18} />)}
                {renderReadOnlyField('Email', userData.email, <Mail size={18} />)}
                {renderReadOnlyField('Téléphone', userData.phone, <Phone size={18} />)}
              </div>
            )}
          </div>

          {/* Physical Characteristics */}
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800 flex items-center">
              <span className="bg-orange-100 p-2 rounded-lg mr-2">
                <Briefcase className="text-orange-500" size={18} />
              </span>
              Caractéristiques physiques
            </h2>
            {isEditing ? (
              <div>
                {renderEditableField('Groupe sanguin', userData.bloodGroup, 'bloodGroup')}
                {renderEditableField('Taille (cm)', userData.height, 'height')}
                {renderEditableField('Poids (kg)', userData.weight, 'weight')}
                {renderEditableField('Couleur des yeux', userData.eyeColor, 'eyeColor')}
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <span className="mr-2 text-orange-500">Cheveux</span>
                    Couleur & Type
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={editedData.hair?.color || userData.hair.color}
                      onChange={e => setEditedData({
                        ...editedData,
                        hair: { ...userData.hair, color: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Couleur"
                    />
                    <input
                      type="text"
                      value={editedData.hair?.type || userData.hair.type}
                      onChange={e => setEditedData({
                        ...editedData,
                        hair: { ...userData.hair, type: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Type"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {renderReadOnlyField('Groupe sanguin', userData.bloodGroup)}
                {renderReadOnlyField('Taille (cm)', userData.height)}
                {renderReadOnlyField('Poids (kg)', userData.weight)}
                {renderReadOnlyField('Couleur des yeux', userData.eyeColor)}
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <span className="mr-2 text-orange-500">Cheveux</span>
                  </label>
                  <div className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {userData.hair.color} ({userData.hair.type})
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address & Education */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800 flex items-center">
          <span className="bg-orange-100 p-2 rounded-lg mr-2">
            <MapPin className="text-orange-500" size={18} />
          </span>
          Adresse & Éducation
        </h2>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {renderEditableField('Adresse', userData.address.address, 'address.address')}
              {renderEditableField('Ville', userData.address.city, 'address.city')}
              {renderEditableField('État', userData.address.state, 'address.state')}
            </div>
            <div>
              {renderEditableField('Code postal', userData.address.postalCode, 'address.postalCode')}
              {renderEditableField('Pays', userData.address.country, 'address.country')}
              {renderEditableField('Université', userData.university, 'university', <GraduationCap size={18} />)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {renderReadOnlyField('Adresse', userData.address.address)}
              {renderReadOnlyField('Ville', userData.address.city)}
              {renderReadOnlyField('État', userData.address.state)}
            </div>
            <div>
              {renderReadOnlyField('Code postal', userData.address.postalCode)}
              {renderReadOnlyField('Pays', userData.address.country)}
              {renderReadOnlyField('Université', userData.university, <GraduationCap size={18} />)}
            </div>
          </div>
        )}
      </div>

      {/* Work & Financial */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800 flex items-center">
          <span className="bg-orange-100 p-2 rounded-lg mr-2">
            <Briefcase className="text-orange-500" size={18} />
          </span>
          Information professionnelle
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-gray-700">Entreprise</h3>
            {isEditing ? (
              <div>
                {renderEditableField('Nom de l\'entreprise', userData.company.name, 'company.name')}
                {renderEditableField('Département', userData.company.department, 'company.department')}
                {renderEditableField('Poste', userData.company.title, 'company.title')}
              </div>
            ) : (
              <div>
                {renderReadOnlyField('Nom de l\'entreprise', userData.company.name)}
                {renderReadOnlyField('Département', userData.company.department)}
                {renderReadOnlyField('Poste', userData.company.title)}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-gray-700">Information financière</h3>
            {isEditing ? (
              <div>
                {renderEditableField('Type de carte', userData.bank.cardType, 'bank.cardType', <CreditCard size={18} />)}
                {renderEditableField('Expiration', userData.bank.cardExpire, 'bank.cardExpire')}
                {renderEditableField('Devise', userData.bank.currency, 'bank.currency')}
              </div>
            ) : (
              <div>
                {renderReadOnlyField('Type de carte', userData.bank.cardType, <CreditCard size={18} />)}
                {renderReadOnlyField('Expiration', userData.bank.cardExpire)}
                {renderReadOnlyField('Devise', userData.bank.currency)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crypto */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800 flex items-center">
          <span className="bg-orange-100 p-2 rounded-lg mr-2">
            <Coins className="text-orange-500" size={18} />
          </span>
          Portefeuille Crypto
        </h2>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderEditableField('Coin', userData.crypto.coin, 'crypto.coin')}
            {renderEditableField('Wallet', userData.crypto.wallet, 'crypto.wallet')}
            {renderEditableField('Network', userData.crypto.network, 'crypto.network')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderReadOnlyField('Coin', userData.crypto.coin)}
            {renderReadOnlyField('Wallet', userData.crypto.wallet.substring(0, 20) + '...')}
            {renderReadOnlyField('Network', userData.crypto.network)}
          </div>
        )}
      </div>

      {/* Purchases History */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800 flex items-center">
          <span className="bg-orange-100 p-2 rounded-lg mr-2">
            <ShoppingCart className="text-orange-500" size={18} />
          </span>
          Historique des achats
        </h2>
        {isLoading.purchases ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-orange-500" size={24} />
          </div>
        ) : purchases.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun achat effectué</p>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-800">Commande #{purchase.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(purchase.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ${purchase.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {purchase.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          Quantité: {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-3 flex items-center">
                  <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                    {purchase.paymentMethod}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800 flex items-center">
          <span className="bg-orange-100 p-2 rounded-lg mr-2">
            <MessageSquare className="text-orange-500" size={18} />
          </span>
          Activité récente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-gray-700 flex items-center">
              <span className="bg-orange-100 p-1 rounded-lg mr-2">
                <FileText className="text-orange-500" size={16} />
              </span>
              Posts ({posts.length})
            </h3>
            {isLoading.posts ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-orange-500" size={20} />
              </div>
            ) : posts.slice(0, 5).map((post: any) => (
              <div key={post.id} className="mb-3 p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
                <p className="font-medium text-gray-800">{post.title}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.body}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-gray-700 flex items-center">
              <span className="bg-orange-100 p-1 rounded-lg mr-2">
                <MessageSquare className="text-orange-500" size={16} />
              </span>
              Commentaires ({comments.length})
            </h3>
            {isLoading.comments ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-orange-500" size={20} />
              </div>
            ) : comments.slice(0, 5).map((comment: any) => (
              <div key={comment.id} className="mb-3 p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
                <p className="text-sm text-gray-800 line-clamp-3">{comment.body}</p>
                <p className="text-xs text-gray-500 mt-1">Post: {comment.postId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;