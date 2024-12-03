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

    // Thêm các state cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 3; // Số bản ghi mỗi trang

    // Lấy danh sách người dùng từ API
    const fetchUsers = async (page) => {
        try {
            const response = await axios.get(`/api/users/all`, {
                params: {
                    page: page - 1, // Backend thường bắt đầu từ 0
                    size: 5, // Số lượng người dùng mỗi trang
                },
            });
            setUsers(response.data.content); // Cập nhật danh sách người dùng
            setTotalPages(response.data.totalPages); // Tổng số trang
            setCurrentPage(response.data.number + 1); // Trang hiện tại
        } catch (error) {
            console.error('Lỗi khi tải người dùng:', error);
            setUsers([]); // Nếu lỗi, để danh sách người dùng rỗng
        }
    };
    

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handleAddManager = () => {
        setShowForm(!showForm);
    };

    const handleSuccess = (newUser) => {
        setUsers([...users, newUser]);
        setShowForm(false);
    };

    // Xử lý chuyển trang
    // const handlePageChange = (newPage) => {
    //     if (newPage > 0 && newPage <= totalPages) {
    //         setCurrentPage(newPage);
    //     }
    // };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
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
                                <th className="py-2 px-4 border-b border-r w-1/10">Ngày Sinh</th>
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
                            {users?.length > 0 ? (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td className="py-2 px-4 border-b border-r text-center">{user.id}</td>
                                        <td className="py-2 px-4 border-b border-r text-center">{user.fullName}</td>
                                        <td className="py-2 px-4 border-b border-r text-center">{user.birthDay || "Chưa cập nhật"}</td>
                                        <td className="py-2 px-4 border-b border-r text-center">{user.phone}</td>
                                        <td className="py-2 px-4 border-b border-r text-center">{user.email}</td>
                                        <td className="py-2 px-4 border-b border-r text-center">
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
                                        <td className="py-2 px-4 border-b border-r text-center">
                                            {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm:ss') : "N/A"}
                                        </td>
                                        <td className="py-2 px-4 border-b border-r text-center">
                                            {user.updatedAt ? format(new Date(user.updatedAt), 'dd/MM/yyyy HH:mm:ss') : "N/A"}
                                        </td>
                                        <td className="py-2 px-4 border text-center">
                                            {(user.roles.includes('ADMIN') || user.roles.includes('MANAGER')) && (
                                                user.status === "BLOCKED" ? (
                                                    <button onClick={() => handleUnlock(user.id)} className="bg-green-400 text-white py-1 px-2 rounded hover:bg-green-500 transition duration-200">
                                                        Mở Khóa
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleLock(user.id)} className="bg-red-400 text-white py-1 px-2 rounded hover:bg-red-500 transition duration-200">
                                                        Khóa
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-4">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                    {/* Điều hướng phân trang */}
                    <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 mx-1 bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                    Trước
                                </button>
                                <span className="px-4 py-2">
                                    Trang {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 mx-1 bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                    Tiếp
                                </button>
                    </div>
                </main>
            </div>
        </div>
    )
};

export default AdminUsers;
