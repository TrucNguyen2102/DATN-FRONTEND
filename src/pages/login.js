// pages/login.js
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        {/* <h1 className="text-3xl font-bold text-center mb-8">PHẦN MỀM KINH DOANH DỊCH VỤ GIẢI TRÍ</h1> */}
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
