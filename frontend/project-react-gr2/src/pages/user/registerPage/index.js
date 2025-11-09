import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import register from "../../../assets/images/register.png";
import axiosClient from "../../../utils/axiosClient";
import { toast } from "react-toastify";
import { Section, ErrorMessage } from "../../../component/user";

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

      try {
        const response = await axiosClient.post("/auth/register", 
          { name, user_name, email, password }
        );
        const msg = response.data.message || "Đăng ký thành công!";
        localStorage.setItem("email", response.data.data.email);
        toast.success(msg);
        setTimeout(() => {
            navigate("/verify-account"); 
        }, 2000);
      } catch (err) {
        const apiErrors = err.response?.data?.error;
        if (apiErrors) {
          Object.values(apiErrors).forEach((messages) => {
            toast.error(messages[0]);
          });
        } else {
          toast.error(err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.");
        }
      }
    },
    [formData, agreed, navigate]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 sm:py-6 lg:py-8">
      <Section>
        <div className="w-full max-w-6xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
                <img
                  src={register}
                  alt="Đăng ký tài khoản"
                  className="w-full max-w-md h-auto object-contain"
                />
              </div>

              {/* Form Section */}
              <div className="p-6 sm:p-8">
                <div className="mb-8">
                  <h3 className="text-gray-800 text-2xl sm:text-3xl font-bold text-center lg:text-left">
                    Đăng ký tài khoản
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 text-center lg:text-left">
                    Tạo tài khoản để trải nghiệm tốt hơn
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleCreateAccount} autoComplete="off">
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
                    placeholder="Nhập mật khẩu - ít nhất 6 ký tự"
                    value={formData.password}
                    onChange={handleChange}
                    required
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

                  <div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 text-sm font-semibold tracking-wide rounded-lg bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Đăng ký
                    </button>
                  </div>

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
                </form>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
  error,
}) => (
  <div>
    <label className="text-gray-800 text-sm mb-2 block">{label}</label>
    <div className="relative flex items-center">
      <input
        name={name}
        type={type}
        required={required}
        className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default Register;
