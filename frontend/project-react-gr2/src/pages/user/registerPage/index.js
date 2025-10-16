import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import register from "../../../assets/images/register.png";
import axiosClient from "../../../utils/axiosClient";
import { toast } from "react-toastify";

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
    const { name, value, type, checked } = e.target;
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
    [formData, agreed]
  );

  return (
    <div className="font-[sans-serif] bg-gray-50 flex items-center p-4">
      <div className="w-full max-w-4xl max-md:max-w-xl mx-auto">
        <div className="bg-white grid md:grid-cols-2 gap-16 w-full sm:p-8 p-6 shadow-md rounded-md overflow-hidden">
          <div className="max-md:order-1 space-y-6">
            <img src={register} alt="Register" />
          </div>
          <form className="w-full" onSubmit={handleCreateAccount} autoComplete="off">
            <div className="mb-8">
              <h3 className="text-gray-800 text-2xl font-bold">Đăng ký tài khoản</h3>
            </div>
            <div className="space-y-6">
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
                type="text"
                placeholder="Nhập email"
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
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
                  checked={agreed}
                  onChange={handleChange}
                />
                <label htmlFor="terms" className="text-gray-800 ml-3 block text-sm">
                  Tôi đồng ý{" "}
                  <span
                    onClick={() => alert("Điều khoản sử dụng")}
                    className="text-blue-600 font-semibold hover:underline ml-1 cursor-pointer"
                  >
                    Điều khoản sử dụng
                  </span>
                </label>
              </div>
            </div>
            <div className="!mt-8">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm tracking-wider font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none"
              >
                Đăng ký
              </button>
            </div>
            <p className="text-gray-800 text-sm mt-6 text-center">
              Bạn đã có tài khoản?{" "}
              <span
                onClick={handleLogin}
                className="text-blue-600 font-semibold hover:underline ml-1 cursor-pointer"
              >
                Quay lại đăng nhập
              </span>
            </p>
          </form>
        </div>
      </div>
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
