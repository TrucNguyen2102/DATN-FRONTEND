import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AdminHeader from '../components/Header/AdminHeader';
import AuthContext from '../contexts/AuthContext';
import AddManagerForm from '../components/admin/AddManagerForm';
import { format } from 'date-fns'; // Import format từ date-fns
import AdminSidebar from '../components/Sidebar/AdminSidebar';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    // Lấy thông tin người dùng từ AuthContext
    const { user } = useContext(AuthContext);
    console.log(user);

    // Lấy danh sách người dùng từ API
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

    const handleAddManager = () => {
        setShowForm(!showForm);
    };

    const handleSuccess = (newUser) => {
        setUsers([...users, newUser]);
        setShowForm(false);
    };

    const handleRefresh = () => {
        window.location.reload(); // Tải lại trang
    };

    // Hàm khóa người dùng
    const handleLock = async (userId) => {
        try {
            const confirmLock = window.confirm("Bạn có chắc chắn muốn khóa người dùng này?");
            if (confirmLock) {
                const token = localStorage.getItem('token');
                console.log("Token: ", token);  // Kiểm tra token trước khi gọi API
                
                if (!token) throw new Error('Chưa đăng nhập hoặc token không tồn tại.');

                await axios.put(`/api/users/admins/managers/lock/${userId}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                fetchUsers(); // Cập nhật danh sách sau khi khóa thành công
            }
            
        } catch (err) {
            console.error('Không thể khóa người dùng:', err);
        }
    };

    // Hàm mở khóa người dùng
    const handleUnlock = async (userId) => {
        try {
            const confirmLock = window.confirm("Bạn có chắc chắn muốn mở khóa người dùng này?");
            if (confirmLock) {
                await axios.put(`/api/users/admins/managers/unlock/${userId}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                fetchUsers(); // Cập nhật danh sách sau khi mở khóa thành công
            }
            
        } catch (err) {
            console.error('Không thể mở khóa người dùng:', err);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <AdminHeader/>

            <div className="flex flex-1">
                <AdminSidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Người Dùng</h1>
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <div className="mb-4">
                        <button onClick={handleAddManager} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-5">
                            {showForm ? 'Ẩn Form' : 'Thêm Tài Khoản Quản Lý'}
                        </button>

                        <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                            Làm Mới
                        </button>

                    </div>

                    {showForm && <AddManagerForm onSuccess={handleSuccess} />}

                    <table className="min-w-full bg-white border border-gray-300 table-fixed">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-r w-1/10">ID</th>
                                <th className="py-2 px-4 border-b border-r w-1/10">Họ Tên</th>
                                <th className="py-2 px-4 border-b border-r w-1/10">Số Điện Thoại</th>
                                <th className="py-2 px-4 border-b border-r w-1/10">Email</th>
                                <th className="py-2 px-4 border-b border-r w-1/10">Trạng Thái</th>
                                <th className="py-2 px-4 border-b border-r w-1/12">Quyền Truy Cập</th>
                                <th className="py-2 px-4 border-b border-r w-1/12">Ngày Tạo</th>
                                <th className="py-2 px-4 border-b border-r w-1/12">Ngày Cập nhật</th>
                                <th className="py-2 px-4 border-b w-1/10">Hành Động</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="py-2 px-4 border-b border-r text-center">{user.id}</td>
                                    <td className="py-2 px-4 border-b border-r text-center">{user.fullName}</td>
                                    <td className="py-2 px-4 border-b border-r text-center">{user.phone}</td>
                                    <td className="py-2 px-4 border-b border-r text-center">{user.email}</td>
                                    <td className="py-2 px-4 border-b border-r text-center ">
                                        {/* Kiểm tra trạng thái và hiển thị màu */}
                                        {user.status === "ACTIVE" ? (
                                            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                                        ) : (
                                            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                                        )}
                                        <span className="ml-2">{user.status}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-r text-center">
                                        {user.roles && user.roles.length > 0 ? (
                                            <ul>
                                                {user.roles.map((role, index) => (
                                                    <li key={index}>{role}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            'Không có vai trò'
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b border-r text-center">{format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm:ss')}</td>
                                    <td className="py-2 px-4 border-b border-r text-center">{format(new Date(user.updatedAt), 'dd/MM/yyyy HH:mm:ss')}</td>
                                    <td className="py-2 px-4 border text-center">
                                        {/* <button onClick={() => handleEdit(user)} className="bg-yellow-400 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-500 transition duration-200">
                                            Sửa 
                                        </button> */}
                                        {user.status === "BLOCKED" ? (
                                            <button onClick={() => handleUnlock(user.id)} className="bg-green-400 text-white py-1 px-2 rounded hover:bg-green-500 transition duration-200">
                                                Mở Khóa
                                            </button>
                                        ) : (
                                            <button onClick={() => handleLock(user.id)} className="bg-red-400 text-white py-1 px-2 rounded hover:bg-red-500 transition duration-200">
                                                Khóa
                                            </button>
                                        )}
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

export default AdminUsers;
