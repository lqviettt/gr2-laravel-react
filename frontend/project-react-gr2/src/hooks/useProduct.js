import { useState, useCallback } from 'react';

const FIXED_QUANTITY = 10;
const FIXED_WEIGHT = 500;

export const generateProductCode = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PRD-${timestamp}-${randomStr}`;
};

const INITIAL_PRODUCT_STATE = {
  code: generateProductCode(),
  name: "",
  color: "",
  price: "",
  quantity: FIXED_QUANTITY,
  status: "1",
  weight: FIXED_WEIGHT,
  category_id: "",
  description: "",
  image: null,
};

export const useProduct = () => {
  const [newProduct, setNewProduct] = useState(INITIAL_PRODUCT_STATE);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingVariant, setEditingVariant] = useState(false);

  const resetProduct = useCallback(() => {
    setNewProduct(INITIAL_PRODUCT_STATE);
    setImagePreview(null);
    setEditingProductId(null);
    setEditingVariant(false);
  }, []);

  const resetProductWithoutCode = useCallback(() => {
    setNewProduct({
      ...INITIAL_PRODUCT_STATE,
      code: generateProductCode(),
    });
    setImagePreview(null);
  }, []);

  const setEditingProduct = useCallback((product, isVariant = false) => {
    setNewProduct(product);
    setEditingVariant(isVariant);
  }, []);

  const handleImageChange = useCallback((file) => {
    if (file) {
      setNewProduct(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return {
    newProduct,
    setNewProduct,
    imagePreview,
    setImagePreview,
    editingProductId,
    setEditingProductId,
    editingVariant,
    setEditingVariant,
    resetProduct,
    resetProductWithoutCode,
    setEditingProduct,
    handleImageChange,
    FIXED_QUANTITY,
    FIXED_WEIGHT,
  };
};
