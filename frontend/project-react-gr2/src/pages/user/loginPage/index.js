import { useNavigate } from "react-router-dom";
import { React, useState } from "react";
import axiosClient from "../../../utils/axiosClient";
import { toast } from "react-toastify";
import { Section, ErrorMessage } from "../../../component/user";
import { InputField, Button, AuthForm, SocialLoginButtons } from "../../../components";

const Login = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  const handleForgotPassword = () => {
    navigate("/reset-password");
  };

  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginn = async () => {
    setLoading(true);
    setError("");

    try {
        const response = await axiosClient.post("/auth/login",
          {user_name, password }
        );

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("isLoggedIn", "true");

      const userResponse = await axiosClient.get("/profile", {
        headers: {
          Authorization: `Bearer ${response.data.access_token}`,
        },
      });

      console.log("User profile:", userResponse.data);
      toast.success("Đăng nhập thành công!");

      setTimeout(() => {
        if (userResponse.data && userResponse.data.is_admin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);

    } catch (err) {
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    toast.info(`${provider} login chưa được triển khai`);
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center py-2 sm:py-6 lg:py-8">
      <Section>
        <div className="max-w-md w-full">
          <AuthForm
            title="Đăng nhập"
            onSubmit={(e) => {
              e.preventDefault();
              handleLoginn();
            }}
            submitButtonText="Đăng nhập"
            submitButtonLoading={loading}
            className="max-w-none"
            formClassName="space-y-6"
          >
            {/* Social Login Buttons */}
            <SocialLoginButtons
              onGoogleLogin={() => handleSocialLogin('Google')}
              onFacebookLogin={() => handleSocialLogin('Facebook')}
              onGithubLogin={() => handleSocialLogin('GitHub')}
              disabled={loading}
            />

            <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
              <p className="mx-4 mb-0 text-center font-semibold text-gray-600">Hoặc</p>
            </div>

            <InputField
              label="Tên tài khoản"
              name="username"
              type="text"
              placeholder="Nhập tên tài khoản"
              value={user_name}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <InputField
              label="Mật khẩu"
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              showPasswordToggle
            />

            {error && <ErrorMessage message={error} />}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm text-gray-800"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-blue-600 hover:underline font-semibold bg-transparent border-none p-0"
                >
                  Quên mật khẩu
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              loadingText="Đang đăng nhập..."
            >
              Đăng nhập
            </Button>

            <p className="text-gray-800 text-sm text-center">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={handleRegister}
                className="text-blue-600 hover:underline font-semibold bg-transparent border-none p-0"
              >
                Đăng ký ngay
              </button>
            </p>
          </AuthForm>
        </div>
      </Section>
    </div>
  );
};

export default Login;
