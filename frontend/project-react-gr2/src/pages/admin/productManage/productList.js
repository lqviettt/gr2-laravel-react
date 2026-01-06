import React, { useEffect, useState, memo, useCallback } from "react";
import { toast } from "react-toastify";
import { api } from "../../../utils/apiClient";
import CommonTable from "../../../components/CommonTable";
import ConfirmDialog from "../../../components/ConfirmDialog";
import SearchInput from "../../../components/SearchInput";
import Pagination from "../../../components/Pagination";
import ProductFormModal from "../../../components/ProductFormModal";
import { FaPlus, FaBox, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useFetchData } from "../../../hooks/useFetchData";
import { useProduct, generateProductCode } from "../../../hooks/useProduct";
import { useProductAPI } from "../../../hooks/useProductAPI";

const ProductList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [variantOptions, setVariantOptions] = useState([]);
  const [searchFilters, setSearchFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hasVariant, setHasVariant] = useState(false);
  const ITEMS_PER_PAGE = 10; // Number of variant rows per page
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    productId: null,
    title: '',
    message: ''
  });

  const {
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
  } = useProduct();

  const { createProduct, updateProduct, deleteProduct, deleteVariant, fetchProductDetails } = useProductAPI();

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
  // Pass page 1 always to backend to get all products, pagination is handled by frontend
  const { data: allVariants, loading: dataLoading, error, refetch } = useFetchData(
    '/product',
    searchFilters,
    1, // Always fetch first page which will contain many items
    {
      transformData: transformProductData
    }
  );

  // Frontend pagination logic based on variant count
  const itemsPerPage = ITEMS_PER_PAGE;
  const totalPages = Math.ceil((allVariants?.length || 0) / itemsPerPage);
  const variants = allVariants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const pagination = {
    last_page: totalPages,
    current_page: currentPage,
    total: allVariants?.length || 0
  };

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
      const response = await api.get('/categories-child');
      setCategories(response.data.data?.data || response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchVariantOptions = async () => {
    try {
      const response = await api.get('/variant?type=color&perPage=100');
      // Handle different response structures
      let data = [];
      if (Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (response.data.data?.data && Array.isArray(response.data.data.data)) {
        data = response.data.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      setVariantOptions(data);
    } catch (error) {
      console.error("Error fetching variant options:", error);
      setVariantOptions([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchVariantOptions();
  }, []);

  const handleEditProduct = (variantId) => {
    const variantToEdit = allVariants.find((variant) => variant.id === variantId);

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
      handleEditProductDetails(variantToEdit.product_id);
    } else {
      handleEditProductDetails(variantId);
    }
  };

  const handleEditProductDetails = async (productId) => {
    try {
      const product = await fetchProductDetails(productId);

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
      setIsModalOpen(true);
      setImagePreview(null);
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Không thể tải thông tin sản phẩm: " + (error.response?.data?.message || error.message));
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const defaults = { quantity: FIXED_QUANTITY, weight: FIXED_WEIGHT };

      if (editingProductId) {
        if (editingVariant) {
          const variant = allVariants.find(v => v.id === editingProductId);
          const productId = variant.product_id;

          await updateProduct(productId, { ...newProduct, variant_id: editingProductId.replace('variant_', '') }, true, defaults);
          
          toast.success("Cập nhật thành công!");
        } else {
          await updateProduct(editingProductId, newProduct, false, defaults);
          toast.success("Cập nhật sản phẩm thành công!");
        }
      } else {
        // When creating new product with variant, pass hasVariant flag
        await createProduct(newProduct, defaults, hasVariant);
        toast.success("Tạo sản phẩm mới thành công!");
      }

      await refetch(true);
      setCurrentPage(1); // Reset to first page after save
      setHasVariant(false);
      resetProductWithoutCode();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Có lỗi xảy ra khi lưu sản phẩm: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteProduct = async (variantId) => {
    const variant = allVariants.find(v => v.id === variantId);
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
      const variant = allVariants.find(v => v.id === variantId);

      if (variant.is_variant) {
        await deleteVariant(variant.variant_id);
        toast.success("Xóa variant thành công!");
      } else {
        await deleteProduct(variant.product_id);
        toast.success("Xóa sản phẩm thành công!");
      }

      await refetch(true);
      setCurrentPage(1); // Reset to first page after delete
      
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
          <button
            onClick={() => {
              setEditingProductId(null);
              setHasVariant(false);
              setIsModalOpen(true);
            }}
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <FaPlus className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </button>
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
                      <p className="text-2xl font-bold text-gray-900">{Array.isArray(allVariants) ? allVariants.length : 0}</p>
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
                        {Array.isArray(allVariants) ? allVariants.filter(v => v.status == 1).length : 0}
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
                        {Array.isArray(allVariants) ? allVariants.filter(v => v.status == 0).length : 0}
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
        <ProductFormModal
          isOpen={isModalOpen}
          isEditing={!!editingProductId}
          product={newProduct}
          categories={categories}
          imagePreview={imagePreview}
          onProductChange={(name, value) => {
            setNewProduct({ ...newProduct, [name]: value });
          }}
          onImageChange={handleImageChange}
          onSubmit={handleSaveProduct}
          onClose={() => {
            setIsModalOpen(false);
            setHasVariant(false);
            resetProduct();
          }}
          isVariant={editingVariant}
          fixedQuantity={FIXED_QUANTITY}
          fixedWeight={FIXED_WEIGHT}
          hasVariant={hasVariant}
          onVariantToggle={setHasVariant}
          variantOptions={variantOptions}
        />

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
