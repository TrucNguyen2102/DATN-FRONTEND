import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerHeader from "../components/Header/CustomerHeader";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("/api/notifications");
                setNotifications(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thông báo:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    if (loading) return <div>Đang tải thông báo...</div>;

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <CustomerHeader/>
            <div className="flex flex-1">
                <CustomerSidebar className="w-1/4 bg-gray-200 p-4" />
                    <main className="flex-1 p-6">
                        <div className="notification-list">
                            <h2>Thông báo của bạn</h2>
                            {notifications.length === 0 ? (
                                <p>Không có thông báo nào.</p>
                            ) : (
                                notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                    />
                                ))
                            )}
                        </div>
                    </main>
                
            </div>
            
        </div>
        
    );
};

const NotificationItem = ({ notification }) => {
    const { content, sendAt, type, isRead } = notification;

    return (
        <div className={`notification-item ${!isRead ? "unread" : ""}`}>
            <h3>{type === "booking" ? "Đặt bàn" : "Thông báo chung"}</h3>
            <p>{content}</p>
            <small>Gửi lúc: {new Date(sendAt).toLocaleString()}</small>
        </div>
    );
};

export default NotificationList;
