import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../components/Header/AdminHeader';
import AdminSidebar from '../components/Sidebar/AdminSidebar';

const Dashboard = () => {
    const [error, setError] = useState('');
    const [totalUsers, setTotalUsers] = useState(0);
    const [isActiveUsers, setIsActiveUsers] = useState(0);
    const [isInActiveUsers, setIsInActiveUsers] = useState(0);
    const [isLockUsers, setIsLockUsers] = useState(0);
    const [isGuest, setIsGuest] = useState(0);

    const [logs, setLogs] = useState([]);

    // Gọi API khi component được load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("Token: ", token);  // Kiểm tra token trước khi gọi API
            
                if (!token) throw new Error('Chưa đăng nhập hoặc token không tồn tại.');

                // Gọi API lấy tổng số người dùng
                const totalUsersResponse = await axios.get('/api/users/admins/total-users', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Gọi API lấy tổng số người dùng hoạt động
                const activeUsersResponse = await axios.get('/api/users/admins/active/count', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Gọi API lấy tổng số người dùng không hoạt động
                const inActiveUsersResponse = await axios.get('/api/users/admins/in_active/count', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Gọi API lấy tổng số người dùng bị khóa
                const lockUsersResponse = await axios.get('/api/users/admins/lock/count', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Gọi API lấy tổng số người dùng là khách vãng lai
                const guestsResponse = await axios.get('/api/users/admins/guest/count', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setTotalUsers(totalUsersResponse.data); 
                setIsActiveUsers(activeUsersResponse.data);
                setIsInActiveUsers(inActiveUsersResponse.data);
                setIsLockUsers(lockUsersResponse.data);
                setIsGuest(guestsResponse.data);
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
                            <h2 className="text-xl font-bold">Số Người Dùng Hoạt Động</h2>
                            <p className="text-3xl mt-4">{isActiveUsers}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">Số Người Dùng Không Hoạt Động</h2>
                            <p className="text-3xl mt-4">{isInActiveUsers}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">Số Người Dùng Bị Khóa</h2>
                            <p className="text-3xl mt-4">{isLockUsers}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">Số Người Dùng Là Khách Vãng Lai</h2>
                            <p className="text-3xl mt-4">{isGuest}</p>
                        </div>

                        
                    </div>

                    

                  
                    
                </main>

                
            </div>
        </div>
        
    );
};

export default Dashboard;
