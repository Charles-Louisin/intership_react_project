import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, CreditCard, Phone, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const PaymentMethods = {
  ORANGE: 'Orange Money',
  MTN: 'MTN Mobile Money',
  CARD: 'Carte bancaire'
} as const;

type PaymentMethod = keyof typeof PaymentMethods;

interface Purchase {
  id: string;
  items: any[];
  total: number;
  paymentMethod: PaymentMethod;
  date: string;
}

const Panier = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const validatePhoneNumber = (number: string) => {
    const cameroonRegex = /^(237|(\+237))?(6[5-9])\d{7}$/;
    return cameroonRegex.test(number);
  };

  const handlePhoneSubmit = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Numéro de téléphone invalide');
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour effectuer un achat');
      return;
    }

    if (!selectedPayment) {
      toast.error('Veuillez sélectionner un mode de paiement');
      return;
    }

    if ((selectedPayment === 'ORANGE' || selectedPayment === 'MTN') && !handlePhoneSubmit()) {
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create purchase record
      const purchase: Purchase = {
        id: crypto.randomUUID(),
        items: cartItems,
        total: total,
        paymentMethod: selectedPayment,
        date: new Date().toISOString()
      };

      // Get existing purchases from localStorage
      const existingPurchases = JSON.parse(localStorage.getItem(`purchases_${user.id}`) || '[]');
      
      // Add new purchase
      localStorage.setItem(
        `purchases_${user.id}`, 
        JSON.stringify([purchase, ...existingPurchases])
      );

      toast.success('Paiement effectué avec succès!');
      clearCart();
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      toast.error('Une erreur est survenue lors du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Votre panier est vide</h2>
        <p className="text-gray-500">Ajoutez des produits pour commencer vos achats</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Mon Panier</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
              <div className="relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                />
                {item.discountPercentage > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{item.discountPercentage}%
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                  <p className="text-orange-500 font-semibold">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="text-gray-500 hover:text-orange-500 transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-gray-500 hover:text-orange-500 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé et paiement */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-6 sticky top-8">
          <h2 className="text-xl font-semibold text-gray-900">Résumé de commande</h2>

          <div className="space-y-3">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Détail de la commande</h3>
              <div className=" gap-2 rounded-lg ">
                {cartItems.map(item => (
                  <div key={item.id} className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sous-total ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} articles)</span>
                  <span className="text-sm">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Livraison</span>
                  <span className="text-sm">Gratuite</span>
                </div>

              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-orange-500">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Méthode de paiement</h3>
            <div className="grid gap-2">
              {(Object.keys(PaymentMethods) as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedPayment(method)}
                  className={`text-left p-3 rounded-lg border transition-all ${selectedPayment === method
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPayment === method
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-300'
                      }`}>
                      {selectedPayment === method && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span>{PaymentMethods[method]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Formulaire de paiement mobile */}
          {(selectedPayment === 'ORANGE' || selectedPayment === 'MTN') && (
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Numéro de téléphone</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="6XX XXX XXX"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </label>
            </div>
          )}

          {/* Formulaire de carte bancaire */}
          {selectedPayment === 'CARD' && (
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Numéro de carte</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={cardInfo.number}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
                      setCardInfo({ ...cardInfo, number: formattedValue });
                    }}
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">Expiration</span>
                  <input
                    type="text"
                    value={cardInfo.expiry}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (value.length >= 2) {
                        const month = value.slice(0, 2);
                        const year = value.slice(2);
                        const formattedValue = `${month}/${year}`;
                        setCardInfo({ ...cardInfo, expiry: formattedValue });
                      } else {
                        setCardInfo({ ...cardInfo, expiry: value });
                      }
                    }}
                    placeholder="MM/AA"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">CVV</span>
                  <input
                    type="text"
                    value={cardInfo.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                      setCardInfo({ ...cardInfo, cvv: value });
                    }}
                    placeholder="123"
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Nom sur la carte</span>
                <input
                  type="text"
                  value={cardInfo.name}
                  onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value.toUpperCase() })}
                  placeholder="JOHN DOE"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </label>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={isProcessing || !selectedPayment}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Payer ${total.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panier;