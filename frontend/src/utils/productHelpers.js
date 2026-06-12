export const PRODUCT_FIELD_TYPES = {
  QUANTITY: 'quantity',
  WEIGHT: 'weight',
  PRICE: 'price',
  CATEGORY_ID: 'category_id',
  STATUS: 'status',
  CODE: 'code',
};

/**
 * Convert product field to appropriate type
 */
export const convertProductField = (key, value, defaults = {}) => {
  if (key === 'quantity') {
    if (value === '' || value === null || value === undefined) {
      return defaults.quantity || 10;
    }
    return parseInt(value, 10);
  }

  if (key === 'weight') {
    if (value === '' || value === null || value === undefined) {
      return defaults.weight || 500;
    }
    return parseFloat(value);
  }

  if (key === 'price') {
    return value !== '' ? parseFloat(value) : '';
  }

  if (key === 'category_id') {
    return value !== '' ? parseInt(value, 10) : '';
  }

  if (key === 'status') {
    return parseInt(value, 10);
  }

  return value;
};

/**
 * Build product payload for API
 */
export const buildProductPayload = (product, includeImage = true, defaults = {}) => {
  const payload = {};
  const skipKeys = ['image'];

  Object.keys(product).forEach(key => {
    if (skipKeys.includes(key)) return;

    if (key === 'image' && product[key] && includeImage) {
      payload[key] = product[key];
      return;
    }

    // Keep color field for variant products
    if (key === 'color') {
      if (product[key] !== '' && product[key] !== null && product[key] !== undefined) {
        payload[key] = product[key];
      }
      return;
    }

    const value = convertProductField(key, product[key], defaults);

    if (value !== undefined && value !== '') {
      payload[key] = value;
    }
  });

  return payload;
};

/**
 * Build variant payload for API
 */
export const buildVariantPayload = (product) => {
  return {
    value: product.color,
    quantity: parseInt(product.quantity, 10),
    price: parseFloat(product.price),
  };
};

/**
 * Prepare form data for multipart request
 */
export const prepareFormData = (product, defaults = {}) => {
  const formData = new FormData();
  const skipKeys = ['image'];

  Object.keys(product).forEach(key => {
    if (skipKeys.includes(key)) return;

    if (key === 'image' && product[key]) {
      formData.append('image', product[key]);
      return;
    }

    // Keep color field for variant products
    if (key === 'color') {
      if (product[key] !== '' && product[key] !== null && product[key] !== undefined) {
        formData.append(key, product[key]);
      }
      return;
    }

    const value = convertProductField(key, product[key], defaults);

    if (value !== undefined && value !== '') {
      formData.append(key, value);
    }
  });

  return formData;
};

/**
 * Format image to base64 if it's a file
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
