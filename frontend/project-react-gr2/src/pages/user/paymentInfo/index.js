import React, { useEffect, useState } from "react";
import { useCart } from "../../../component/CartContext";
import { format } from "date-fns"; // Import date-fns

const VnpayResponse = () => {
  const [vnpayData, setVnpayData] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const {removeAllFromCart} = useCart();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = {
      vnp_Amount: params.get("vnp_Amount"),
      vnp_BankCode: params.get("vnp_BankCode"),
      vnp_CardType: params.get("vnp_CardType"),
      vnp_OrderInfo: params.get("vnp_OrderInfo"),
      vnp_PayDate: params.get("vnp_PayDate"),
      vnp_ResponseCode: params.get("vnp_ResponseCode"),
      vnp_TmnCode: params.get("vnp_TmnCode"),
      vnp_TransactionNo: params.get("vnp_TransactionNo"),
      vnp_TransactionStatus: params.get("vnp_TransactionStatus"),
      vnp_TxnRef: params.get("vnp_TxnRef"),
      vnp_SecureHash: params.get("vnp_SecureHash"),
    };

    setVnpayData(data);

    const isSuccess = data.vnp_ResponseCode === "00";
    setIsSuccess(isSuccess);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      removeAllFromCart();
    }
  }, [isSuccess, removeAllFromCart]);

  const formattedPayDate = vnpayData.vnp_PayDate
    ? format(
        new Date(
          vnpayData.vnp_PayDate.slice(0, 4),
          vnpayData.vnp_PayDate.slice(4, 6) - 1,
          vnpayData.vnp_PayDate.slice(6, 8),
          vnpayData.vnp_PayDate.slice(8, 10),
          vnpayData.vnp_PayDate.slice(10, 12),
          vnpayData.vnp_PayDate.slice(12, 14)
        ),
        "dd/MM/yyyy HH:mm:ss"
      )
    : "N/A";

  return (
    <div className="flex items-center justify-center bg-gray-100 my-">
      <div className="my-3 bg-white shadow-md rounded-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Thông tin thanh toán VNPay
        </h1>
        <div className="mb-4">
          <label className="block font-medium">Mã đơn hàng:</label>
          <label>{vnpayData.vnp_TxnRef || "N/A"}</label>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Số tiền:</label>
          <label>
            {vnpayData.vnp_Amount
              ? (parseFloat(vnpayData.vnp_Amount) / 100).toLocaleString()
              : "N/A"}{" "}
            VND
          </label>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Nội dung thanh toán:</label>
          <label>{vnpayData.vnp_OrderInfo || "N/A"}</label>
        </div>
        <div className="mb-4">
          <label className="block font-medium">
            Mã phản hồi (vnp_ResponseCode):
          </label>
          <label>{vnpayData.vnp_ResponseCode || "N/A"}</label>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Mã GD Tại VNPAY:</label>
          <label>{vnpayData.vnp_TransactionNo || "N/A"}</label>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Mã Ngân hàng:</label>
          <label>{vnpayData.vnp_BankCode || "N/A"}</label>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Thời gian thanh toán:</label>
          <label>{formattedPayDate}</label>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Kết quả:</label>
          <label>
            {isSuccess ? (
              <span className="text-blue-500">Thanh toán thành công</span>
            ) : (
              <span className="text-red-500">Thanh toán không thành công</span>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default VnpayResponse;
