import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  // Lấy thông tin người dùng từ AuthContext
  const { user } = useContext(AuthContext);
  console.log(user);

  const fetchUsers = async () => {
    try {
        const token = localStorage.getItem('token');
        console.log("Token: ", token);  // Kiểm tra token trước khi gọi API
        
        if (!token) throw new Error('Chưa đăng nhập hoặc token không tồn tại.');

        // const response = await axios.get('/api/users/all');
        const response = await axios.get('/api/users/all', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        setUsers(response.data);
    } catch (err) {
        setError('Không thể tải dữ liệu người dùng.');
        console.error(err);
    }
};

  useEffect(() => {
    
    fetchUsers();
  }, []);

//   const handleLogout = async () => {
//     if (!user || !user.id) {
//         console.error("User ID is undefined.");
//         return;
//     }

//     try {
//         const response = await axios.put(`/api/users/${user.id}/logout`);
//         if (response.status === 200) {
//             console.log("User status updated successfully.");
//         }
//     } catch (err) {
//         console.error('Không thể cập nhật trạng thái người dùng trước khi đăng xuất.', err);
//     }

//     router.push('/login'); // Chuyển hướng về trang đăng nhập
//     };

  
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
    
        <Header/>

        <div className="flex flex-1">

              <Sidebar className="w-1/4 bg-gray-200 p-4" />

              {/* <main className="flex-1 p-6">
                <h2 className="text-3xl font-semibold mb-8 text-center">Danh Sách Người Dùng</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
              
                  <table className="min-w-full bg-white border border-gray-300 table-fixed">
                      <thead>
                      <tr>
                          <th className="py-2 px-4 border-b border-r w-1/5">Họ Tên</th>
                          <th className="py-2 px-4 border-b border-r w-1/5">Email</th>
                          <th className="py-2 px-4 border-b border-r w-1/5">Số Điện Thoại</th>
                          <th className="py-2 px-4 border-b border-r w-1/5">Quyền Truy Cập</th>
                          <th className="py-2 px-4 border-b w-1/5">Trạng Thái</th>
                      </tr>
                      </thead>
                      
                      <tbody>
                      {users.map(user => (
                          <tr key={user.id}>
                          <td className="py-2 px-4 border-b border-r text-center">{user.fullName}</td>
                          <td className="py-2 px-4 border-b border-r text-center">{user.email}</td>
                          <td className="py-2 px-4 border-b border-r text-center">{user.phone}</td>
                          <td className="py-2 px-4 border-b border-r text-center">{user.authority.name}</td>
                          <td className="py-2 px-4 border-b text-center flex items-center justify-center">
                              <span className={`w-3 h-3 rounded-full ${user.status === "Đang hoạt động" ? "bg-green-500" : "bg-red-500"}`}></span>
                              <span className="ml-2">{user.status}</span>
                          </td>
                          </tr>
                      ))}
                      </tbody>
                  </table>
              </main> */}
        </div>
        </div>
    );
};

export default AdminPage;
