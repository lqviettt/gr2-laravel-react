import React, { useEffect, useState, memo, useCallback } from "react";
import { api } from "../../../utils/apiClient";
import { toast } from "react-toastify";
import CommonTable from "../../../components/CommonTable";
import ConfirmDialog from "../../../components/ConfirmDialog";
import SearchInput from "../../../components/SearchInput";
import Pagination from "../../../components/Pagination";
import { FaPlus, FaBox, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useFetchData } from "../../../hooks/useFetchData";

const ProductList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchFilters, setSearchFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    color: "",
    price: "",
    quantity: "",
    status: "1",
    weight: "",
    category_id: "",
    description: "",
    image: null,
  });

  const [editingProductId, setEditingProductId] = useState(null);
  const [editingVariant, setEditingVariant] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    productId: null,
    title: '',
    message: ''
  });

  const transformProductData = useCallback((products) => {
    const transformedVariants = [];
    products.forEach(product => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          transformedVariants.push({
            id: `variant_${variant.id}`,
            code: product.code,
            name: product.name,
            color: variant.value || 'N/A',
            price: variant.price || product.price,
            quantity: variant.quantity || product.quantity,
            image: variant.image ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${variant.image}` :
              product.image ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${product.image}` : null,
            status: product.status,
            weight: product.weight,
            category_id: product.category_id,
            product_id: product.id,
            variant_id: variant.id,
            description: product.description,
            is_variant: true
          });
        });
      } else {
        transformedVariants.push({
          id: `product_${product.id}`,
          code: product.code,
          name: product.name,
          color: '',
          price: product.price,
          quantity: product.quantity,
          image: product.image ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${product.image}` : null,
          status: product.status,
          weight: product.weight,
          category_id: product.category_id,
          product_id: product.id,
          variant_id: null,
          is_variant: false
        });
      }
    });
    return transformedVariants;
  }, []);

  // Custom hook for data fetching with variant transformation
  const { data: variants, loading: dataLoading, error, pagination, refetch } = useFetchData(
    '/product',
    searchFilters,
    currentPage,
    {
      transformData: transformProductData
    }
  );

  const fields = {
    code: 'code',
    name: 'name',
    color: 'color',
    price: 'price',
    status: 'status',
    quantity: 'quantity',
    weight: 'weight',
    image: 'pattern.image',
    actions: 'pattern.modified',
  };

  const listTitle = {
    code: 'Mã sản phẩm',
    name: 'Tên sản phẩm',
    color: 'Màu sắc',
    price: 'Giá bán',
    status: 'Trạng thái',
    quantity: 'Số lượng',
    weight: 'Trọng lượng',
    image: 'Hình ảnh',
    actions: 'Tùy biến',
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/category');
      setCategories(response.data.data?.data || response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditProduct = (variantId) => {
    if (loadingEdit) return;

    const variantToEdit = variants.find((variant) => variant.id === variantId);

    if (variantToEdit && variantToEdit.is_variant) {
      setNewProduct({
        code: variantToEdit.code || "",
        name: variantToEdit.name || "",
        color: variantToEdit.color || "",
        price: variantToEdit.price || "",
        quantity: variantToEdit.quantity || "",
        status: variantToEdit.status?.toString() || "1",
        weight: variantToEdit.weight || "",
        category_id: variantToEdit.category_id || "",
        description: variantToEdit.description || "",
        image: variantToEdit.image || null,
      });
      setEditingProductId(variantId);
      setEditingVariant(true);
      setIsModalOpen(true);
      setImagePreview(null);
    } else if (variantToEdit && !variantToEdit.is_variant) {
      setLoadingEdit(true);
      fetchProductDetails(variantToEdit.product_id);
    } else {
      setLoadingEdit(true);
      fetchProductDetails(variantId);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await api.get(`/product/${productId}`);
      const product = response.data.data;

      setNewProduct({
        code: product.code || "",
        name: product.name || "",
        color: "",
        price: product.price || "",
        quantity: product.quantity || "",
        status: product.status?.toString() || "1",
        weight: product.weight || "",
        category_id: product.category_id || "",
        description: product.description || "",
        image: product.image ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${product.image}` : null,
      });
      setEditingProductId(productId);
      setEditingVariant(false);
      setIsModalOpen(true);
      setImagePreview(null);
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Không thể tải thông tin sản phẩm: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      Object.keys(newProduct).forEach(key => {
        if (key === 'image' && newProduct[key]) {
          formData.append('image', newProduct[key]);
        } else if (key !== 'image' && key !== 'color') {
          let value = newProduct[key];

          if (key === 'category_id' && value !== '') {
            value = parseInt(value, 10);
          } else if (key === 'price' && value !== '') {
            value = parseFloat(value);
          } else if (key === 'quantity' && value !== '') {
            value = parseInt(value, 10);
          } else if (key === 'weight' && value !== '') {
            value = parseFloat(value);
          } else if (key === 'status') {
            value = parseInt(value, 10);
          }

          if (value !== undefined) {
            formData.append(key, value);
          }
        }
      });

      if (editingProductId) {
        if (editingVariant) {
          if (newProduct.image && newProduct.image instanceof File) {
            const reader = new FileReader();
            reader.onload = async (e) => {
              const base64Image = e.target.result;

              const variant = variants.find(v => v.id === editingProductId);
              const productId = variant.product_id;

              const productData = {
                code: newProduct.code,
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                quantity: parseInt(newProduct.quantity, 10),
                status: parseInt(newProduct.status, 10),
                weight: parseFloat(newProduct.weight),
                category_id: parseInt(newProduct.category_id, 10),
                description: newProduct.description,
              };

              await api.put(`/product/${productId}`, productData);

              const variantData = {
                value: newProduct.color,
                quantity: parseInt(newProduct.quantity, 10),
                price: parseFloat(newProduct.price),
                image: base64Image,
              };

              await api.put(`/product-variant/${editingProductId.replace('variant_', '')}`, variantData);
              
              await refetch(true);
              
              toast.success("Cập nhật thành công!");
              setIsModalOpen(false);
              setNewProduct({
                code: "",
                name: "",
                color: "",
                price: "",
                quantity: "",
                status: "1",
                weight: "",
                category_id: "",
                description: "",
                image: null,
              });
              setImagePreview(null);
              setEditingProductId(null);
            };
            reader.readAsDataURL(newProduct.image);
          } else {
            const variant = variants.find(v => v.id === editingProductId);
            const productId = variant.product_id;

            const productData = {
              code: newProduct.code,
              name: newProduct.name,
              price: parseFloat(newProduct.price),
              quantity: parseInt(newProduct.quantity, 10),
              status: parseInt(newProduct.status, 10),
              weight: parseFloat(newProduct.weight),
              category_id: parseInt(newProduct.category_id, 10),
              description: newProduct.description,
            };

            await api.put(`/product/${productId}`, productData);

            const variantData = {
              value: newProduct.color,
              quantity: parseInt(newProduct.quantity, 10),
              price: parseFloat(newProduct.price),
            };

            await api.put(`/product-variant/${editingProductId.replace('variant_', '')}`, variantData);
            
            // Refetch data after update with skipCache
            await refetch(true);
            
            toast.success("Cập nhật thành công!");
            setIsModalOpen(false);
            setNewProduct({
              code: "",
              name: "",
              color: "",
              price: "",
              quantity: "",
              status: "1",
              weight: "",
              category_id: "",
              description: "",
              image: null,
            });
            setImagePreview(null);
            setEditingProductId(null);
          }
        } else {
          if (newProduct.image && newProduct.image instanceof File) {
            const reader = new FileReader();
            reader.onload = async (e) => {
              const base64Image = e.target.result;
              formData.set('image', base64Image);

              await api.put(`/product/${editingProductId}`, {
                code: newProduct.code,
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                quantity: parseInt(newProduct.quantity, 10),
                status: parseInt(newProduct.status, 10),
                weight: parseFloat(newProduct.weight),
                category_id: parseInt(newProduct.category_id, 10),
                description: newProduct.description,
                image: base64Image,
              });
              
              await refetch(true);
              
              toast.success("Cập nhật sản phẩm thành công!");
              setIsModalOpen(false);
              setNewProduct({
                code: "",
                name: "",
                color: "",
                price: "",
                quantity: "",
                status: "1",
                weight: "",
                category_id: "",
                description: "",
                image: null,
              });
              setImagePreview(null);
              setEditingProductId(null);
            };
            reader.readAsDataURL(newProduct.image);
          } else {
            await api.put(`/product/${editingProductId}`, {
              code: newProduct.code,
              name: newProduct.name,
              price: parseFloat(newProduct.price),
              quantity: parseInt(newProduct.quantity, 10),
              status: parseInt(newProduct.status, 10),
              weight: parseFloat(newProduct.weight),
              category_id: parseInt(newProduct.category_id, 10),
              description: newProduct.description,
            });
            
            await refetch(true);
            
            toast.success("Cập nhật sản phẩm thành công!");
            setIsModalOpen(false);
            setNewProduct({
              code: "",
              name: "",
              color: "",
              price: "",
              quantity: "",
              status: "1",
              weight: "",
              category_id: "",
              description: "",
              image: null,
            });
            setImagePreview(null);
            setEditingProductId(null);
          }
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Có lỗi xảy ra khi lưu sản phẩm: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteProduct = async (variantId) => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return;

    setConfirmDialog({
      isOpen: true,
      productId: variantId,
      title: 'Xác nhận xóa',
      message: variant.is_variant ? 'Bạn có chắc chắn muốn xóa variant này?' : 'Bạn có chắc chắn muốn xóa sản phẩm này?'
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const variantId = confirmDialog.productId;
      const variant = variants.find(v => v.id === variantId);

      if (variant.is_variant) {
        await api.delete(`/product-variant/${variant.variant_id}`);
        toast.success("Xóa variant thành công!");
      } else {
        await api.delete(`/product/${variant.product_id}`);
        toast.success("Xóa sản phẩm thành công!");
      }

      await refetch(true);
      
      setConfirmDialog({ isOpen: false, productId: null, title: '', message: '' });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Không thể xóa sản phẩm: " + (error.response?.data?.message || error.message));
      setConfirmDialog({ isOpen: false, productId: null, title: '', message: '' });
    }
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const searchFields = [
    { key: 'code', label: 'Mã sản phẩm', type: 'text', placeholder: 'Nhập mã sản phẩm' },
    { key: 'name', label: 'Tên sản phẩm', type: 'text', placeholder: 'Nhập tên sản phẩm' },
    { key: 'category_id', label: 'Danh mục', type: 'select', placeholder: 'Tất cả', options: categories.map(cat => ({ value: cat.id, label: cat.name })) },
    { key: 'status', label: 'Trạng thái', type: 'select', placeholder: 'Tất cả', options: [
      { value: '0', label: 'Không hoạt động' },
      { value: '1', label: 'Đang hoạt động' }
    ]},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý sản phẩm</h1>
            <p className="text-gray-600">Quản lý các sản phẩm và biến thể của cửa hàng</p>
          </div>
        </div>

        {/* Search Form */}
        <div className="mb-6">
          <SearchInput
            searchFields={searchFields}
            onSearch={handleSearch}
            useSearchButton={true}
            showClearButton={false}
            className="mb-4"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <div className="mt-4">
                  <button
                    onClick={refetch}
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tải...</span>
          </div>
        ) : (
          <>
            {/* Stats */}
            {!dataLoading && !error && (
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <FaBox className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                      <p className="text-2xl font-bold text-gray-900">{Array.isArray(variants) ? variants.length : 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <FaCheckCircle className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(variants) ? variants.filter(v => v.status == 1).length : 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
                      <FaTimesCircle className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Không hoạt động</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(variants) ? variants.filter(v => v.status == 0).length : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="inline-block min-w-full align-middle">
                  <CommonTable
                    fields={fields}
                    items={variants}
                    showIndex={true}
                    indexByOrder={true}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    listTitle={listTitle}
                    hiddenOnMobile={['weight', 'category_id']}
                    columnStyles={{
                      created_at: { minWidth: '120px', whiteSpace: 'nowrap' },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.last_page || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingProductId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h3>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingProductId(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                          Mã sản phẩm
                        </label>
                        <input
                          type="text"
                          name="code"
                          value={newProduct.code}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, code: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập mã sản phẩm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Tên sản phẩm
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập tên sản phẩm"
                          required
                        />
                      </div>

                      {editingVariant && (
                        <div>
                          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                            Màu sắc
                          </label>
                          <input
                            type="text"
                            name="color"
                            value={newProduct.color}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, color: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập màu sắc"
                          />
                        </div>
                      )}

                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                          Giá bán
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, price: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập giá bán"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                          Số lượng
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={newProduct.quantity}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, quantity: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập số lượng"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                          Trọng lượng
                        </label>
                        <input
                          type="number"
                          name="weight"
                          value={newProduct.weight}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, weight: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập trọng lượng"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                          Danh mục
                        </label>
                        <select
                          name="category_id"
                          value={newProduct.category_id}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, category_id: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                          Trạng thái
                        </label>
                        <select
                          name="status"
                          value={newProduct.status}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, status: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="1">Đang hoạt động</option>
                          <option value="0">Không hoạt động</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Mô tả
                        </label>
                        <textarea
                          name="description"
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, description: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập mô tả sản phẩm"
                          rows="4"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                          Hình ảnh
                        </label>
                        <input
                          type="file"
                          name="image"
                          onChange={handleImageChange}
                          accept="image/*"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {(imagePreview || newProduct.image) && (
                          <div className="mt-3">
                            <img
                              src={imagePreview || newProduct.image}
                              alt="Preview"
                              className="h-32 w-32 object-cover rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setEditingProductId(null);
                          setNewProduct({
                            code: "",
                            name: "",
                            color: "",
                            price: "",
                            quantity: "",
                            status: "1",
                            weight: "",
                            category_id: "",
                            description: "",
                            image: null,
                          });
                          setImagePreview(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {editingProductId ? 'Cập nhật' : 'Thêm mới'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Xóa"
          cancelText="Hủy"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDialog({ isOpen: false, productId: null, title: '', message: '' })}
          type="danger"
        />
      </div>
    </div>
  );
};

export default memo(ProductList);
