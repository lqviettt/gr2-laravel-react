import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUpload, FaTrash } from 'react-icons/fa';

const ImageUpload = ({
  onUploadSuccess,
  folder = 'uploads',
  maxSize = 5, // MB
  acceptedTypes = 'image/*',
  multiple = false,
  className = '',
  buttonText = 'Chọn ảnh',
  showPreview = true,
  maxImages = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;

    // Validate file count
    if (multiple && files.length > maxImages) {
      toast.error(`Chỉ được chọn tối đa ${maxImages} ảnh`);
      return;
    }

    // Validate file types and sizes
    for (let file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} không phải là ảnh`);
        return;
      }
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File ${file.name} quá lớn (tối đa ${maxSize}MB)`);
        return;
      }
    }

    await uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('folder', folder);

      if (multiple) {
        // Upload multiple files
        for (let file of files) {
          formData.append('images[]', file);
        }

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/upload/images`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const newImages = response.data.data.images;
        setUploadedImages(prev => [...prev, ...newImages]);

        if (onUploadSuccess) {
          onUploadSuccess(multiple ? newImages : newImages[0]);
        }

        toast.success(`Đã upload ${newImages.length} ảnh thành công`);
      } else {
        // Upload single file
        formData.append('image', files[0]);

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/upload/image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const newImage = response.data.data;
        setUploadedImages(prev => [...prev, newImage]);

        if (onUploadSuccess) {
          onUploadSuccess(newImage);
        }

        toast.success('Upload ảnh thành công');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imagePath, index) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/upload/image`, {
        data: { path: imagePath }
      });

      setUploadedImages(prev => prev.filter((_, i) => i !== index));
      toast.success('Đã xóa ảnh');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Xóa ảnh thất bại');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileSelect(files);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />

        <div className="space-y-2">
          <p className="text-gray-600">
            Kéo thả ảnh vào đây hoặc{' '}
            <label className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium">
              {buttonText}
              <input
                type="file"
                multiple={multiple}
                accept={acceptedTypes}
                onChange={handleFileInputChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </p>

          <p className="text-sm text-gray-500">
            PNG, JPG, GIF tối đa {maxSize}MB {multiple && `• Tối đa ${maxImages} ảnh`}
          </p>
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Đang upload...</p>
          </div>
        )}
      </div>

      {/* Preview */}
      {showPreview && uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={image.filename}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />

              {/* Delete button */}
              <button
                onClick={() => handleDeleteImage(image.path, index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Xóa ảnh"
              >
                <FaTrash className="h-3 w-3" />
              </button>

              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="truncate">{image.filename}</p>
                <p>{(image.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;