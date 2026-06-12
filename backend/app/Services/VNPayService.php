<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Modules\Order\Models\Order;
use Modules\Payment\Models\Payment;

class VNPayService
{
    public function fetchVNPay(): array
    {
        return [
            'return_url' => config('payment-method.vnpay.return_url'),
            'refund_url' => config('payment-method.vnpay.refund_url'),
            'refund_email' => config('payment-method.vnpay.refund_email'),
            'tmn_code' => config('payment-method.vnpay.tmn_code'),
            'url' => config('payment-method.vnpay.url'),
            'secret_key' => config('payment-method.vnpay.secret_key'),
        ];
    }

    public function generateUrlPayment(string $vnpBankCode, Order $order, array $config)
    {
        $vnpHashSecret = $config['secret_key'];
        $vnpUrl = $config['url'];
        $vnpIpAddr = request()->ip();
        $vnpCreateDate = Carbon::now('Asia/Ho_Chi_Minh')->format('YmdHis');
        $vnpExpireDate = Carbon::now('Asia/Ho_Chi_Minh')->addMinutes(15)->format('YmdHis');
        $totalPayment = $order->total_price;
        $txnRef = Rand() . $order->id;

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $config['tmn_code'],
            "vnp_Amount" => $totalPayment * 100,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => $vnpCreateDate,
            "vnp_ExpireDate" => $vnpExpireDate,
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnpIpAddr,
            "vnp_Locale" => "vn",
            "vnp_OrderInfo" => "Thanh toan DH: " . $order->code,
            "vnp_OrderType" => "other",
            "vnp_ReturnUrl" => $config['return_url'],
            "vnp_TxnRef" => $txnRef,
        ];

        $filteredData = array_filter(
            $inputData,
            function ($key) {
                return !in_array($key, ['vnp_Version', 'vnp_TmnCode', 'vnp_ReturnUrl', 'vnp_TxnRef']);
            },
            ARRAY_FILTER_USE_KEY
        );

        if (!empty($vnpBankCode)) {
            $inputData['vnp_BankCode'] = $vnpBankCode;
        }

        //Save data payment
        $this->saveDataPayment($order, $inputData);

        ksort($inputData);
        $query = "";
        $index = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($index == 1) {
                $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData .= urlencode($key) . "=" . urlencode($value);
                $index = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnpUrl = $vnpUrl . "?" . $query;
        if (isset($vnpHashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashData, $vnpHashSecret);
            $vnpUrl .= 'vnp_SecureHash=' . $vnpSecureHash;
            return array_merge(
                ['payment_url' => $vnpUrl],
                $filteredData
            );
        }
        return false;
    }

    public function saveDataPayment(object $orderData, $paymentData)
    {
        Log::info('Saving payment data for order ID: ' . $orderData);
        Log::info('Payment data: ' . print_r($paymentData, true));

        Payment::create([
            'order_id' => $orderData->id,
            'vnp_TxnRef' => $paymentData['vnp_TxnRef'],
            'vnp_Amount' => $paymentData['vnp_Amount'],
            'vnp_BankCode' => $paymentData['vnp_BankCode'],
            'vnp_IpAddr' => $paymentData['vnp_IpAddr'],
            'vnp_CreateDate' => $paymentData['vnp_CreateDate'],
            'vnp_ExpireDate' => $paymentData['vnp_ExpireDate'],
            'vnp_Locale' => $paymentData['vnp_Locale'],
            'vnp_OrderInfo' => $paymentData['vnp_OrderInfo'],
        ]);
    }

    const TRANSACTION_STATUS = [
        '00' => 'Giao dịch thành công',
        '01' => 'Giao dịch chưa hoàn tất',
        '02' => 'Giao dịch bị lỗi',
        '04' => 'Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)',
        '05' => 'VNPAY đang xử lý giao dịch này (GD hoàn tiền)',
        '06' => 'VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)',
        '07' => 'Giao dịch bị nghi ngờ gian lận',
        '09' => 'GD Hoàn trả bị từ chối',
    ];

    /**
     * Mã phản hồi từ VNPAY (vnp_ResponseCode)
     */
    const RESPONSE_CODE = [
        '00' => 'Giao dịch thành công',
        '07' => 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
        '09' => 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
        '10' => 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
        '11' => 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
        '12' => 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
        '13' => 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
        '24' => 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
        '51' => 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
        '65' => 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
        '75' => 'Ngân hàng thanh toán đang bảo trì.',
        '79' => 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
        '99' => 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
    ];

    /**
     * Lấy mô tả từ mã trạng thái giao dịch
     *
     * @param string $code
     * @return string
     */
    public static function getTransactionStatusDescription($code)
    {
        return self::TRANSACTION_STATUS[$code] ?? 'Trạng thái không xác định';
    }

    /**
     * Lấy mô tả từ mã phản hồi
     *
     * @param string $code
     * @return string
     */
    public static function getResponseCodeDescription($code)
    {
        return self::RESPONSE_CODE[$code] ?? 'Lỗi không xác định';
    }

    /**
     * Kiểm tra giao dịch có thành công không
     *
     * @param string $responseCode
     * @param string $transactionStatus
     * @return bool
     */
    public static function isSuccessful($responseCode, $transactionStatus = null)
    {
        return $responseCode === '00' || $transactionStatus === '00';
    }

    /**
     * Kiểm tra giao dịch có bị lỗi không (không phải chờ xử lý hay bị từ chối)
     *
     * @param string $responseCode
     * @return bool
     */
    public static function isError($responseCode)
    {
        return isset(self::RESPONSE_CODE[$responseCode]) && $responseCode !== '00' && $responseCode !== '07';
    }

    /**
     * Kiểm tra giao dịch có bị nghi ngờ không
     *
     * @param string $responseCode
     * @param string $transactionStatus
     * @return bool
     */
    public static function isSuspicious($responseCode, $transactionStatus = null)
    {
        return $responseCode === '07' || $transactionStatus === '07';
    }

    /**
     * Kiểm tra giao dịch có đang chờ xử lý không
     *
     * @param string $transactionStatus
     * @return bool
     */
    public static function isPending($transactionStatus)
    {
        return in_array($transactionStatus, ['01', '05', '06']);
    }

    /**
     * Lấy trạng thái thanh toán dựa vào response code và transaction status
     *
     * @param string $responseCode
     * @param string|null $transactionStatus
     * @return string success|failed|suspicious|pending
     */
    public static function getPaymentStatus($responseCode, $transactionStatus = null)
    {
        if (self::isSuccessful($responseCode, $transactionStatus)) {
            return 'success';
        }

        if (self::isSuspicious($responseCode, $transactionStatus)) {
            return 'suspicious';
        }

        if (self::isPending($transactionStatus)) {
            return 'pending';
        }

        return 'failed';
    }

    /**
     * Format response để trả về cho frontend
     *
     * @param string $responseCode
     * @param string|null $transactionStatus
     * @param bool $isIPN Nếu là IPN thì không cần message chi tiết
     * @return array
     */
    public static function formatResponse($responseCode, $transactionStatus = null, $isIPN = false)
    {
        $paymentStatus = self::getPaymentStatus($responseCode, $transactionStatus);
        
        if ($isIPN) {
            // IPN chỉ cần response code đơn giản
            return [
                'payment_status' => $paymentStatus,
                'response_code' => $responseCode,
            ];
        }

        // Return URL cần message chi tiết cho người dùng
        $message = self::getResponseCodeDescription($responseCode);
        if ($transactionStatus && $transactionStatus !== $responseCode) {
            $message .= ' (' . self::getTransactionStatusDescription($transactionStatus) . ')';
        }

        return [
            'code' => $paymentStatus === 'success' ? '00' : '99',
            'message' => $message,
            'payment_status' => $paymentStatus,
            'response_code' => $responseCode,
            'transaction_status' => $transactionStatus,
        ];
    }
}
