import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../utils/axiosClient";
import { toast } from "react-toastify";
import { Section, ErrorMessage } from "../../../component/user";
import { InputField, Button, AuthForm } from "../../../components";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Code + Password
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate email format
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Step 1: Request password reset email
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post("/auth/forgot-password", { email });
      toast.success(response.data.message || "Mã xác minh đã được gửi đến email của bạn");
      setStep(2);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Có lỗi xảy ra. Vui lòng kiểm tra email.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password with code
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!resetCode) {
      setError("Vui lòng nhập mã xác minh");
      return;
    }

    if (!newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setError("Mật khẩu không trùng khớp");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post("/auth/reset-password", {
        email,
        reset_code: resetCode,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirm,
      });

      toast.success(response.data.message || "Đặt lại mật khẩu thành công!");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Có lỗi xảy ra. Vui lòng thử lại.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setError("");
    setResetCode("");
    setNewPassword("");
    setNewPasswordConfirm("");
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center py-2 sm:py-6 lg:py-8 min-h-screen">
      <Section>
        <div className="max-w-xl w-full">
          {step === 1 ? (
            // Step 1: Email Input
            <AuthForm
              title="Quên mật khẩu"
              subtitle="Nhập email để nhận mã xác minh"
              onSubmit={handleRequestReset}
              submitButtonText="Gửi mã xác minh"
              submitButtonLoading={loading}
              className="max-w-none"
              formClassName="space-y-6"
            >
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
              />

              {error && <ErrorMessage message={error} />}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
                loadingText="Đang gửi..."
              >
                Gửi mã xác minh
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-blue-600 hover:underline font-semibold bg-transparent border-none p-0"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </AuthForm>
          ) : (
            // Step 2: Code + New Password
            <AuthForm
              title="Đặt lại mật khẩu"
              subtitle="Nhập mã xác minh và mật khẩu mới"
              onSubmit={handleResetPassword}
              submitButtonText="Đặt lại mật khẩu"
              submitButtonLoading={loading}
              className="max-w-none"
              formClassName="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  Mã xác minh đã được gửi đến: <strong>{email}</strong>
                </p>
              </div>

              <InputField
                label="Mã xác minh"
                name="reset_code"
                type="text"
                placeholder="Nhập mã xác minh từ email"
                value={resetCode}
                onChange={(e) => {
                  setResetCode(e.target.value);
                  setError("");
                }}
                required
              />

              <InputField
                label="Mật khẩu mới"
                name="new_password"
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                required
                showPasswordToggle
              />

              <InputField
                label="Xác nhận mật khẩu"
                name="new_password_confirm"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={newPasswordConfirm}
                onChange={(e) => {
                  setNewPasswordConfirm(e.target.value);
                  setError("");
                }}
                required
                showPasswordToggle
              />

              {error && <ErrorMessage message={error} />}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
                loadingText="Đang đặt lại..."
              >
                Đặt lại mật khẩu
              </Button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBackToStep1}
                  className="flex-1 text-blue-600 hover:underline font-semibold bg-transparent border-none p-0"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="flex-1 text-gray-600 hover:underline font-semibold bg-transparent border-none p-0"
                >
                  Đăng nhập
                </button>
              </div>
            </AuthForm>
          )}
        </div>
      </Section>
    </div>
  );
};

export default ResetPassword;
