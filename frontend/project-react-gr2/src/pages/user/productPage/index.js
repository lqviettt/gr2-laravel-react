import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./style.scss";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get("category_id");

  useEffect(() => {
    const fetchProducts = async () => {
      if (categoryId) {
        try {
          const response = await fetch(
            `http://127.0.0.1:9000/api/product?category_id=${categoryId}`
          );
          const data = await response.json();
          if (data && Array.isArray(data.data)) {
            setProducts(data.data);
          } else {
            console.log("No products found for this category.");
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      } else {
        console.log("No category_id found in URL");
      }
    };

    fetchProducts();
  }, [categoryId]);

  return (
    <div className="featured-products">
      <h2>Sản phẩm thuộc danh mục {categoryId}</h2>
      <div className="product-list">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div>
              <a
                href={`/product?category_id=${product.id}`}
                className="product-item"
                key={product.id}
              >
                <p>Name: {product.name}</p>
                <p>Code: {product.code}</p>
                <p>Mo ta: {product.description}</p>
                <p>Gia: {product.price}</p>
                <p>So Luong: {product.quantity}</p>
                <p>category_id: {product.category_id}</p>
              </a>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm trong danh mục này.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
