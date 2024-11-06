import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import AdminHeader from '../components/Header/AdminHeader';
import AdminSidebar from '../components/Sidebar/AdminSidebar';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  const [greeting, setGreeting] = useState('');
  // Lấy thông tin người dùng từ AuthContext
  const { user } = useContext(AuthContext);
  console.log(user);

  //hàm tải danh sách người dùng
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

    const hours = new Date().getHours();
        if (hours < 12) {
            setGreeting('Chào buổi sáng');
        } else if (hours < 18) {
            setGreeting('Chào buổi chiều');
        } else {
            setGreeting('Chào buổi tối');
        }
  }, []);


    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
    
        <AdminHeader/>

        <div className="flex flex-1">

              <AdminSidebar className="w-1/4 bg-gray-200 p-4" />
              <div className="flex-1 p-6 text-center">
                    <h1 className="text-2xl font-bold">{greeting}, {user?.fullName}!</h1>
                    <p>Chào mừng bạn đến với giao diện của người quản trị.</p>
                    
                </div>
        </div>
        </div>
    );
};

export default AdminPage;
