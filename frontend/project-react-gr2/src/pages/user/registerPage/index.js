import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import register from "../../../assets/images/register.png";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    user_name: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    errorUsername: "",
    errorEmail: "",
    error: "",
  });

  const handleLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const isValidUsername = (user_name) => /^[a-zA-Z0-9]+$/.test(user_name);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCreateAccount = useCallback(
    async (event) => {
      event.preventDefault();
      setErrors({ errorUsername: "", errorEmail: "", error: "" });

      const { name, email, user_name, password } = formData;
      let valid = true;

      if (!isValidUsername(user_name)) {
        setErrors((prev) => ({
          ...prev,
          errorUsername: "ユーザー名に特殊文字を含めることはできません。",
        }));
        valid = false;
      }
      if (!isValidEmail(email)) {
        setErrors((prev) => ({
          ...prev,
          errorEmail: "メールの形式が正しくありません.",
        }));
        valid = false;
      }

      if (!valid) return;

      try {
        const response = await axios.post(
          "http://127.0.0.1:9000/api/auth/register",
          {
            name: name,
            user_name: user_name,
            email: email,
            password: password,
          }
        );

        localStorage.setItem("email", response.data.email);

        console.log(name, user_name, email, password);
        console.log(response.data);
        alert("Xác nhận email để kích hoạt tài khoản");
        navigate("/verify-account");
      } catch (err) {
        console.log(name, user_name, email, password);
        console.error("Error creating account:", err);
        setErrors((prev) => ({ ...prev, error: err.message }));
      }
    },
    [formData, navigate]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="font-[sans-serif] bg-gray-50 flex items-center p-4">
      <div className="w-full max-w-4xl max-md:max-w-xl mx-auto">
        <div className="bg-white grid md:grid-cols-2 gap-16 w-full sm:p-8 p-6 shadow-md rounded-md overflow-hidden">
          <div className="max-md:order-1 space-y-6">
            <img src={register} alt="Example" />
          </div>

          <form className="w-full" onSubmit={handleCreateAccount}>
            <div className="mb-8">
              <h3 className="text-gray-800 text-2xl font-bold">
                Đăng ký tài khoản
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Họ và tên
                </label>
                <div className="relative flex items-center">
                  <input
                    name="name"
                    type="text"
                    required
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                    placeholder="Nhập tên của bạn"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Tên đăng nhập
                </label>
                <div className="relative flex items-center">
                  <input
                    name="user_name"
                    type="text"
                    required
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.user_name}
                    onChange={handleChange}
                  />
                </div>
                {errors.errorUsername && (
                  <p className="text-red-500 text-sm">{errors.errorUsername}</p>
                )}
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Email
                </label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="text"
                    required
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.errorEmail && (
                  <p className="text-red-500 text-sm">{errors.errorEmail}</p>
                )}
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Mật khẩu
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    required
                    className="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                    placeholder="Nhập mật khẩu - ít nhất 6 ký tự"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
                />
                <label
                  htmlFor="terms"
                  className="text-gray-800 ml-3 block text-sm"
                >
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

export default Register;
