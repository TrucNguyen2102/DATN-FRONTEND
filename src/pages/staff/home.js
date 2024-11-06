import StaffHeader from "../components/Header/StaffHeader";
import StaffSidebar from "../components/Sidebar/StaffSidebar";
import React, { useEffect, useState, useContext } from 'react';
import AuthContext from "../contexts/AuthContext";

const StaffsHome = () => {

    const [greeting, setGreeting] = useState('');
    const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ context

    useEffect(() => {
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
            <StaffHeader />
            <div className="flex flex-1">
                <StaffSidebar className="w-1/4 bg-gray-200 p-4"/>

                
                <div className="flex-1 p-6 text-center">
                    <h1 className="text-2xl font-bold">{greeting}, {user?.fullName}!</h1>
                    <p>Chào mừng bạn đến với giao diện quản lý của nhân viên.</p>
                    
                </div>

            </div>
        </div>
    )
}

export default StaffsHome;
