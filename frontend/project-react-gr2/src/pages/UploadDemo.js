import React from 'react';
import ImageUpload from '../components/ImageUpload';

const UploadDemo = () => {
  const handleUploadSuccess = (data) => {
    console.log('Upload success:', data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Demo Upload Ảnh</h1>

      <div className="space-y-8">
        {/* Single Image Upload */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Upload Ảnh Đơn</h2>
          <ImageUpload
            onUploadSuccess={handleUploadSuccess}
            folder="banners"
            maxSize={2}
            multiple={false}
            buttonText="Chọn ảnh banner"
          />
        </div>

        {/* Multiple Images Upload */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Upload Nhiều Ảnh</h2>
          <ImageUpload
            onUploadSuccess={handleUploadSuccess}
            folder="gallery"
            maxSize={5}
            multiple={true}
            maxImages={10}
            buttonText="Chọn nhiều ảnh"
          />
        </div>

        {/* Product Images */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Upload Ảnh Sản Phẩm</h2>
          <ImageUpload
            onUploadSuccess={handleUploadSuccess}
            folder="products"
            maxSize={3}
            multiple={true}
            maxImages={5}
            buttonText="Chọn ảnh sản phẩm"
          />
        </div>
      </div>
    </div>
  );
};

export default UploadDemo;