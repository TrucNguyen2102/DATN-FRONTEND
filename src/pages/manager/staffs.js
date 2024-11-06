import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import ManagerHeader from '../components/Header/ManagerHeader';
import AuthContext from '../contexts/AuthContext';
import axios from 'axios';
import AddStaffForm from '../components/manager/AddStaffForm';
import { format } from 'date-fns'; // Import format từ date-fns
import ManagerSidebar from '../components/Sidebar/ManagerSidebar';


const StaffsPage = () => {
    const [staffs, setStaffs] = useState([]);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false); // Trạng thái để hiển thị form
    const router = useRouter();
    const [selectedUser, setSelectedUser] = useState(null); // Thông tin nhân viên được chọn để sửa
    const [editingStaff, setEditingStaff] = useState(null);


    // Lấy thông tin người dùng từ AuthContext
    const { user } = useContext(AuthContext);
    console.log(user);

    

    const fetchStaffs = async () => {
        try {
            const response = await axios.get('/api/users/managers/staffs/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data); // Kiểm tra dữ liệu trả về
            if (Array.isArray(response.data)) {
                setStaffs(response.data);
            } else {
                setError('Dữ liệu không hợp lệ. Vui lòng kiểm tra API.');
            }
        } catch (err) {
            setError('Không thể tải dữ liệu nhân viên.');
            console.error(err);
        }
    };
    
    

    useEffect(() => {
        fetchStaffs();
    }, []);

    const handleAddStaff = () => {
        setShowForm(!showForm); // Chuyển đổi trạng thái hiển thị form
    };

    const handleRefresh = () => {
        window.location.reload(); // Tải lại trang
    };

    // const handleEdit = (id) => {
    //     // Thực hiện hành động sửa
    //     setSelectedUser(user); // Lưu thông tin nhân viên để sửa
    //     setShowForm(true);
    //     console.log(`Chỉnh sửa nhân viên với ID: ${id}`);
    // };

    const handleEdit = (staff) => {
        setEditingStaff(staff); // Cập nhật state cho nhân viên hiện tại
        setShowForm(true); // Mở form
    };


    const handleLock = async (id) => {
        try {
            const confirmLock = window.confirm("Bạn có chắc chắn muốn khóa nhân viên này?");
            if (confirmLock) {
                const token = localStorage.getItem('token');
                console.log("Token: ", token);  // Kiểm tra token trước khi gọi API
                
                if (!token) throw new Error('Chưa đăng nhập hoặc token không tồn tại.');

                await axios.put(`/api/users/managers/staffs/lock/${id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                fetchStaffs(); // Cập nhật danh sách sau khi khóa thành công
            }
            
        } catch (err) {
            console.error('Không thể khóa nhân viên:', err);
        }
    };


    const handleUnlock = async (id) => {
        try {
            const confirmLock = window.confirm("Bạn có chắc chắn muốn mở khóa nhân viên này?");
            if (confirmLock) {
                await axios.put(`/api/users/managers/staffs/unlock/${id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                fetchStaffs(); // Cập nhật danh sách sau khi mở khóa thành công
            }
            
        } catch (err) {
            console.error('Không thể mở khóa nhân viên:', err);
        }
    };

    const handleSuccess = () => {
        setShowForm(false); // Ẩn form
        fetchUsers(); // Cập nhật lại danh sách người dùng
    };
    

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <ManagerHeader/>

            <div className="flex flex-1">
                <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Nhân Viên</h1>
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    
                    <div className="mb-4">
                        <button onClick={handleAddStaff} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-5">
                            {showForm ? 'Ẩn Form' : 'Thêm Nhân Viên'}
                        </button>

                        <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                            Làm Mới
                        </button>
                    </div>


                    {showForm && <AddStaffForm staffData={editingStaff} onClose={() => setShowForm(false)} onSuccess={handleSuccess} />}

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
                            {staffs.map(user => (
                                <tr key={user.id}>
                                    <td className="py-2 px-4 border-b border-r text-center">{user.id}</td>
                                    <td className="py-2 px-4 border-b border-r text-center">{user.fullName}</td>
                                    <td className="py-2 px-4 border-b border-r text-center">{user.phone}</td>
                                    <td className="py-2 px-4 border-b border-r text-center">{user.email}</td>
                                    
                                    
                                    {/* <td className="py-2 px-4 border-b text-center flex items-center justify-center"> */}
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
                                        {user.roles && user.roles.length > 0 ? ( // Kiểm tra length nếu là mảng
                                            <ul >
                                                {user.roles.map((role, index) => (
                                                    <li key={index}>{role}</li> // role là tên vai trò
                                                ))}
                                            </ul>
                                        ) : (
                                            'Không có vai trò'
                                        )}
                                    </td>

                                    <td className="py-2 px-4 border-b border-r text-center">{format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm:ss')}</td>
                                    <td className="py-2 px-4 border-b border-r text-center">{format(new Date(user.updatedAt), 'dd/MM/yyyy HH:mm:ss')}</td>

                                    <td className="py-2 px-4 border text-center">
                                        {/* <button onClick={() => handleEdit(user.id)} className="bg-yellow-400 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-500 transition duration-200">
                                            Sửa 
                                        </button> */}

                                        <button onClick={() => handleEdit(user)} className="bg-yellow-400 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-500 transition duration-200">
                                            Sửa 
                                        </button>
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

export default StaffsPage; 