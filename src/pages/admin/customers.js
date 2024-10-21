import { useState, useContext, useEffect} from 'react';
import { useRouter } from 'next/router';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AuthContext from '../contexts/AuthContext';
import axios from 'axios';

const CustomersPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');


    const router = useRouter();

    // Lấy thông tin người dùng từ AuthContext
    const { user } = useContext(AuthContext);
    console.log(user);

    useEffect(() => {
        // Lấy danh sách người dùng từ API
        const fetchUsers = async () => {
          try {
            const response = await axios.get('/api/users/customers/all'); // Thay đổi đường dẫn API tùy theo cấu trúc của bạn
            setUsers(response.data);
          } catch (err) {
            setError('Không thể tải dữ liệu khách hàng.');
            console.error(err);
          }
        };
        
        fetchUsers();
      }, []);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header/>

            <div className="flex flex-1">
                <Sidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">

                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Khách Hàng</h1>
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
                </main>
            </div>
        </div>

        
    )
};

export default CustomersPage;