import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import register from "../../../assets/images/register.png";
import axiosClient from "../../../utils/axiosClient";
import { toast } from "react-toastify";
import { Section, ErrorMessage } from "../../../component/user";
import { InputField, Button, AuthForm } from "../../../components";

const initialFormData = {
  name: "",
  email: "",
  user_name: "",
  password: "",
};

const initialErrors = {
  errorUsername: "",
  errorEmail: "",
};

const isValidUsername = (user_name) => /^[a-zA-Z0-9]+$/.test(user_name);
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "terms") {
      setAgreed(checked);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateAccount = useCallback(
    async (event) => {
      event.preventDefault();
      setErrors(initialErrors);

      const { name, email, user_name, password } = formData;
      let valid = true;
      let newErrors = { ...initialErrors };

      if (!isValidUsername(user_name)) {
        newErrors.errorUsername = "Tên đăng nhập chỉ chứa chữ cái và số.";
        valid = false;
      }
      if (!isValidEmail(email)) {
        newErrors.errorEmail = "Email không hợp lệ.";
        valid = false;
      }
      setErrors(newErrors);

      if (!valid || !agreed) {
        if (!agreed) toast.error("Bạn phải đồng ý Điều khoản sử dụng.");
        return;
      }

      setLoading(true);
      try {
        const response = await axiosClient.post("/auth/register",
          { name, user_name, email, password }
        );
        const msg = response.data.message || "Đăng ký thành công!";
        toast.success(msg);

        // Tự động đăng nhập sau khi đăng ký
        try {
          const loginResp = await axiosClient.post('/auth/login', { user_name, password });
          const token = loginResp.data?.access_token || loginResp.data?.token || null;
          if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('isLoggedIn', 'true');
            // redirect to admin if admin user
            setTimeout(() => {
              if (user_name === 'admin') {
                navigate('/admin');
              } else {
                navigate('/');
              }
            }, 1000);
          } else {
            // nếu server không trả token, chuyển tới trang login
            setTimeout(() => navigate('/login'), 800);
          }
        } catch (loginErr) {
          // Nếu login tự động thất bại, chuyển tới trang login để user đăng nhập thủ công
          console.error('Auto-login failed', loginErr);
          setTimeout(() => navigate('/login'), 800);
        }
      } catch (err) {
        const apiErrors = err.response?.data?.error;
        if (apiErrors) {
          Object.values(apiErrors).forEach((messages) => {
            toast.error(messages[0]);
          });
        } else {
          toast.error(err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.");
        }
      } finally {
        setLoading(false);
      }
    },
    [formData, agreed, navigate]
  );

  return (
    <div className="bg-gray-50 flex items-center justify-center py-4 sm:py-6 lg:py-8">
      <Section>
        <div className="w-full max-w-6xl">
          {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden"> */}
            {/* <div className="grid lg:grid-cols-2 gap-0"> */}
              {/* Image Section */}
              {/* <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
                <img
                  src={register}
                  alt="Đăng ký tài khoản"
                  className="w-full max-w-md h-auto object-contain"
                />
              </div> */}

              {/* Form Section */}
              <div className="p-6 sm:p-8">
                <AuthForm
                  title="Đăng ký tài khoản"
                  subtitle="Tạo tài khoản để trải nghiệm tốt hơn"
                  onSubmit={handleCreateAccount}
                  submitButtonText="Đăng ký"
                  submitButtonLoading={loading}
                  className="max-w-none"
                  formClassName="space-y-6"
                  bodyClassName="p-0"
                >
                  <InputField
                    label="Họ và tên"
                    name="name"
                    type="text"
                    placeholder="Nhập tên của bạn"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="Tên đăng nhập"
                    name="user_name"
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.user_name}
                    onChange={handleChange}
                    required
                    error={errors.errorUsername}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={errors.errorEmail}
                  />
                  <InputField
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    placeholder="Ít nhất 6 ký tự"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    showPasswordToggle
                  />

                  <div className="flex items-start">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={agreed}
                      onChange={handleChange}
                    />
                    <label htmlFor="terms" className="text-gray-800 ml-3 block text-sm leading-relaxed">
                      Tôi đồng ý với{" "}
                      <button
                        type="button"
                        onClick={() => alert("Điều khoản sử dụng")}
                        className="text-blue-600 font-semibold hover:underline bg-transparent border-none p-0"
                      >
                        Điều khoản sử dụng
                      </button>{" "}
                      và{" "}
                      <button
                        type="button"
                        onClick={() => alert("Chính sách bảo mật")}
                        className="text-blue-600 font-semibold hover:underline bg-transparent border-none p-0"
                      >
                        Chính sách bảo mật
                      </button>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    loading={loading}
                    loadingText="Đang đăng ký..."
                  >
                    Đăng ký
                  </Button>

                  <p className="text-gray-800 text-sm text-center">
                    Bạn đã có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="text-blue-600 font-semibold hover:underline bg-transparent border-none p-0"
                    >
                      Đăng nhập ngay
                    </button>
                  </p>
                </AuthForm>
              </div>
            {/* </div> */}
          {/* </div> */}
        </div>
      </Section>
    </div>
  );
};

export default Register;
