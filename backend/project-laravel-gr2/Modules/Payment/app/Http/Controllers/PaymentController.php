<?php

namespace Modules\Payment\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Services\VNPayService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Modules\Order\Models\Order;
use Modules\Payment\Models\Payment;

class PaymentController extends Controller
{   
    /**
     * Xử lý IPN (Instant Payment Notification) từ VNPay
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function returnIPN(Request $request)
    {
        $vnp_HashSecret = config('app.vnp_HashSecret');
        $returnData = [];

        try {
            $inputData = [];
            foreach ($request->all() as $key => $value) {
                if (substr($key, 0, 4) === "vnp_") {
                    $inputData[$key] = $value;
                }
            }

            $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? null;
            unset($inputData['vnp_SecureHash']);
            unset($inputData['vnp_SecureHashType']);
            ksort($inputData);

            $hashData = "";
            $i = 0;
            foreach ($inputData as $key => $value) {
                if ($i === 1) {
                    $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
                } else {
                    $hashData .= urlencode($key) . "=" . urlencode($value);
                    $i = 1;
                }
            }

            $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
            
            if ($secureHash !== $vnp_SecureHash) {
                Log::warning('Payment IPN - Invalid signature', [
                    'vnp_TxnRef' => $inputData['vnp_TxnRef'] ?? null,
                    'expected' => $secureHash,
                    'received' => $vnp_SecureHash
                ]);
                return response()->json([
                    'RspCode' => '97',
                    'Message' => 'Invalid signature'
                ]);
            }

            $vnp_TxnRef = (int)($inputData['vnp_TxnRef'] ?? 0);
            $vnp_Amount = (int)($inputData['vnp_Amount'] ?? 0);
            $vnp_ResponseCode = $inputData['vnp_ResponseCode'] ?? null;
            $vnp_TransactionNo = $inputData['vnp_TransactionNo'] ?? null;
            $vnp_TransactionStatus = $inputData['vnp_TransactionStatus'] ?? null;
            $vnp_BankCode = $inputData['vnp_BankCode'] ?? null;

            $payment = Payment::where('vnp_TxnRef', $vnp_TxnRef)->first();
            
            if (!$payment) {
                Log::warning('Payment record not found', ['vnp_TxnRef' => $vnp_TxnRef]);
                return response()->json([
                    'RspCode' => '01',
                    'Message' => 'Order not found'
                ]);
            }

            if ($payment->payment_status !== 'pending') {
                Log::info('Payment already confirmed', [
                    'vnp_TxnRef' => $vnp_TxnRef,
                    'current_status' => $payment->payment_status
                ]);
                return response()->json([
                    'RspCode' => '02',
                    'Message' => 'Order already confirmed'
                ]);
            }

            if ($payment->vnp_Amount != $vnp_Amount) {
                Log::warning('Payment amount mismatch', [
                    'vnp_TxnRef' => $vnp_TxnRef,
                    'expected' => $payment->vnp_Amount,
                    'received' => $vnp_Amount
                ]);
                return response()->json([
                    'RspCode' => '04',
                    'Message' => 'Invalid amount'
                ]);
            }

            // Sử dụng VNPayService để xác định payment status
            $paymentStatus = VNPayService::getPaymentStatus($vnp_ResponseCode, $vnp_TransactionStatus);

            $payment->update([
                'payment_status' => $paymentStatus,
                'vnp_ResponseCode' => $vnp_ResponseCode,
                'vnp_TransactionNo' => $vnp_TransactionNo,
                'vnp_TransactionStatus' => $vnp_TransactionStatus,
                'vnp_CardType' => $vnp_BankCode,
            ]);

            if ($payment->order_id) {
                $order = Order::find($payment->order_id);
                if ($order) {
                    $orderPaymentStatus = match($paymentStatus) {
                        'success' => 'paid',
                        'suspicious' => 'pending', // Nghi ngờ gian lận, chờ xử lý
                        'pending' => 'pending',     // Đang chờ xử lý
                        default => 'failed'         // Thất bại
                    };
                    $order->update(['payment_status' => $orderPaymentStatus]);

                    Log::info('Payment IPN processed successfully', [
                        'vnp_TxnRef' => $vnp_TxnRef,
                        'order_id' => $payment->order_id,
                        'payment_status' => $paymentStatus,
                        'amount' => $vnp_Amount,
                        'transaction_no' => $vnp_TransactionNo
                    ]);
                }
            }

            return response()->json([
                'RspCode' => '00',
                'Message' => 'Confirm Success'
            ]);

        } catch (\Exception $e) {
            Log::error('Payment IPN error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'RspCode' => '99',
                'Message' => 'Unknown error'
            ]);
        }
    }

    /**
     * Xử lý Return URL từ VNPay (khi khách hàng quay lại từ VNPay)
     * Phương thức này hiển thị view với thông tin chi tiết về giao dịch
     * 
     * @param Request $request
     * @return \Illuminate\View\View
     */
    public function returnUrl(Request $request)
    {
        $vnp_HashSecret = config('app.vnp_HashSecret');
        $isSignatureValid = false;
        $isSuccess = false;
        $data = [];

        try {
            // Lọc dữ liệu VNPay
            $inputData = [];
            foreach ($request->all() as $key => $value) {
                if (substr($key, 0, 4) === "vnp_") {
                    $inputData[$key] = $value;
                }
            }

            $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? null;
            unset($inputData['vnp_SecureHash']);
            unset($inputData['vnp_SecureHashType']);
            ksort($inputData);

            // Tạo hash data
            $hashData = "";
            $i = 0;
            foreach ($inputData as $key => $value) {
                if ($i === 1) {
                    $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
                } else {
                    $hashData .= urlencode($key) . "=" . urlencode($value);
                    $i = 1;
                }
            }

            // Kiểm tra signature
            $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
            
            if ($secureHash !== $vnp_SecureHash) {
                Log::warning('Payment Return URL - Invalid signature', [
                    'vnp_TxnRef' => $inputData['vnp_TxnRef'] ?? null
                ]);
                return view('payments.return', [
                    'data' => $request->all(),
                    'isSignatureValid' => false,
                    'isSuccess' => false,
                ]);
            }

            $isSignatureValid = true;

            $vnp_TxnRef = (int)($inputData['vnp_TxnRef'] ?? 0);
            $vnp_Amount = (int)($inputData['vnp_Amount'] ?? 0);
            $vnp_ResponseCode = $inputData['vnp_ResponseCode'] ?? null;
            $vnp_TransactionNo = $inputData['vnp_TransactionNo'] ?? null;
            $vnp_TransactionStatus = $inputData['vnp_TransactionStatus'] ?? null;
            $vnp_BankCode = $inputData['vnp_BankCode'] ?? null;

            $payment = Payment::where('vnp_TxnRef', $vnp_TxnRef)->first();
            
            if (!$payment) {
                Log::warning('Payment record not found on return', ['vnp_TxnRef' => $vnp_TxnRef]);
                return view('payments.return', [
                    'data' => $request->all(),
                    'isSignatureValid' => false,
                    'isSuccess' => false,
                ]);
            }

            // Kiểm tra số tiền
            if ($payment->vnp_Amount != $vnp_Amount) {
                Log::warning('Payment amount mismatch on return', [
                    'vnp_TxnRef' => $vnp_TxnRef,
                    'expected' => $payment->vnp_Amount,
                    'received' => $vnp_Amount
                ]);
                return view('payments.return', [
                    'data' => $request->all(),
                    'isSignatureValid' => false,
                    'isSuccess' => false,
                ]);
            }

            // Xác định success dựa vào response code
            $isSuccess = $vnp_ResponseCode === '00' || $vnp_TransactionStatus === '00';

            // Nếu payment chưa được cập nhật bởi IPN, hãy cập nhật nó
            if ($payment->payment_status === 'pending') {
                $paymentStatus = VNPayService::getPaymentStatus($vnp_ResponseCode, $vnp_TransactionStatus);
                
                $payment->update([
                    'payment_status' => $paymentStatus,
                    'vnp_ResponseCode' => $vnp_ResponseCode,
                    'vnp_TransactionNo' => $vnp_TransactionNo,
                    'vnp_TransactionStatus' => $vnp_TransactionStatus,
                    'vnp_CardType' => $vnp_BankCode,
                ]);

                // Cập nhật order nếu có
                if ($payment->order_id) {
                    $order = Order::find($payment->order_id);
                    if ($order && $order->payment_status === 'pending') {
                        $orderPaymentStatus = match($paymentStatus) {
                            'success' => 'paid',
                            'suspicious' => 'pending',
                            'pending' => 'pending',
                            default => 'failed'
                        };
                        $order->update(['payment_status' => $orderPaymentStatus]);
                    }
                }

                Log::info('Payment updated from Return URL', [
                    'vnp_TxnRef' => $vnp_TxnRef,
                    'order_id' => $payment->order_id,
                    'payment_status' => $paymentStatus
                ]);
            }

            Log::info('Payment Return URL processed', [
                'vnp_TxnRef' => $vnp_TxnRef,
                'order_id' => $payment->order_id,
                'response_code' => $vnp_ResponseCode,
                'is_success' => $isSuccess
            ]);

            return view('payments.return', [
                'data' => $request->all(),
                'isSignatureValid' => $isSignatureValid,
                'isSuccess' => $isSuccess,
            ]);

        } catch (\Exception $e) {
            Log::error('Payment Return URL error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return view('payments.return', [
                'data' => $request->all(),
                'isSignatureValid' => false,
                'isSuccess' => false,
            ]);
        }
    }

    public function updateDataPayment(Request $request)
    {
        Log::info('Update Data Payment Request', ['request' => $request->all()]);
        try {
            $vnp_TxnRef = (int)($request->input('vnp_TxnRef') ?? 0);
            $vnp_ResponseCode = $request->input('vnp_ResponseCode');
            $vnp_Amount = (int)($request->input('vnp_Amount') ?? 0);
            $vnp_TransactionNo = $request->input('vnp_TransactionNo');
            $vnp_TransactionStatus = $request->input('vnp_TransactionStatus');
            $vnp_BankCode = $request->input('vnp_BankCode');

            $payment = Payment::where('vnp_TxnRef', $vnp_TxnRef)->first();
            
            if (!$payment) {
                Log::warning('Payment record not found', ['vnp_TxnRef' => $vnp_TxnRef]);
                return $this->sendError('Payment record not found.', 404);
            }

            if ($payment->vnp_Amount != $vnp_Amount) {
                Log::warning('Payment amount mismatch', [
                    'vnp_TxnRef' => $vnp_TxnRef,
                    'expected' => $payment->vnp_Amount,
                    'received' => $vnp_Amount
                ]);
                return $this->sendError('Payment amount mismatch.', 400);
            }

            if ($payment->payment_status !== 'pending' || 
                ($vnp_ResponseCode !== '00' && $vnp_TransactionStatus !== '00')) {
                return $this->sendError('Payment cannot be updated.', 400);
            }

            $paymentStatus = VNPayService::getPaymentStatus($vnp_ResponseCode, $vnp_TransactionStatus);
            
            $payment->update([
                'payment_status' => $paymentStatus,
                'vnp_ResponseCode' => $vnp_ResponseCode,
                'vnp_TransactionNo' => $vnp_TransactionNo,
                'vnp_TransactionStatus' => $vnp_TransactionStatus,
                'vnp_CardType' => $vnp_BankCode,
            ]);

            $order = null;
            if ($payment->order_id) {
                $order = Order::find($payment->order_id);
                if ($order?->payment_status === 'pending') {
                    $order->update([
                        'payment_status' => $paymentStatus == 'success' ? 'paid' : 'pending'
                    ]);
                }
            }

            Log::info('Payment updated successfully', [
                'vnp_TxnRef' => $vnp_TxnRef,
                'order_id' => $payment->order_id,
                'payment_status' => $paymentStatus
            ]);

            return $this->sendSuccess([
                'payment' => $payment,
                'order' => $order,
                'payment_status' => $paymentStatus
            ], 'Payment data updated successfully.');
        } catch (\Exception $e) {
            Log::error('Payment update error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return $this->sendError('Unknown error occurred.', 500);
        }
    }
}
