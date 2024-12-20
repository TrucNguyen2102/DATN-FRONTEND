import React , { useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AuthContext from '../../contexts/AuthContext';

const ManagerHeader = () => {
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ context
  const router = useRouter();

  const handleLogout = async () => {
    // Hiển thị cửa sổ xác nhận
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    
    if (!confirmLogout) {
      return; // Nếu người dùng nhấn "Hủy", thoát khỏi hàm mà không thực hiện gì
    }

    if (!user || !user.id) {
        console.error("User ID is undefined.");
        return;
    }

    try {
        const response = await axios.put(`/api/users/${user.id}/logout`);
        if (response.status === 200) {
            console.log("User status updated successfully.");
        }
    } catch (err) {
        console.error('Không thể cập nhật trạng thái người dùng trước khi đăng xuất.', err);
    }

    router.push('/login'); // Chuyển hướng về trang đăng nhập
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Trang Quản Lý</h1>
      <div className="flex items-center">
        {/* {user && <h3 className="text-lg mr-4">Xin chào, {user.fullName}</h3>} */}
        {user && <h3 className="text-lg mr-4">Xin chào, {user.fullName}</h3>}
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Đăng Xuất
        </button>
      </div>
    </header>
  );
};

export default ManagerHeader;