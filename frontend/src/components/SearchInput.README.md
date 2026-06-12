# SearchInput Component

Component tìm kiếm linh hoạt có thể tìm kiếm theo tên, giá, status hoặc bất kỳ trường nào tùy thuộc vào dữ liệu truyền vào.

## Cách sử dụng cơ bản

```jsx
import SearchInput from '../components/SearchInput';

// Tìm kiếm đơn giản theo tên
<SearchInput
  searchFields={[
    {
      key: 'name',
      type: 'text',
      label: 'Tên sản phẩm',
      placeholder: 'Tìm kiếm sản phẩm...'
    }
  ]}
  onSearch={(filters) => {
    console.log('Search filters:', filters);
    // filters = { name: 'iPhone' }
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchFields` | Array | `[]` | Mảng các trường tìm kiếm |
| `onSearch` | Function | - | Callback khi có thay đổi tìm kiếm |
| `placeholder` | String | `"Tìm kiếm..."` | Placeholder mặc định |
| `className` | String | `''` | CSS class bổ sung |
| `debounceDelay` | Number | `300` | Độ trễ debounce (ms) - chỉ áp dụng khi `useSearchButton=false` |
| `showClearButton` | Boolean | `true` | Hiển thị nút xóa |
| `size` | String | `'medium'` | Kích thước: 'small', 'medium', 'large' |
| `useSearchButton` | Boolean | `false` | Nếu `true`, hiển thị nút "Tìm kiếm" thay vì tự động tìm |

## Cấu trúc searchFields

```jsx
{
  key: 'field_name',        // Tên trường (unique)
  type: 'text|select|number|date', // Loại input
  label: 'Display Label',   // Nhãn hiển thị
  placeholder: 'Placeholder text', // Placeholder
  options: [                // Chỉ dùng cho type='select'
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ],
  min: 0,                   // Chỉ dùng cho type='number'
  max: 100,                 // Chỉ dùng cho type='number'
  step: 1                   // Chỉ dùng cho type='number'
}
```

## Ví dụ sử dụng

### 1. Tìm kiếm đơn giản theo tên

```jsx
<SearchInput
  searchFields={[
    {
      key: 'name',
      type: 'text',
      label: 'Tên sản phẩm',
      placeholder: 'Nhập tên sản phẩm...'
    }
  ]}
  onSearch={(filters) => {
    // filters = { name: 'iPhone 15' }
    fetchProducts({ search: filters.name });
  }}
/>
```

### 2. Tìm kiếm theo tên và trạng thái

```jsx
<SearchInput
  searchFields={[
    {
      key: 'name',
      type: 'text',
      label: 'Tên sản phẩm',
      placeholder: 'Tìm kiếm sản phẩm...'
    },
    {
      key: 'status',
      type: 'select',
      label: 'Trạng thái',
      options: [
        { value: '', label: 'Tất cả' },
        { value: '1', label: 'Hoạt động' },
        { value: '0', label: 'Không hoạt động' }
      ]
    }
  ]}
  onSearch={(filters) => {
    // filters = { name: 'iPhone', status: '1' }
    fetchProducts(filters);
  }}
/>
```

### 3. Tìm kiếm theo giá (range)

```jsx
<SearchInput
  searchFields={[
    {
      key: 'minPrice',
      type: 'number',
      label: 'Giá từ',
      placeholder: 'Giá thấp nhất',
      min: 0
    },
    {
      key: 'maxPrice',
      type: 'number',
      label: 'Giá đến',
      placeholder: 'Giá cao nhất',
      min: 0
    }
  ]}
  onSearch={(filters) => {
    // filters = { minPrice: 1000000, maxPrice: 5000000 }
    fetchProducts({
      price_min: filters.minPrice,
      price_max: filters.maxPrice
    });
  }}
/>
```

### 4. Tìm kiếm theo ngày

```jsx
<SearchInput
  searchFields={[
    {
      key: 'createdAt',
      type: 'date',
      label: 'Ngày tạo'
    }
  ]}
  onSearch={(filters) => {
    // filters = { createdAt: '2025-11-04' }
    fetchProducts({ created_at: filters.createdAt });
  }}
/>
```

### 5. Tìm kiếm phức tạp (sản phẩm)

```jsx
<SearchInput
  searchFields={[
    {
      key: 'name',
      type: 'text',
      label: 'Tên sản phẩm',
      placeholder: 'Tìm theo tên...'
    },
    {
      key: 'price',
      type: 'number',
      label: 'Giá',
      placeholder: 'Tìm theo giá',
      min: 0
    },
    {
      key: 'status',
      type: 'select',
      label: 'Trạng thái',
      options: [
        { value: '', label: 'Tất cả' },
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' }
      ]
    },
    {
      key: 'category',
      type: 'select',
      label: 'Danh mục',
      options: categories.map(cat => ({
        value: cat.id,
        label: cat.name
      }))
    }
  ]}
  onSearch={(filters) => {
    // filters = { name: 'iPhone', price: 15000000, status: 'active', category: '1' }
    fetchProducts(filters);
  }}
  size="large"
  debounceDelay={500}
/>
```

### 6. Tìm kiếm với nút "Tìm kiếm" (thay vì tự động)

```jsx
<SearchInput
  searchFields={[
    {
      key: 'name',
      type: 'text',
      label: 'Tên sản phẩm',
      placeholder: 'Nhập tên sản phẩm...'
    },
    {
      key: 'status',
      type: 'select',
      label: 'Trạng thái',
      options: [
        { value: '1', label: 'Đang hoạt động' },
        { value: '0', label: 'Không hoạt động' }
      ],
      placeholder: 'Chọn trạng thái...'
    }
  ]}
  onSearch={(filters) => {
    // Chỉ được gọi khi nhấn nút "Tìm kiếm"
    console.log('Searching with filters:', filters);
    fetchProducts(filters);
  }}
  useSearchButton={true} // Hiển thị nút tìm kiếm
  size="medium"
/>
```

## Tính năng

- ✅ **Debounced search**: Tự động debounce để tránh gọi API quá nhiều (khi `useSearchButton=false`)
- ✅ **Search button mode**: Chế độ nút tìm kiếm để người dùng chủ động tìm (khi `useSearchButton=true`)
- ✅ **Multiple field types**: Hỗ trợ text, select, number, date
- ✅ **Fully responsive**: Hoạt động hoàn hảo trên mobile, tablet và desktop
- ✅ **Mobile-first design**: Layout tự động điều chỉnh theo kích thước màn hình
- ✅ **Clear button**: Có thể xóa tất cả tìm kiếm
- ✅ **Active search indicators**: Hiển thị các bộ lọc đang active với responsive design
- ✅ **Flexible sizing**: 3 kích thước small, medium, large
- ✅ **TypeScript ready**: Có thể dễ dàng thêm TypeScript types

## Callback onSearch

Function `onSearch` sẽ nhận một object chứa các giá trị tìm kiếm đã được xử lý:

```jsx
onSearch={(filters) => {
  // filters sẽ có format:
  // {
  //   fieldKey1: processedValue1,
  //   fieldKey2: processedValue2,
  //   ...
  // }

  // Ví dụ cho text: { name: 'iPhone 15' }
  // Ví dụ cho number: { price: 15000000 }
  // Ví dụ cho select: { status: 'active' }
  // Ví dụ cho date: { createdAt: '2025-11-04' }
}}
```

## CSS Classes

Component sử dụng Tailwind CSS. Bạn có thể customize bằng cách truyền `className` prop hoặc override các class mặc định.

## Responsive Design

Component được thiết kế với mobile-first approach và tự động điều chỉnh layout theo kích thước màn hình:

### **Mobile (< 640px)**
- Các trường tìm kiếm xếp chồng theo chiều dọc
- Nút "Tìm kiếm" hiển thị text ngắn gọn ("Tìm" thay vì "Tìm kiếm")
- Nút tìm kiếm có width 100% để dễ nhấn
- Active search tags ẩn label để tiết kiệm không gian

### **Tablet (640px - 1024px)**
- 2 cột layout cho các trường tìm kiếm
- Nút tìm kiếm và clear button hiển thị đầy đủ

### **Desktop (> 1024px)**
- Layout ngang với flexbox
- Tất cả elements hiển thị đầy đủ
- Spacing và sizing được tối ưu cho desktop

## Performance

- Sử dụng `useMemo` để tránh re-computation không cần thiết
- Sử dụng `useCallback` cho event handlers
- Debounced search để tối ưu API calls
- Chỉ re-render khi cần thiết