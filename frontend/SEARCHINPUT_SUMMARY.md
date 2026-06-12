# SearchInput Component - Tóm tắt

## 🎯 Mục đích
Tạo một component tìm kiếm linh hoạt có thể tìm kiếm theo tên, giá, status hoặc bất kỳ trường nào tùy thuộc vào dữ liệu được truyền vào.

## 📁 Files đã tạo

1. **`src/components/SearchInput.js`** - Component chính
2. **`src/components/SearchInput.README.md`** - Documentation chi tiết
3. **`src/examples/SearchInputExample.js`** - Ví dụ đầy đủ với nhiều use case
4. **`src/examples/SearchInputDemo.js`** - Demo đơn giản để test nhanh

## ✨ Tính năng chính

### 🔍 **Tìm kiếm linh hoạt**
- Hỗ trợ nhiều loại input: `text`, `select`, `number`, `date`
- Có thể tìm kiếm theo 1 hoặc nhiều trường cùng lúc
- Debounced search (mặc định 300ms) để tối ưu performance

### 🎨 **UI/UX tốt**
- Responsive design cho mobile và desktop
- 3 kích thước: `small`, `medium`, `large`
- Hiển thị các bộ lọc đang active
- Nút xóa tìm kiếm
- Loading state

### ⚡ **Performance tối ưu**
- Sử dụng `useMemo` và `useCallback`
- Debounced để tránh gọi API quá nhiều
- Chỉ re-render khi cần thiết

## 🚀 Cách sử dụng cơ bản

```jsx
import SearchInput from '../components/SearchInput';

<SearchInput
  searchFields={[
    {
      key: 'name',
      type: 'text',
      label: 'Tên sản phẩm',
      placeholder: 'Tìm kiếm...'
    },
    {
      key: 'status',
      type: 'select',
      label: 'Trạng thái',
      options: [
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' }
      ]
    }
  ]}
  onSearch={(filters) => {
    // filters = { name: 'iPhone', status: 'active' }
    fetchData(filters);
  }}
/>
```

## 📊 Callback onSearch

Function `onSearch` sẽ nhận object chứa các giá trị đã được xử lý:

```jsx
onSearch={(filters) => {
  // Text: { name: 'iPhone 15' }
  // Number: { price: 15000000 }
  // Select: { status: 'active' }
  // Date: { createdAt: '2025-11-04' }
}}
```

## 🎛️ Props hỗ trợ

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `searchFields` | Array | `[]` | Cấu hình các trường tìm kiếm |
| `onSearch` | Function | - | Callback khi tìm kiếm |
| `placeholder` | String | `"Tìm kiếm..."` | Placeholder mặc định |
| `debounceDelay` | Number | `300` | Độ trễ debounce (ms) |
| `showClearButton` | Boolean | `true` | Hiển thị nút xóa |
| `size` | String | `'medium'` | Kích thước component |

## 🔧 Cấu trúc searchFields

```jsx
{
  key: 'field_name',        // Unique key cho trường
  type: 'text|select|number|date', // Loại input
  label: 'Display Label',   // Nhãn hiển thị
  placeholder: 'Placeholder', // Placeholder text
  options: [                // Chỉ cho select
    { value: 'val', label: 'Label' }
  ],
  min: 0,                   // Chỉ cho number
  max: 100,                 // Chỉ cho number
  step: 1                   // Chỉ cho number
}
```

## 📱 Responsive & Accessible

- ✅ Mobile-friendly
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels
- ✅ Focus management

## 🧪 Testing

Component đã được test với:
- Tìm kiếm đơn trường
- Tìm kiếm đa trường
- Debounce functionality
- Clear functionality
- Responsive layout

## 🔄 Migration từ SearchFilter cũ

Nếu bạn đang dùng SearchFilter cũ, có thể dễ dàng migrate:

```jsx
// Cũ
<SearchFilter
  showName={true}
  showStatus={true}
  onFilterChange={handleFilter}
/>

// Mới
<SearchInput
  searchFields={[
    { key: 'name', type: 'text', label: 'Tên' },
    { key: 'status', type: 'select', label: 'Trạng thái', options: [...] }
  ]}
  onSearch={handleFilter}
/>
```

## 🎉 Kết luận

SearchInput là một component tìm kiếm hiện đại, linh hoạt và performance cao, phù hợp cho mọi nhu cầu tìm kiếm trong ứng dụng React.