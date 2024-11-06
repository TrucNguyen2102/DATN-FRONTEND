import { useState, useEffect, useContext } from 'react';
import ManagerHeader from '../components/Header/ManagerHeader';
import AuthContext from '../contexts/AuthContext';
import axios from 'axios';
import { format } from 'date-fns'; // Import format từ date-fns
import ManagerSidebar from '../components/Sidebar/ManagerSidebar';

const ManagerCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState('');

    // Lấy thông tin người dùng từ AuthContext
    const { user } = useContext(AuthContext);
    console.log(user);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('/api/users/managers/customers/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
                
            );
            console.log(response.data); // Kiểm tra dữ liệu trả về
            if (Array.isArray(response.data)) {
                setCustomers(response.data);
            } else {
                setError('Dữ liệu không hợp lệ. Vui lòng kiểm tra API.');
            }
        } catch (err) {
            setError('Không thể tải dữ liệu khách hàng.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleRefresh = () => {
        window.location.reload(); // Tải lại trang
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <ManagerHeader/>

            <div className="flex flex-1">
                <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Danh Sách Khách Hàng</h1>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                   <div className="mb-4">
                    <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                                    Làm Mới
                        </button>
                   </div>

                    

                    <table className="min-w-full bg-white border border-gray-300 table-fixed">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-r w-1/10">ID</th>
                            <th className="py-2 px-4 border-b border-r w-1/10">Họ Tên</th>
                            <th className="py-2 px-4 border-b border-r w-1/10">Số Điện Thoại</th>
                            <th className="py-2 px-4 border-b border-r w-1/10">Email</th>
                            <th className="py-2 px-4 border-b border-r w-1/10">Trạng Thái</th>
                            <th className="py-2 px-4 border-b border-r w-1/10">Quyền Truy Cập</th>
                            <th className="py-2 px-4 border-b border-r w-1/10">Ngày Tạo</th>
                            <th className="py-2 px-4 border-b border-r w-1/10">Ngày Cập nhật</th>
                            
                        </tr>
                        </thead>

                        <tbody>
                            {customers.map(user => (
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
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </main>
            </div>
        </div>
    )
}
export default ManagerCustomer;