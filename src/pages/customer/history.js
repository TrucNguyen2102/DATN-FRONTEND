
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from '../contexts/AuthContext';
import CustomerHeader from "../components/Header/CustomerHeader";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";

const CustomerHistoryTable = () => {
    const [bookings, setBookings] = useState([]); // State để lưu trữ lịch sử đặt bàn
    const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải dữ liệu
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user || !user.id) {
                console.error("Không tìm thấy userId!");
                setLoading(false);
                return; // Dừng nếu không có userId
            }

            try {
                const response = await axios.get(`/api/bookings/history/${user.id}`); // Gọi API để lấy lịch sử đặt bàn
                setBookings(response.data); // Lưu dữ liệu vào state
            } catch (error) {
                console.error("Lỗi khi tải lịch sử đặt bàn:", error);
            } finally {
                setLoading(false); // Đã tải xong dữ liệu, cập nhật trạng thái
            }
        };

        // Chỉ gọi fetchBookings nếu user đã được xác định
        if (user) {
            fetchBookings(); // Gọi hàm lấy dữ liệu
        }
    }, [user]); // Chạy lại khi user thay đổi

    

    const handleRefresh = () => {
        window.location.reload(); // Làm mới trang
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <CustomerHeader />
            <div className="flex flex-1">
                <CustomerSidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Lịch Sử Đặt Bàn</h1>

                    <div className='mb-4'>
                        <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                            Làm Mới
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-center">Đang tải dữ liệu...</p>
                    ) : (
                        <table className="min-w-full bg-white border border-gray-300 table-fixed">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-r w-1/10">ID</th>
                                    <th className="py-2 px-4 border-b border-r w-1/10">Thời Gian Đặt</th>
                                    <th className="py-2 px-4 border-b border-r w-1/10">Thời Gian Hết Hạn</th>
                                    <th className="py-2 px-4 border-b border-r w-1/10">Trạng Thái</th>
                                    <th className="py-2 px-4 border-b border-r w-1/10">Bàn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">Không có lịch sử đặt bàn nào.</td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking.id}>
                                            <td className="py-2 px-4 border-b border-r text-center">{booking.id}</td>
                                            <td className="py-2 px-4 border-b border-r text-center">{new Date(booking.bookingTime).toLocaleString()}</td>
                                            <td className="py-2 px-4 border-b border-r text-center">
                                                {booking.expiryTime ? new Date(booking.expiryTime).toLocaleString() : "Chưa Có"}
                                            </td>
                                            <td className="py-2 px-4 border-b border-r text-center">{booking.status}</td>
                                            <td className="py-2 px-4 border-b border-r text-center">
                                                {booking.tableIds && booking.tableIds.length > 0
                                                    ? booking.tableIds.join(", ") // Hiển thị danh sách ID bàn, ngăn cách bằng dấu phẩy
                                                    : "Không có bàn"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CustomerHistoryTable;
