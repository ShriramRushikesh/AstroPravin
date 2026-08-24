import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const parsePriceNumber = (val) => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (!val) return 0;
  const num = Number(String(val).replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('astropravin_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(item => ({
            ...item,
            price: parsePriceNumber(item.price),
            quantity: Number(item.quantity) || 1,
          }));
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('astropravin_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage');
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    if (!product) return;

    const numericPrice = parsePriceNumber(product.price);
    const parsedQty = Math.max(1, Number(quantity) || 1);

    setCartItems(prev => {
      const variantKey = selectedVariant ? `${product._id || product.id}_${selectedVariant}` : (product._id || product.id);
      const existingIndex = prev.findIndex(item => item.cartItemId === variantKey);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          price: numericPrice || updated[existingIndex].price,
          quantity: updated[existingIndex].quantity + parsedQty,
        };
        return updated;
      }

      const newItem = {
        cartItemId: variantKey,
        productId: product._id || product.id,
        name: product.name || 'Spiritual Artifact',
        price: numericPrice,
        originalPrice: product.originalPrice ? parsePriceNumber(product.originalPrice) : Math.round(numericPrice * 1.25),
        image: product.image || '',
        category: product.category || 'gemstones',
        carat: selectedVariant || product.carat || '',
        rulingPlanet: product.rulingPlanet || '',
        quantity: parsedQty,
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    const qty = Number(newQty);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('astropravin_cart');
    } catch (e) {}
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItemsCount = cartItems.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);
  const subtotalAmount = cartItems.reduce((sum, it) => sum + (parsePriceNumber(it.price) * (Number(it.quantity) || 1)), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
