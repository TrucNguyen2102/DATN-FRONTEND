import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../components/Header/AdminHeader';
import AdminSidebar from '../components/Sidebar/AdminSidebar';

const Dashboard = () => {
    const [error, setError] = useState('');
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalApiCalls, setTotalApiCalls] = useState(0);
    const [logs, setLogs] = useState([]);

    // Gọi API khi component được load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("Token: ", token);  // Kiểm tra token trước khi gọi API
            
                if (!token) throw new Error('Chưa đăng nhập hoặc token không tồn tại.');

                // Gọi API lấy tổng số người dùng
                const usersResponse = await axios.get('/api/users/admins/total-users', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setTotalUsers(usersResponse.data);

                // Gọi API lấy tổng doanh thu
                // const revenueResponse = await axios.get('/api/users/admins/total-revenue');
                // setTotalRevenue(revenueResponse.data);

                // Gọi API lấy tổng số API được gọi
                const apiCallsResponse = await axios.get('/api/users/admins/total-api-calls', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setTotalApiCalls(apiCallsResponse.data);

                // Gọi API lấy logs hệ thống
                // const logsResponse = await axios.get('/api/admin/logs');
                // setLogs(logsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <AdminHeader/>

            <div className="flex flex-1">
                <AdminSidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Dashboard Quản Trị</h1>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {/* Thông tin thống kê tổng quan */}
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">Tổng Số Người Dùng</h2>
                            <p className="text-3xl mt-4">{totalUsers}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">Tổng Doanh Thu</h2>
                            <p className="text-3xl mt-4">{totalRevenue.toLocaleString()} VNĐ</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">Tổng Số API Được Gọi</h2>
                            <p className="text-3xl mt-4">{totalApiCalls}</p>
                        </div>
                    </div>

                    {/* Biểu đồ thống kê (nếu cần) */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-bold">Biểu đồ thống kê</h2>
                        {/* Placeholder cho biểu đồ */}
                        <div className="w-full h-64 bg-gray-200 mt-4"></div>
                    </div>

                    {/* Logs hệ thống */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Logs Hệ Thống Gần Đây</h2>
                        <ul className="space-y-2">
                            {logs.map((log, index) => (
                                <li key={index} className="border-b py-2">{log.message}</li>
                            ))}
                        </ul>
                    </div>
                </main>

                
            </div>
        </div>
        
    );
};

export default Dashboard;
