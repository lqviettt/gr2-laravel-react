import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../utils/axiosClient";
import { toast } from "react-toastify";

const VerifyPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const email = localStorage.getItem("email");

  const verifyCode = async () => {
    try {
      const response = await axiosClient.post("/auth/verify", {
        email,
        code: verificationCode,
      });

      console.log(response);

      if (!response.ok) {
        toast.error("Mã xác minh không hợp lệ. Vui lòng thử lại.");
      }
      toast.success("Xác minh thành công! Chuyển hướng đến trang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCode();
  };

  return (
    <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg my-3">
      <h2 class="text-2xl font-semibold mb-4 text-center">
        Xác nhận tài khoản
      </h2>
      <h4>Nhập mã xác minh đã được gửi về email của bạn</h4>
      <br></br>
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label
            htmlFor="verificationCode"
            class="block text-sm font-medium text-gray-700"
          >
            Nhập mã xác nhận:
          </label>
          <input
            id="verificationCode"
            type="text"
            value={verificationCode}
            onChange={handleInputChange}
            class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          class="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Verify
        </button>
      </form>
      {message && (
        <p class="mt-4 text-center text-sm text-green-500">{message}</p>
      )}
    </div>
  );
};

export default VerifyPage;
