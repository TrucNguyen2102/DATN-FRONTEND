import { useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import AuthContext from '../contexts/AuthContext';

const LoginForm = () => {
  const { login } = useContext(AuthContext); // Lấy hàm login từ AuthContext
  const [formData, setFormData] = useState({
    phone: '', 
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const router = useRouter(); // Define router

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('api/users/login', formData);
      console.log('SignIn success:', response.data);

      // Tạo đối tượng user với thông tin từ API trả về
      const userData = {
        id: response.data.id,
        phone: response.data.phone,
        authority: response.data.authority,
        fullName: response.data.fullName,
      };

      // Gọi hàm login từ AuthContext để lưu thông tin
      login(userData);

      // Điều hướng theo quyền của người dùng
      if (response.data.authority === 'ADMIN') {
        router.push('/admin/home');
      } else if (response.data.authority === 'OWNER') {
        router.push('/owner/home');
      } else if (response.data.authority === 'CUSTOMER') {
        router.push('/customer/home');
      }
      alert('Đăng nhập thành công.')
    } catch (error) {
      alert('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng Nhập</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Số Điện Thoại</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-base"
          style={{ fontSize: '16px', lineHeight: '1.5' }} // Add font size
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Mật Khẩu</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'} // Toggle input type
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-base"
            style={{ fontSize: '16px', lineHeight: '1.5' }} // Add font size
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
           
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
      >
        Đăng Nhập
      </button>

      <div className="mt-4 text-center">
        <p className="text-gray-700 text-sm">Chưa có tài khoản? <span onClick={() => router.push('/register')} className="text-blue-500 cursor-pointer hover:underline">Đăng Ký</span></p>
      </div>
    </form>
  );
};

export default LoginForm;
