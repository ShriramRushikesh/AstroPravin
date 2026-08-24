import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('astropravin_cart');
      return saved ? JSON.parse(saved) : [];
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
    setCartItems(prev => {
      const variantKey = selectedVariant ? `${product._id || product.id}_${selectedVariant}` : (product._id || product.id);
      const existingIndex = prev.findIndex(item => item.cartItemId === variantKey);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      const newItem = {
        cartItemId: variantKey,
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || Math.round(product.price * 1.25),
        image: product.image,
        category: product.category,
        carat: selectedVariant || product.carat,
        rulingPlanet: product.rulingPlanet,
        quantity: quantity,
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
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

  const totalItemsCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);
  const subtotalAmount = cartItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);

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
