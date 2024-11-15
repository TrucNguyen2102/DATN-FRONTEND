
// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import AuthContext from '../contexts/AuthContext';
// import CustomerHeader from "../components/Header/CustomerHeader";
// import CustomerSidebar from "../components/Sidebar/CustomerSidebar";

// const CustomerHistoryTable = () => {
//     const [bookings, setBookings] = useState([]); // State để lưu trữ lịch sử đặt bàn
//     const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải dữ liệu
//     const { user } = useContext(AuthContext);

    

//     useEffect(() => {
//         const fetchBookings = async () => {
//             if (!user || !user.id) {
//                 console.error("Không tìm thấy userId!");
//                 setLoading(false);
//                 return; // Dừng nếu không có userId
//             }

//             try {
//                 const response = await axios.get(`/api/bookings/history/${user.id}`); // Gọi API để lấy lịch sử đặt bàn
//                 setBookings(response.data); // Lưu dữ liệu vào state
//             } catch (error) {
//                 console.error("Lỗi khi tải lịch sử đặt bàn:", error);
//             } finally {
//                 setLoading(false); // Đã tải xong dữ liệu, cập nhật trạng thái
//             }
//         };

//         // Chỉ gọi fetchBookings nếu user đã được xác định
//         if (user) {
//             fetchBookings(); // Gọi hàm lấy dữ liệu
//         }
//     }, [user]); // Chạy lại khi user thay đổi

    

//     const handleRefresh = () => {
//         window.location.reload(); // Làm mới trang
//     };

//     return (
//         <div className="bg-gray-100 min-h-screen flex flex-col">
//             <CustomerHeader />
//             <div className="flex flex-1">
//                 <CustomerSidebar className="w-1/4 bg-gray-200 p-4" />

//                 <main className="flex-1 p-6">
//                     <h1 className="text-3xl font-semibold mb-8 text-center">Lịch Sử Đặt Bàn</h1>

//                     <div className='mb-4'>
//                         <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
//                             Làm Mới
//                         </button>
//                     </div>

//                     {loading ? (
//                         <p className="text-center">Đang tải dữ liệu...</p>
//                     ) : (
//                         <table className="min-w-full bg-white border border-gray-300 table-fixed">
//                             <thead>
//                                 <tr>
//                                     <th className="py-2 px-4 border-b border-r w-1/10">ID</th>
//                                     <th className="py-2 px-4 border-b border-r w-1/10">Thời Gian Đặt</th>
//                                     <th className="py-2 px-4 border-b border-r w-1/10">Thời Gian Hết Hạn</th>
//                                     <th className="py-2 px-4 border-b border-r w-1/10">Trạng Thái</th>
//                                     <th className="py-2 px-4 border-b border-r w-1/10">Bàn</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {bookings.length === 0 ? (
//                                     <tr>
//                                         <td colSpan="4" className="text-center py-4">Không có lịch sử đặt bàn nào.</td>
//                                     </tr>
//                                 ) : (
//                                     bookings.map((booking) => (
//                                         <tr key={booking.id}>
//                                             <td className="py-2 px-4 border-b border-r text-center">{booking.id}</td>
//                                             <td className="py-2 px-4 border-b border-r text-center">{new Date(booking.bookingTime).toLocaleString()}</td>
//                                             <td className="py-2 px-4 border-b border-r text-center">
//                                                 {booking.expiryTime ? new Date(booking.expiryTime).toLocaleString() : "Chưa Có"}
//                                             </td>
//                                             <td className="py-2 px-4 border-b border-r text-center">{booking.status}</td>
//                                             <td className="py-2 px-4 border-b border-r text-center">
//                                                 {booking.tableIds && booking.tableIds.length > 0
//                                                     ? booking.tableIds.join(", ") // Hiển thị danh sách ID bàn, ngăn cách bằng dấu phẩy
//                                                     : "Không có bàn"}
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     )}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default CustomerHistoryTable;


import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from '../contexts/AuthContext';
import CustomerHeader from "../components/Header/CustomerHeader";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";

const CustomerHistoryTable = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [selectedInvoice, setSelectedInvoice] = useState(null); // State lưu chi tiết hóa đơn
    const [showInvoiceDetail, setShowInvoiceDetail] = useState(false); // State để điều khiển việc hiển thị chi tiết hóa đơn

    // Thêm các state cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5; // Số bản ghi mỗi trang

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user || !user.id) {
                console.error("Không tìm thấy userId!");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Gọi API với các tham số phân trang
                const response = await axios.get(`/api/bookings/history/${user.id}`, {
                    params: {
                        page: currentPage - 1, // API thường sử dụng page bắt đầu từ 0
                        size: pageSize
                    }
                });

                setBookings(response.data.content || []);
                setTotalPages(response.data.totalPages || 1);
            } catch (error) {
                console.error("Lỗi khi tải lịch sử đặt bàn:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user, currentPage]);

    // Xử lý chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const formatCurrency = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleViewInvoice = async (bookingId) => {
        try {
            // Gọi API để lấy chi tiết hóa đơn theo bookingId
            const response = await axios.get(`/api/invoices/booking/${bookingId}`);
            setSelectedInvoice(response.data); // Lưu thông tin hóa đơn vào state
            setShowInvoiceDetail(true);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết hóa đơn:", error);
        }
    };

    // Hàm xử lý sự kiện khi nhấn nút Hủy
    const handleCancelInvoiceDetail = () => {
        setShowInvoiceDetail(false); // Ẩn chi tiết hóa đơn
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
                        <div>
                            <table className="min-w-full bg-white border border-gray-300 table-fixed">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b border-r w-1/10">ID</th>
                                        <th className="py-2 px-4 border-b border-r w-1/10">Thời Gian Đặt</th>
                                        <th className="py-2 px-4 border-b border-r w-1/10">Thời Gian Hết Hạn</th>
                                        <th className="py-2 px-4 border-b border-r w-1/10">Trạng Thái</th>
                                        <th className="py-2 px-4 border-b border-r w-1/10">Bàn</th>
                                        <th className="py-2 px-4 border-b border-r w-1/10">Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">Không có lịch sử đặt bàn nào.</td>
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
                                                        ? booking.tableIds.join(", ")
                                                        : "Không có bàn"}
                                                </td>

                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    <button
                                                        onClick={() => handleViewInvoice(booking.id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                    >
                                                        Xem Hóa Đơn
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
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
                        </div>
                    )}

                    {/* Hiển thị chi tiết hóa đơn nếu có */}
                    {showInvoiceDetail  && selectedInvoice && (
                        <div className="mt-6 bg-white p-4 rounded shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Chi Tiết Hóa Đơn</h2>
                            <p><strong>ID Hóa Đơn:</strong> {selectedInvoice.id}</p>
                            <p><strong>Ngày Lập Hóa Đơn:</strong> {new Date(selectedInvoice.billDate).toLocaleString()}</p>
                            <p><strong>Tổng Tiền:</strong> {formatCurrency(selectedInvoice.totalMoney)} VND</p>
                            <p><strong>Trạng Thái Thanh Toán:</strong> {selectedInvoice.status}</p>
                            
                            <div className="mt-4">
                                <button
                                    onClick={handleCancelInvoiceDetail}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CustomerHistoryTable;
