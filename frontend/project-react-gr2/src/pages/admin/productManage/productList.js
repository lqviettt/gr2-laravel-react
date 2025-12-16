import React, { useEffect, useState, memo } from "react";
import { api } from "../../../utils/apiClient";
import { toast } from "react-toastify";
import CommonTable from "../../../components/CommonTable";
import ConfirmDialog from "../../../components/ConfirmDialog";
import SearchInput from "../../../components/SearchInput";
import Pagination from "../../../components/Pagination";
import { FaPlus, FaBox, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ProductList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchFilters, setSearchFilters] = useState({});
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
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

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

  const fetchProducts = async (filters = {}, page = currentPage) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      // Default status='all' for admin to show all
      const effectiveFilters = { ...filters };
      Object.entries(effectiveFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      queryParams.append('page', page);

      const response = await api.get(`/product${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);

      const products = response.data.data.data || [];
      const paginationData = response.data.data;
      setPagination(paginationData);
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

      setVariants(transformedVariants);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Không thể tải danh sách sản phẩm");
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/category');
      setCategories(response.data.data?.data || response.data.data || []);
      console.log("Fetched categories:", response.data.data?.data || response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts(searchFilters, currentPage);
  }, [searchFilters, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditProduct = (variantId) => {
    if (loadingEdit) return;

    console.log('Editing variantId:', variantId);
    const variantToEdit = variants.find((variant) => variant.id === variantId);
    console.log('variantToEdit:', variantToEdit);

    if (variantToEdit && variantToEdit.is_variant) {
      console.log('Editing variant:', variantToEdit.variant_id);
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
      console.log('Editing product without variants:', variantToEdit.product_id);
      setLoadingEdit(true);
      fetchProductDetails(variantToEdit.product_id);
    } else {
      console.log('variantId not found in variants, assuming product ID:', variantId);
      setLoadingEdit(true);
      fetchProductDetails(variantId);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      console.log('Fetching product details for ID:', productId);
      const response = await api.get(`/product/${productId}`);
      const product = response.data.data;
      console.log('Fetched product:', product);

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
      console.log('Set editing product ID to:', productId);
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

              // Cập nhật thông tin product (không bao gồm ảnh)
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

              console.log('Updating product for variant edit:', productData);

              await api.put(`/product/${productId}`, productData);

              // Cập nhật ảnh vào variant
              const variantData = {
                value: newProduct.color,
                quantity: parseInt(newProduct.quantity, 10),
                price: parseFloat(newProduct.price),
                image: base64Image, // Ảnh được cập nhật vào variant
              };

              console.log('Updating variant with image:', variantData);

              await api.put(`/product-variant/${editingProductId.replace('variant_', '')}`, variantData);
              await fetchProducts();
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
              setEditingVariant(false);
            };
            reader.readAsDataURL(newProduct.image);
            return;
          } else {
            const variant = variants.find(v => v.id === editingProductId);
            if (!variant) {
              toast.error("Không tìm thấy variant để cập nhật");
              return;
            }
            const productId = variant.product_id;

            const productData = {
              code: newProduct.code,
              name: newProduct.name,
              price: parseFloat(newProduct.price),
              quantity: parseInt(newProduct.quantity, 10),
              status: parseInt(newProduct.status, 10),
              category_id: parseInt(newProduct.category_id, 10),
              description: newProduct.description,
            };

            if (newProduct.weight !== '') {
              productData.weight = parseFloat(newProduct.weight);
            }

            console.log('Updating product for variant edit:', productData);

            await api.put(`/product/${productId}`, productData);

            const variantData = {
              value: newProduct.color,
              quantity: parseInt(newProduct.quantity, 10),
              price: parseFloat(newProduct.price),
            };

            console.log('Updating variant without image change:', variantData);

            await api.put(`/product-variant/${editingProductId.replace('variant_', '')}`, variantData);
            await fetchProducts();
            toast.success("Cập nhật thành công!");
          }
        } else {
          if (newProduct.image && newProduct.image instanceof File) {
            const reader = new FileReader();
            reader.onload = async (e) => {
              const base64Image = e.target.result;

              const productData = {
                code: newProduct.code,
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                quantity: parseInt(newProduct.quantity, 10),
                status: parseInt(newProduct.status, 10),
                weight: parseFloat(newProduct.weight),
                category_id: parseInt(newProduct.category_id, 10),
                description: newProduct.description,
                image: base64Image,
              };
              console.log('Updating product with base64 image:', productData);

              try {
                await api.put(`/product/${editingProductId}`, productData);
                await fetchProducts();
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
                setEditingVariant(false);
              } catch (error) {
                console.error("Error updating product:", error.response?.data || error.message);
                const resp = error.response?.data;
                let errMsg = "Có lỗi xảy ra khi lưu sản phẩm: ";

                if (resp) {
                  if (resp.message) {
                    errMsg += resp.message;
                  } else if (typeof resp.error === "string") {
                    errMsg += resp.error;
                  } else if (resp.error && typeof resp.error === "object") {
                    const flattened = [].concat(...Object.values(resp.error)).join(", ");
                    errMsg += flattened || JSON.stringify(resp.error);
                  } else if (resp.errors && typeof resp.errors === "object") {
                    const flattened = [].concat(...Object.values(resp.errors)).join(", ");
                    errMsg += flattened;
                  } else {
                    errMsg += JSON.stringify(resp);
                  }
                } else {
                  errMsg += error.message || JSON.stringify(error);
                }

                toast.error(errMsg);
              }
            };
            reader.readAsDataURL(newProduct.image);
            return;
          } else {
            const productData = {
              code: newProduct.code,
              name: newProduct.name,
              price: parseFloat(newProduct.price),
              quantity: parseInt(newProduct.quantity, 10),
              status: parseInt(newProduct.status, 10),
              category_id: parseInt(newProduct.category_id, 10),
              description: newProduct.description,
            };

            if (newProduct.weight !== '') {
              productData.weight = parseFloat(newProduct.weight);
            }

            console.log('Updating product without image change:', productData);

            await api.put(`/product/${editingProductId}`, productData);
            await fetchProducts();
            toast.success("Cập nhật sản phẩm thành công!");
          }
        }
      } else {
        if (newProduct.image && newProduct.image instanceof File) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const base64Image = e.target.result;

            const productData = {
              code: newProduct.code,
              name: newProduct.name,
              price: parseFloat(newProduct.price),
              quantity: parseInt(newProduct.quantity, 10),
              status: parseInt(newProduct.status, 10),
              category_id: parseInt(newProduct.category_id, 10),
              description: newProduct.description,
              image: base64Image,
              color: newProduct.color,
            };

            if (newProduct.weight !== '') {
              productData.weight = parseFloat(newProduct.weight);
            }

            console.log('Creating product with image:', productData);

            try {
              await api.post('/product', productData);
              await fetchProducts();
              toast.success("Thêm sản phẩm thành công!");
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
              setEditingVariant(false);
            } catch (error) {
              console.error("Error creating product:", error.response?.data || error.message);
              const resp = error.response?.data;
              let errMsg = "Có lỗi xảy ra khi lưu sản phẩm: ";

              if (resp) {
                if (resp.message) {
                  errMsg += resp.message;
                } else if (typeof resp.error === "string") {
                  errMsg += resp.error;
                } else if (resp.error && typeof resp.error === "object") {
                  const flattened = [].concat(...Object.values(resp.error)).join(", ");
                  errMsg += flattened || JSON.stringify(resp.error);
                } else if (resp.errors && typeof resp.errors === "object") {
                  const flattened = [].concat(...Object.values(resp.errors)).join(", ");
                  errMsg += flattened;
                } else {
                  errMsg += JSON.stringify(resp);
                }
              } else {
                errMsg += error.message || JSON.stringify(error);
              }

              toast.error(errMsg);
            }
          };
          reader.readAsDataURL(newProduct.image);
          return;
        } else {
            const productData = {
              code: newProduct.code,
              name: newProduct.name,
              price: parseFloat(newProduct.price),
              quantity: parseInt(newProduct.quantity, 10),
              status: parseInt(newProduct.status, 10),
              category_id: parseInt(newProduct.category_id, 10),
              description: newProduct.description,
              color: newProduct.color,
            };

            if (newProduct.weight !== '') {
              productData.weight = parseFloat(newProduct.weight);
            }          console.log('Creating product without image:', productData);

          await api.post('/product', productData);
          await fetchProducts();
          toast.success("Thêm sản phẩm thành công!");
        }
      }
      setIsModalOpen(false);
      setNewProduct({
        code: "",
        name: "",
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
      setEditingVariant(false);
    } catch (error) {
      console.error(
        "Error saving product:",
        error.response?.data || error.message
      );
      const resp = error.response?.data;
      let errMsg = "Có lỗi xảy ra khi lưu sản phẩm: ";

      if (resp) {
        if (resp.message) {
          errMsg += resp.message;
        } else if (typeof resp.error === "string") {
          errMsg += resp.error;
        } else if (resp.error && typeof resp.error === "object") {
          const flattened = [].concat(...Object.values(resp.error)).join(", ");
          errMsg += flattened || JSON.stringify(resp.error);
        } else if (resp.errors && typeof resp.errors === "object") {
          const flattened = [].concat(...Object.values(resp.errors)).join(", ");
          errMsg += flattened;
        } else {
          errMsg += JSON.stringify(resp);
        }
      } else {
        errMsg += error.message || JSON.stringify(error);
      }

      toast.error(errMsg);
    }
  };

  const handleDeleteProduct = (variantId) => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) {
      toast.error("Không tìm thấy variant để xóa");
      return;
    }
    const productId = variant.product_id;
    const product = variants.find(v => v.id === variantId);
    setConfirmDialog({
      isOpen: true,
      productId: productId,
      title: 'Xác nhận xóa sản phẩm',
      message: `Bạn có chắc chắn muốn xóa sản phẩm "${product?.name || 'này'}"? Hành động này không thể hoàn tác.`
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/product/${confirmDialog.productId}`);
      if (Array.isArray(variants)) {
        await fetchProducts();
      }
      toast.success("Xóa sản phẩm thành công!");
      setConfirmDialog({ isOpen: false, productId: null, title: '', message: '' });
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
      const resp = error.response?.data;
      let errMsg = "Có lỗi xảy ra khi lưu sản phẩm: ";

      if (resp) {
        if (resp.message) {
          errMsg += resp.message;
        } else if (typeof resp.error === "string") {
          errMsg += resp.error;
        } else if (resp.error && typeof resp.error === "object") {
          const flattened = [].concat(...Object.values(resp.error)).join(", ");
          errMsg += flattened || JSON.stringify(resp.error);
        } else if (resp.errors && typeof resp.errors === "object") {
          const flattened = [].concat(...Object.values(resp.errors)).join(", ");
          errMsg += flattened;
        } else {
          errMsg += JSON.stringify(resp);
        }
      } else {
        errMsg += error.message || JSON.stringify(error);
      }

      toast.error(errMsg);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, productId: null, title: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files && files[0]) {
      const file = files[0];
      setNewProduct({ ...newProduct, [name]: file });

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý sản phẩm</h1>
            <p className="text-gray-600">Quản lý các sản phẩm của cửa hàng</p>
          </div>
          <button
            onClick={() => {
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
              setEditingVariant(false);
              setIsModalOpen(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <SearchInput
            searchFields={[
              {
                key: 'search',
                label: 'Tên sản phẩm',
                type: 'text',
                placeholder: 'Nhập tên sản phẩm...'
              },
              {
                key: 'category_id',
                label: 'Danh mục',
                type: 'select',
                options: categories.map(cat => ({ value: cat.id, label: cat.name })),
                placeholder: 'Chọn danh mục...'
              },
              {
                key: 'status',
                label: 'Trạng thái',
                type: 'select',
                placeholder: 'Chọn trạng thái...',
                options: [
                  { value: '1', label: 'Đang hoạt động' },
                  { value: '0', label: 'Không hoạt động' }
                ]
              },
            ]}
            onSearch={(filters) => {
              const updatedFilters = { ...filters };
              if (!updatedFilters.status) {
                updatedFilters.status = 'all';
              }
              setCurrentPage(1);
              setSearchFilters(updatedFilters);
            }}
            size="medium"
            useSearchButton={true}
            showClearButton={false}
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
                    onClick={fetchProducts}
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tải...</span>
          </div>
        ) : (
          <>
            {/* Stats */}
            {!loading && !error && (
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
                        {Array.isArray(variants) ? variants.filter(variant => variant.status === '1').length : 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                      <FaTimesCircle className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Không hoạt động</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(variants) ? variants.filter(variant => variant.status !== '1').length : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <CommonTable
                fields={fields}
                items={variants}
                showIndex={true}
                indexByOrder={true}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                listTitle={listTitle}
              />
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

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg sm:max-w-2xl w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingProductId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h3>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setImagePreview(null);
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
                      <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Tên sản phẩm
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newProduct.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập tên sản phẩm"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                          Màu sắc {editingVariant ? '(bắt buộc cho biến thể)' : '(không áp dụng cho sản phẩm)'}
                        </label>
                        <input
                          type="text"
                          name="color"
                          value={newProduct.color}
                          onChange={handleInputChange}
                          disabled={!editingVariant}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!editingVariant ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                          placeholder={editingVariant ? "Nhập màu sắc (ví dụ: Đỏ, Xanh, Vàng)" : "Không áp dụng cho sản phẩm"}
                          required={editingVariant}
                        />
                      </div>

                      <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                          Mã sản phẩm
                        </label>
                        <input
                          type="text"
                          name="code"
                          value={newProduct.code}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập mã sản phẩm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                          Giá bán
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={newProduct.price}
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập số lượng"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                          Trọng lượng (kg)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="weight"
                          value={newProduct.weight}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập trọng lượng"
                        />
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                          Trạng thái
                        </label>
                        <select
                          name="status"
                          value={newProduct.status}
                          onChange={handleInputChange}
                          className="w-full px-2 py-2 text-sm sm:px-3 sm:py-2 sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="1">Đang hoạt động</option>
                          <option value="0">Không hoạt động</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                          Danh mục
                        </label>
                        <select
                          name="category_id"
                          value={newProduct.category_id}
                          onChange={handleInputChange}
                          className="w-full px-2 py-2 text-sm sm:px-3 sm:py-2 sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{
                            maxHeight: '120px',
                            overflowY: 'auto'
                          }}
                          required
                        >
                          <option value="">Chọn danh mục</option>
                          {Array.isArray(categories) && categories.map((category, index) => {
                            return (
                              <option key={category?.id || index} value={category?.id || ''}>
                                {category?.name || 'No name'}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Mô tả
                        </label>
                        <textarea
                          name="description"
                          value={newProduct.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập mô tả sản phẩm"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                          Hình ảnh sản phẩm
                        </label>
                        <div className="space-y-2">
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {imagePreview && (
                            <div className="mt-2">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-md border border-gray-300"
                              />
                            </div>
                          )}
                          {editingProductId && newProduct.image && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">Ảnh hiện tại:</p>
                              <img
                                src={newProduct.image}
                                alt="Current"
                                className="w-32 h-32 object-cover rounded-md border border-gray-300"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
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
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default memo(ProductList);
