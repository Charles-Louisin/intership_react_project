import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userCart = localStorage.getItem(`cart_${user.id}`);
      setCartItems(userCart ? JSON.parse(userCart) : []);
    } else {
      setCartItems([]);
    }
  }, [user]);

  const saveCart = (items: CartItem[]) => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
      setCartItems(items);
    }
  };

  const addToCart = (product: Product) => {
    if (!user) {
      toast.error('Veuillez vous connecter');
      return;
    }
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Si le produit existe déjà, on garde la quantité actuelle
        return prevItems;
      }
      
      // Si le produit n'existe pas, on l'ajoute avec une quantité de 1
      const newCart = [...prevItems, { ...product, quantity: 1 }];
      saveCart(newCart);
      return newCart;
    });
    
    toast.success(`${product.title} ajouté au panier`);
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const newCart = prevItems.filter(item => item.id !== productId);
      saveCart(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems(prevItems => {
      const newCart = prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );
      saveCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  const isInCart = (productId: number) => {
    return cartItems.some(item => item.id === productId);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
