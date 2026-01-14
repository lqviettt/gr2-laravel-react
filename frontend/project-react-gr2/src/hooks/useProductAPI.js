import { toast } from 'react-toastify';
import { api } from '../utils/apiClient';
import { buildProductPayload, buildVariantPayload, fileToBase64 } from '../utils/productHelpers';

export const useProductAPI = () => {
  const createProduct = async (product, defaults = {}, hasVariant = false) => {
    const payload = buildProductPayload(product, false, defaults);

    // If product has variant, include image in payload (will be saved to variant)
    // Otherwise only include image if it's already a string path
    if (hasVariant && product.image && product.image instanceof File) {
      const base64Image = await fileToBase64(product.image);
      payload.image = base64Image;
    } else if (!hasVariant && product.image && product.image instanceof File) {
      const base64Image = await fileToBase64(product.image);
      payload.image = base64Image;
    }

    const response = await api.post('/product', payload);
    return response.data;
  };

  const updateProduct = async (productId, product, isVariant = false, defaults = {}) => {
    const payload = buildProductPayload(product, false, defaults);

    if (product.image && product.image instanceof File) {
      const base64Image = await fileToBase64(product.image);
      payload.image = base64Image;
    }

    const response = await api.put(`/product/${productId}`, payload);

    if (isVariant && product.variant_id) {
      const variantPayload = buildVariantPayload(product);
      await api.put(`/product-variant/${product.variant_id}`, variantPayload);
    }

    return response.data;
  };

  const deleteProduct = async (productId) => {
    const response = await api.delete(`/product/${productId}`);
    return response.data;
  };

  const deleteVariant = async (variantId) => {
    const response = await api.delete(`/product-variant/${variantId}`);
    return response.data;
  };

  const fetchProductDetails = async (productId) => {
    const response = await api.get(`/product/${productId}`);
    return response.data.data;
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    deleteVariant,
    fetchProductDetails,
  };
};
