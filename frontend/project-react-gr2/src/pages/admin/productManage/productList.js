import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    price: "",
    quantity: "",
    status: "",
    weight: "",
    category_id: "",
    description: "",
  });

  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:9000/api/product");
        setProducts(response.data.data.data);
        // console.log("Products:", response.data.data.data);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error.response?.data || error.message
        );
      }
    };

    fetchProducts();
  }, []);

  //   useEffect(() => {
  //     console.log("Products after fetch:", products);
  //   }, [products]);

  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setNewProduct(productToEdit);
    setEditingProductId(productId);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:9000/api/product/${editingProductId}`,
        newProduct
      );
      setProducts(
        products.map((product) =>
          product.id === editingProductId ? response.data.data.data : product
        )
      );
      setEditingProductId(null);
      alert("Product saved successfully!");
      window.location.reload();
    } catch (error) {
      console.error(
        "Error saving product:",
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this product?")) {
        return;
      }
      await axios.delete(`http://127.0.0.1:9000/api/product/${productId}`);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  return (
    <div className="container p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <table className="bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">STT</th>
            <th className="py-2 px-8 border-b">Mã sản phẩm</th>
            <th className="py-2 px-4 border-b">Tên sản phẩm</th>
            <th className="py-2 px-4 border-b">Giá bán</th>
            <th className="py-2 px-4 border-b">Trạng thái</th>
            <th className="py-2 px-4 border-b">Số lượng</th>
            <th className="py-2 px-4 border-b">Trọng lượng</th>
            <th className="py-2 px-4 border-b">Tùy biến</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) &&
            products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">
                  {products.indexOf(product) + 1}
                </td>
                <td className="py-2 px-4 border-b">{product.code}</td>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">{product.price}</td>
                <td className="py-2 px-4 border-b">{product.status}</td>
                <td className="py-2 px-4 border-b">{product.quantity}</td>
                <td className="py-2 px-4 border-b">{product.weight}</td>
                <td className="py-2 px-4 pb-4 border-b flex justify-center items-center">
                  <button
                    onClick={() => handleEditProduct(product.id)}
                    className="px-2 py-2 bg-yellow-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-2 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Product
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>

            <form className="p-4 md:p-5" onSubmit={handleSaveProduct}>
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2">
                  <label
                    for="name"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type product name"
                    required=""
                  />
                </div>
                <div class="col-span-2">
                  <label
                    for="price"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Code
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.code}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Tên sản phẩm"
                    required=""
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="price"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Giá
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Giá sản phẩm"
                    required=""
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="price"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Số lượng
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Quantity"
                    required=""
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="price"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Status
                  </label>
                  <input
                    type="text"
                    name="status"
                    value={newProduct.status}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Status"
                    required=""
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="price"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Trọng lượng
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={newProduct.weight}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Type product weight"
                    required=""
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
