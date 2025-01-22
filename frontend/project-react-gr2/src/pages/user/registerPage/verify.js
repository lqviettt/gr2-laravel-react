import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch("http://127.0.0.1:9000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Verification successful!");
        navigate("/login");
      } else {
        setMessage(data.message || "Invalid verification code.");
      }
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
