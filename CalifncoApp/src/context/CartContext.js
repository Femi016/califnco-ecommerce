import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { role, user } = useAuth();
  const [items, setItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [useWalletCredits, setUseWalletCredits] = useState(false);

  // Load saved cart from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('@califnco_cart').then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) setItems(parsed);
        } catch (e) {}
      }
    }).catch(() => {});
  }, []);

  const saveCart = (newItems) => {
    AsyncStorage.setItem('@califnco_cart', JSON.stringify(newItems)).catch(() => {});
  };

  // Add item to cart
  const addToCart = (product, quantity = null) => {
    const isDealer = role === 'dealer';
    // If dealer, default quantity is at least the MOQ
    const addQty = quantity !== null ? quantity : (isDealer ? (product.moq || 1) : 1);

    setItems((prev) => {
      const existing = prev.find(i => i.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + addQty } : i
        );
      } else {
        updated = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            image: product.image,
            retailPrice: product.retailPrice,
            wholesalePrice: product.wholesalePrice,
            moq: product.moq || 1,
            quantity: addQty
          }
        ];
      }
      saveCart(updated);
      return updated;
    });
  };

  // Update item quantity
  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => {
      const updated = prev.map(i => i.id === id ? { ...i, quantity: newQty } : i);
      saveCart(updated);
      return updated;
    });
  };

  // Remove single item
  const removeFromCart = (id) => {
    setItems((prev) => {
      const updated = prev.filter(i => i.id !== id);
      saveCart(updated);
      return updated;
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setItems([]);
    saveCart([]);
    setPromoCode('');
    setDiscountPercent(0);
    setUseWalletCredits(false);
  };

  // Apply Coupon / Promo Code
  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CLEANWATER10') {
      setPromoCode('CLEANWATER10');
      setDiscountPercent(10);
      return { success: true, message: '10% discount applied successfully!' };
    } else if (clean === 'DEALERBULK5' && role === 'dealer') {
      setPromoCode('DEALERBULK5');
      setDiscountPercent(5);
      return { success: true, message: 'Extra 5% Wholesale Festive discount applied!' };
    } else if (clean === 'FREESHIP') {
      setPromoCode('FREESHIP');
      setDiscountPercent(0);
      return { success: true, message: 'Free Express Shipping code applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code' };
  };

  // Calculate prices dynamically based on current user role
  const isDealer = role === 'dealer';

  const cartTotalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const effectivePrice = isDealer ? item.wholesalePrice : item.retailPrice;
    return sum + (effectivePrice * item.quantity);
  }, 0);

  // 18% GST for water filtration machinery
  const gstAmount = Math.round(subtotal * 0.18);

  // Standard shipping logic
  const shippingFee = (subtotal > 2000 || promoCode === 'FREESHIP' || subtotal === 0) ? 0 : 149;

  // Percentage promo discount
  const promoDiscountAmount = Math.round((subtotal * discountPercent) / 100);

  // Wallet credits application (up to available wallet balance or ₹500, max subtotal)
  const walletDiscount = useWalletCredits ? Math.min(user.walletBalance || 0, 500, subtotal) : 0;

  const totalDiscount = promoDiscountAmount + walletDiscount;

  const grandTotal = Math.max(0, subtotal + gstAmount + shippingFee - totalDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotalItems,
        subtotal,
        gstAmount,
        shippingFee,
        promoCode,
        discountPercent,
        promoDiscountAmount,
        useWalletCredits,
        setUseWalletCredits,
        walletDiscount,
        totalDiscount,
        grandTotal,
        applyPromo,
        isDealer
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
