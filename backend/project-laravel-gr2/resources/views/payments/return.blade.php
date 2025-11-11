<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Kết Quả Thanh Toán VNPAY</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .success-icon {
            color: #10b981;
        }
        .error-icon {
            color: #ef4444;
        }
        .warning-icon {
            color: #f59e0b;
        }
        .card-shadow {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
    </style>
</head>

<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <i class="fas fa-credit-card text-white text-2xl"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Kết Quả Thanh Toán</h1>
            <p class="text-gray-600">Thông tin chi tiết giao dịch VNPAY</p>
        </div>

        <!-- Status Card -->
        <div class="bg-white rounded-lg card-shadow p-6 mb-6">
            <div class="flex items-center justify-center mb-4">
                @if ($isSignatureValid)
                    @if ($isSuccess)
                        <div class="flex items-center text-green-600">
                            <i class="fas fa-check-circle text-4xl success-icon mr-3"></i>
                            <div>
                                <h2 class="text-xl font-semibold">Thanh Toán Thành Công</h2>
                                <p class="text-sm">Giao dịch đã được xử lý thành công</p>
                            </div>
                        </div>
                    @else
                        <div class="flex items-center text-red-600">
                            <i class="fas fa-times-circle text-4xl error-icon mr-3"></i>
                            <div>
                                <h2 class="text-xl font-semibold">Thanh Toán Thất Bại</h2>
                                <p class="text-sm">Giao dịch không thành công</p>
                            </div>
                        </div>
                    @endif
                @else
                    <div class="flex items-center text-yellow-600">
                        <i class="fas fa-exclamation-triangle text-4xl warning-icon mr-3"></i>
                        <div>
                            <h2 class="text-xl font-semibold">Chữ Ký Không Hợp Lệ</h2>
                            <p class="text-sm">Có vấn đề với xác thực giao dịch</p>
                        </div>
                    </div>
                @endif
            </div>
        </div>

        <!-- Transaction Details -->
        <div class="bg-white rounded-lg card-shadow overflow-hidden">
            <div class="gradient-bg px-6 py-4">
                <h3 class="text-white text-lg font-semibold flex items-center">
                    <i class="fas fa-receipt mr-2"></i>
                    Chi Tiết Giao Dịch
                </h3>
            </div>

            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Left Column -->
                    <div class="space-y-4">
                        <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-hashtag text-blue-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Mã Đơn Hàng</p>
                                <p class="text-lg font-semibold text-gray-900">{{ $data['vnp_TxnRef'] }}</p>
                            </div>
                        </div>

                        <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-money-bill-wave text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Số Tiền</p>
                                <p class="text-lg font-semibold text-gray-900">{{ number_format($data['vnp_Amount'] / 100, 0) }} VND</p>
                            </div>
                        </div>

                        <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-file-alt text-purple-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Nội Dung Thanh Toán</p>
                                <p class="text-sm text-gray-900">{{ $data['vnp_OrderInfo'] }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-4">
                        <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-exclamation-triangle text-red-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Mã Phản Hồi</p>
                                <p class="text-lg font-semibold text-gray-900">{{ $data['vnp_ResponseCode'] ?? 'N/A' }}</p>
                            </div>
                        </div>

                        <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div class="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-university text-indigo-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Ngân Hàng</p>
                                <p class="text-lg font-semibold text-gray-900">{{ $data['vnp_BankCode'] ?? 'N/A' }}</p>
                            </div>
                        </div>

                        <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div class="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-clock text-yellow-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Thời Gian</p>
                                <p class="text-sm text-gray-900">{{ $data['vnp_PayDate'] ?? 'N/A' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Transaction ID -->
                <div class="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div class="flex items-center">
                        <i class="fas fa-id-card text-blue-600 mr-3"></i>
                        <div>
                            <p class="text-sm font-medium text-blue-800">Mã Giao Dịch Tại VNPAY</p>
                            <p class="text-lg font-mono text-blue-900">{{ $data['vnp_TransactionNo'] ?? 'N/A' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 text-center space-x-4">
            <a href="{{ url('http://localhost:3000/') }}" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200">
                <i class="fas fa-home mr-2"></i>
                Về Trang Chủ
            </a>
        </div>

        <!-- Footer -->
        <footer class="mt-12 text-center text-gray-500">
            <div class="flex items-center justify-center mb-2">
                <i class="fas fa-shield-alt text-green-500 mr-2"></i>
                <span class="text-sm">Bảo mật bởi VNPAY</span>
            </div>
            <p class="text-xs">&copy; {{ date('Y') }} VNPAY. Tất cả quyền được bảo lưu.</p>
        </footer>
    </div>

    <script>
        // Auto refresh after 5 seconds for success transactions
        @if ($isSignatureValid && $isSuccess)
        setTimeout(function() {
            window.location.href = '{{ url("/admin/order-list") }}';
        }, 5000);
        @endif
    </script>
</body>

</html>