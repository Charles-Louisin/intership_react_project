import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, CreditCard, Phone, CreditCardIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentMethods = {
  ORANGE: 'Orange Money',
  MTN: 'MTN Mobile Money',
  CARD: 'Carte bancaire'
} as const;

type PaymentMethod = keyof typeof PaymentMethods;

const Panier = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
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
      toast.success('Paiement effectué avec succès!');
      clearCart();
    } catch (error) {
      toast.error('Erreur lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Votre panier est vide</h2>
        <p className="text-gray-600">Ajoutez des produits pour commencer vos achats</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Mon Panier</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map(item => (
            <div key={item.id} className="flex gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-32 h-32 object-cover rounded-lg"
              />
              
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-orange-500 font-semibold">${item.price}</p>
                
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-fit space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Résumé</h2>
          
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">Total</span>
            <span className="font-semibold text-orange-500">${total.toFixed(2)}</span>
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-gray-800">Mode de paiement</p>
            {(Object.keys(PaymentMethods) as PaymentMethod[]).map((method) => (
              <label
                key={method}
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPayment === method ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={selectedPayment === method}
                  onChange={() => setSelectedPayment(method)}
                  className="text-orange-500"
                />
                <span className="font-medium">{PaymentMethods[method]}</span>
              </label>
            ))}
          </div>

          {(selectedPayment === 'ORANGE' || selectedPayment === 'MTN') && (
            <div className="space-y-3">
              <label className="block">
                <span className="text-gray-700 block mb-1">Numéro de téléphone</span>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="ex: 655555555"
                    className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </label>
            </div>
          )}

          {selectedPayment === 'CARD' && (
            <div className="space-y-3">
              <label className="block">
              <span className="text-gray-700 block mb-1">Numéro de carte</span>
              <input
                type="text"
                value={cardInfo.number}
                onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
                setCardInfo({...cardInfo, number: formattedValue});
                }}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              </label>
              <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700 block mb-1">Date d'expiration</span>
                <input
                type="text"
                value={cardInfo.expiry}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (value.length >= 2) {
                  const month = value.slice(0, 2);
                  const year = value.slice(2);
                  const formattedValue = `${month}/${year}`;
                  setCardInfo({...cardInfo, expiry: formattedValue});
                  } else {
                  setCardInfo({...cardInfo, expiry: value});
                  }
                }}
                placeholder="MM/YY"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 block mb-1">CVV</span>
                <input
                type="text"
                value={cardInfo.cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                  setCardInfo({...cardInfo, cvv: value});
                }}
                placeholder="123"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </label>
              </div>
              <label className="block">
              <span className="text-gray-700 block mb-1">Nom sur la carte</span>
              <input
                type="text"
                value={cardInfo.name}
                onChange={(e) => setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})}
                placeholder="JOHN DOE"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              </label>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-medium"
          >
            {isProcessing ? (
              'Traitement...'
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Payer maintenant
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panier;