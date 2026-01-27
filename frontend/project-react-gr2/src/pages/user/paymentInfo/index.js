import React, { useEffect, useState, useRef } from "react";
import { useCart } from "../../../component/CartContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FiCheckCircle, FiX, FiAlertCircle, FiLoader } from "react-icons/fi";
import { api } from "../../../utils/apiClient";

const VnpayResponse = () => {
  const [vnpayData, setVnpayData] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { removeAllFromCart } = useCart();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  const extractOrderCodeFromOrderInfo = (orderInfo) => {
    if (!orderInfo || typeof orderInfo !== "string") return null;
    const parts = orderInfo.split(":");
    if (parts.length < 2) return null;
    const code = parts[parts.length - 1].trim();
    return code || null;
  };

  // Map mã lỗi VNPay
  const ERROR_MESSAGES = {
    "00": "Giao dịch thành công",
    "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
    "09": "Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
    "10": "Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
    "11": "Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
    "12": "Thẻ/Tài khoản bị khóa.",
    "13": "Nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.",
    "24": "Khách hàng hủy giao dịch",
    "51": "Tài khoản không đủ số dư để thực hiện giao dịch.",
    "65": "Tài khoản đã vượt quá hạn mức giao dịch trong ngày.",
    "75": "Ngân hàng thanh toán đang bảo trì.",
    "79": "Nhập sai mật khẩu thanh toán quá số lần quy định.",
    "99": "Các lỗi khác",
  };

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const processPaymentResponse = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(window.location.search);
        
        const responseCode = params.get("vnp_ResponseCode");
        const txnRef = params.get("vnp_TxnRef");
        const amount = params.get("vnp_Amount");

        const vnpPayDate = params.get("vnp_PayDate");
        const formattedPayDate = vnpPayDate
          ? format(
              new Date(
                vnpPayDate.slice(0, 4),
                vnpPayDate.slice(4, 6) - 1,
                vnpPayDate.slice(6, 8),
                vnpPayDate.slice(8, 10),
                vnpPayDate.slice(10, 12),
                vnpPayDate.slice(12, 14)
              ),
              "dd/MM/yyyy HH:mm:ss"
            )
          : "N/A";

        setVnpayData({
          vnp_Amount: amount,
          vnp_BankCode: params.get("vnp_BankCode"),
          vnp_CardType: params.get("vnp_CardType"),
          vnp_OrderInfo: params.get("vnp_OrderInfo"),
          vnp_PayDate: formattedPayDate,
          vnp_ResponseCode: responseCode,
          vnp_TmnCode: params.get("vnp_TmnCode"),
          vnp_TransactionNo: params.get("vnp_TransactionNo"),
          vnp_TransactionStatus: params.get("vnp_TransactionStatus"),
          vnp_TxnRef: txnRef,
        });

        let paymentStatus = "failed";
        
        if (responseCode === "00") {
          paymentStatus = "success";
        } else if (responseCode === "07") {
          paymentStatus = "suspicious";
        } else if (responseCode === "24") {
          paymentStatus = "canceled";
        } else {
          paymentStatus = "failed";
        }

        // Gọi API cập nhật DB với thông tin thanh toán
        try {
          const updateResponse = await api.post("/update-data-payment", {
            vnp_TxnRef: txnRef,
            vnp_ResponseCode: responseCode,
            payment_status: paymentStatus,
            vnp_Amount: amount,
            vnp_BankCode: params.get("vnp_BankCode"),
            vnp_TransactionNo: params.get("vnp_TransactionNo"),
            vnp_OrderInfo: params.get("vnp_OrderInfo"),
          });

          console.log("Update payment response:", updateResponse);

          const data = updateResponse.data.data || updateResponse;
          setPaymentInfo({
            payment_status: paymentStatus,
            order: data.order || null,
            message: data.message || null,
          });

          // Clear cart nếu thanh toán thành công
          if (paymentStatus === "success") {
            removeAllFromCart();
          }
        } catch (apiErr) {
          console.error("Error updating payment in DB:", apiErr);
          setPaymentInfo({
            payment_status: paymentStatus,
            order: null,
            message: apiErr.response?.data?.message || "Có lỗi khi cập nhật thanh toán",
          });
        }
      } catch (err) {
        console.error("Error processing payment response:", err);
        setError(
          err.response?.data?.message || "Lỗi khi xử lý kết quả thanh toán"
        );
      } finally {
        setLoading(false);
      }
    };

    processPaymentResponse();
  }, [removeAllFromCart]);

  const getStatusIcon = () => {
    if (loading) {
      return <FiLoader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />;
    }

    switch (paymentInfo?.payment_status) {
      case "success":
        return <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
      case "suspicious":
        return <FiAlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />;
      case "failed":
      case "pending":
      default:
        return <FiX className="w-16 h-16 text-red-500 mx-auto mb-4" />;
    }
  };

  const getStatusBadge = () => {
    if (loading) return null;

    const statusConfig = {
      success: { bg: "bg-green-100", text: "text-green-800", label: "✓ Thanh toán thành công" },
      suspicious: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "⚠️ Giao dịch nghi ngờ (chờ xác nhận)",
      },
      failed: { bg: "bg-red-100", text: "text-red-800", label: "✗ Thanh toán thất bại" },
      pending: { bg: "bg-blue-100", text: "text-blue-800", label: "⏳ Đang chờ xử lý" },
    };

    const config = statusConfig[paymentInfo?.payment_status] || statusConfig.failed;
    return (
      <div className={`${config.bg} ${config.text} py-2 px-4 rounded-lg font-semibold text-center`}>
        {config.label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang xử lý thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <FiX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-center text-red-600 mb-4">Lỗi xử lý thanh toán</h1>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại thanh toán
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {getStatusIcon()}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Kết quả thanh toán
            </h1>
            {getStatusBadge()}
          </div>

          {/* Payment Info */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Thông tin giao dịch
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Transaction ID */}
                <div>
                  <p className="text-sm text-gray-500 font-medium">Mã giao dịch</p>
                  <p className="text-gray-800 font-semibold">
                    {vnpayData?.vnp_TxnRef || "N/A"}
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-sm text-gray-500 font-medium">Số tiền</p>
                  <p className="text-2xl font-bold text-green-600">
                    {vnpayData?.vnp_Amount
                      ? (parseFloat(vnpayData.vnp_Amount) / 100).toLocaleString("vi-VN")
                      : "N/A"}
                    {" VND"}
                  </p>
                </div>

                {/* Bank Code */}
                <div>
                  <p className="text-sm text-gray-500 font-medium">Phương thức thanh toán</p>
                  <p className="text-gray-800">{vnpayData?.vnp_BankCode || "N/A"}</p>
                </div>

                {/* Order Info
                <div>
                  <p className="text-sm text-gray-500 font-medium">Nội dung thanh toán</p>
                  <p className="text-gray-800 break-words">
                    {vnpayData?.vnp_OrderInfo || "N/A"}
                  </p>
                </div> */}
                
                {/* Order Code */}
                <div>
                  <p className="text-sm text-gray-500 font-medium">Mã đơn hàng</p>
                  <p className="text-gray-800 font-semibold">
                    {extractOrderCodeFromOrderInfo(vnpayData?.vnp_OrderInfo) || "N/A"}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Response Code */}
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Trạng thái</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {ERROR_MESSAGES[vnpayData?.vnp_ResponseCode] || "Lỗi không xác định"}
                    </span>
                  </div>
                </div>

                {/* Transaction No */}
                <div>
                  <p className="text-sm text-gray-500 font-medium">Mã giao dịch VNPAY</p>
                  <p className="text-gray-800 font-mono">
                    {vnpayData?.vnp_TransactionNo || "N/A"}
                  </p>
                </div>

                {/* Card Type */}
                <div>
                  <p className="text-sm text-gray-500 font-medium">Loại thẻ</p>
                  <p className="text-gray-800">{vnpayData?.vnp_CardType || "N/A"}</p>
                </div>

                {/* Pay Date */}
                <div>
                  <p className="text-sm text-gray-500 font-medium">Thời gian giao dịch</p>
                  <p className="text-gray-800">{vnpayData?.vnp_PayDate || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row gap-4">
            {paymentInfo?.order && (
              <button
                onClick={() => navigate(`/order-detail-payment/${paymentInfo.order.id}`)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Xem thông tin đơn hàng
              </button>
            )}
            <button
              onClick={() => navigate("/product-list")}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Tiếp tục mua sắm
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="font-semibold mb-2">💡 Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Kiểm tra email để nhận xác nhận đơn hàng</li>
              <li>
                {paymentInfo?.payment_status === "suspicious"
                  ? "Giao dịch của bạn đang chờ xác nhận. Chúng tôi sẽ liên hệ với bạn trong vài giờ."
                  : "Nếu có thắc mắc, vui lòng liên hệ với chúng tôi."}
              </li>
              <li>Vui lòng lưu lại mã giao dịch để tra cứu khi cần thiết.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VnpayResponse;
