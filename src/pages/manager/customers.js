import { useState, useEffect, useContext } from 'react';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AuthContext from '../contexts/AuthContext';
import axios from 'axios';

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
            <Header/>

            <div className="flex flex-1">
                <Sidebar className="w-1/4 bg-gray-200 p-4" />

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
                            <th className="py-2 px-4 border-b border-r w-1/10">Ngày Tạo</th>
                            <th className="py-2 px-4 border-b border-r w-1/10">Ngày Cập Nhật</th>
                            <th className="py-2 px-4 border-b border-r w-1/10">Ngày Tạo</th>
                            <th className="py-2 px-4 border-b border-r w-1/10">Hành Động</th>
                        </tr>
                        </thead>

                        <tbody>

                        </tbody>
                    </table>

                </main>
            </div>
        </div>
    )
}
export default ManagerCustomer;