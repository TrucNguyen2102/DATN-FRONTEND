import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDay: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Trạng thái để hiện/ẩn mật khẩu
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return phoneRegex.test(email);
  }
  // // Kiểm tra định dạng email
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (!emailRegex.test(email)) {
  //     setError('Email không đúng định dạng!');
  //     return;
  // }

  // Kiểm tra định dạng số điện thoại
  // const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  // if (!phoneRegex.test(phone)) {
  //     setError('Số điện thoại không đúng định dạng!');
  //     return;
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    const { fullName, birthDay, phone, email, password, confirmPassword } = formData;

    // Kiểm tra mật khẩu và xác nhận mật khẩu khớp nhau
    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    // Kiểm tra độ mạnh của mật khẩu
    if (!validatePassword(password)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email bị sai định dạng.');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Số điện thoại bị sai định dạng.');
      return;
    }

    // Nếu mật khẩu hợp lệ, tiếp tục gửi yêu cầu đăng ký
    try {
      const response = await axios.post('/api/users/customers/register', formData);
      console.log('Register success:', response.data);
      alert("Đăng Ký Thành Công. Bạn có thể đăng nhập ngay.");
      router.push('/login');
    } catch (error) {
      // setError('Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.');
      // console.error(error);
      if (error.response && error.response.status === 400) {
        // Lấy thông báo lỗi từ backend
        setError(error.response.data);
      } else {
        setError('Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.');
      }
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="fullName">
            Họ Và Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="birthDay">
            Ngày Sinh <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="birthDay"
            id="birthDay"
            value={formData.birthDay}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="phone">
            Số Điện Thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="password">
            Mật Khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'} // Hiển thị mật khẩu nếu showPassword là true
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-semibold mb-2"
            htmlFor="confirmPassword"
          >
            Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'} // Hiển thị mật khẩu xác nhận nếu showPassword là true
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)} // Thay đổi trạng thái showPassword
          />
          <label className="ml-2 text-sm" htmlFor="showPassword">Hiển thị mật khẩu</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Đăng Ký
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-700 text-sm">Bạn đã có tài khoản? <span onClick={() => router.push('/login')} className="text-blue-500 cursor-pointer hover:underline">Đăng Nhập</span></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
