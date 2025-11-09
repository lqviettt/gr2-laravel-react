// Utility functions for the application

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const productImages = {
  1: [{ id: 1, src: require("../assets/images/ip12.webp"), alt: "iPhone 12" }],
  6: [{ id: 1, src: require("../assets/images/ip12-pro.webp"), alt: "iPhone 12 Pro" }],
  11: [{ id: 1, src: require("../assets/images/ip12-pro.webp"), alt: "iPhone 12 Pro Max" }],
  2: [{ id: 1, src: require("../assets/images/ip13.webp"), alt: "iPhone 13" }],
  7: [{ id: 1, src: require("../assets/images/ip13-pro.webp"), alt: "iPhone 13 Pro" }],
  12: [{ id: 1, src: require("../assets/images/ip13-pro.webp"), alt: "iPhone 13 Pro Max" }],
  3: [{ id: 1, src: require("../assets/images/ip14.webp"), alt: "iPhone 14" }],
  8: [{ id: 1, src: require("../assets/images/ip14-pro.webp"), alt: "iPhone 14 Pro" }],
  13: [{ id: 1, src: require("../assets/images/ip14-pro.webp"), alt: "iPhone 14 Pro Max" }],
  4: [{ id: 1, src: require("../assets/images/ip15.webp"), alt: "iPhone 15" }],
  9: [{ id: 1, src: require("../assets/images/ip15-pro.webp"), alt: "iPhone 15 Pro" }],
  14: [{ id: 1, src: require("../assets/images/ip15-pro.webp"), alt: "iPhone 15 Pro Max" }],
  5: [{ id: 1, src: require("../assets/images/ip16.webp"), alt: "iPhone 16" }],
  10: [{ id: 1, src: require("../assets/images/ip16-pro.webp"), alt: "iPhone 16 Pro" }],
  15: [{ id: 1, src: require("../assets/images/ip16-pro.webp"), alt: "iPhone 16 Pro Max" }],
};

export const getProductImage = (categoryId) => {
  return productImages[categoryId] || [];
};