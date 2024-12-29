import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./style.scss";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");

  useEffect(() => {
    const fetchProducts = async () => {
      if (search) {
        try {
          const response = await fetch(
            `http://127.0.0.1:9000/api/product?search=${search}&perPage=15`
          );
          const result = await response.json();
          if (result && Array.isArray(result.data.data)) {
            setProducts(result.data.data);
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
  }, [search]);

  return (
    <div className="featured-products">
      <h2>Sản phẩm thuộc danh mục {search}</h2>
      <div className="product-list">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div>
              <a
                href={`/product-detail/${product.id}`}
                className="product-item"
                key={product.id}
              >
                <p>Name: {product.name}</p>
                <p>Gia: {product.price}</p>
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

export default memo(ProductsPage);
