// CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProductIndex = prevItems.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedVariant.id === product.selectedVariant.id
      );

      if (existingProductIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingProductIndex].quantity += product.quantity;
        return updatedItems;
      } else {
        return [...prevItems, product];
      }
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId, variantId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => {
        if (variantId) {
          return item.id !== productId || item.selectedVariant.id !== variantId;
        }
        return item.id !== productId;
      })
    );
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartItem = (productId, variantId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (variantId) {
          if (item.id === productId && item.selectedVariant.id === variantId) {
            return { ...item, quantity: newQuantity };
          }
        } else {
          if (item.id === productId) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
