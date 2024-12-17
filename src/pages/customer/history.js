import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from '../contexts/AuthContext';
import CustomerHeader from "../components/Header/CustomerHeader";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";
import Chatbox from "../components/Chatbox";
import { FaSyncAlt, FaEye } from "react-icons/fa";

const CustomerHistoryTable = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
    const [error, setError] = useState('');
    const [payments, setPayments] = useState([]);
    const pageSize = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user || !user.id) {
                console.error("Không tìm thấy userId!");
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await axios.get(`/api/bookings/history/${user.id}`, {
                    params: {
                        page: currentPage - 1,
                        size: pageSize,
                    },
                });
    
                let sortedBookings = response.data.content || [];
    
                // Sắp xếp đơn theo thời gian đặt
                sortedBookings = sortedBookings.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
    
                setBookings(sortedBookings);
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

    const fetchPayments = async () => {
        try {
            const response = await axios.get('/api/invoices/payments/all');
            setPayments(response.data);
        } catch (error) {
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        }
    };

    const getMethodName = (methodId) => {
        const method = payments.find(m => m.id === methodId);
        return method ? method.name : "Chưa Có";
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    // const formatCurrency = (value) => {
    //     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // };

    const formatCurrency = (value) => {
        if (value === undefined || value === null) {
            return "0"; // Hoặc giá trị mặc định khác
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    

    const handleViewInvoice = async (bookingId) => {
        try {
            const response = await axios.get(`/api/invoices/booking/${bookingId}`);
            setSelectedInvoice(response.data);
            setShowInvoiceDetail(true);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết hóa đơn:", error);
        }
    };

    

    const handleCancelInvoiceDetail = () => {
        setShowInvoiceDetail(false);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <CustomerHeader />
            <div className="flex flex-1">
                <CustomerSidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Lịch Sử Đặt Bàn</h1>

                    <div className="flex mb-4">
                        <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1">
                            <FaSyncAlt className="text-white" /> Làm Mới
                        </button>
                    </div>

                    {/* Hiển thị tất cả các đơn đặt bàn */}
                    {loading ? (
                        <p className="text-center">Đang tải dữ liệu...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {bookings.length === 0 ? (
                                <div className="col-span-full text-center py-4 text-gray-500">Không có lịch sử đặt bàn nào.</div>
                            ) : (
                                bookings.map((booking, index) => {
                                    const isNewest = index === 0; // Đơn đầu tiên là mới nhất
                                    return (
                                        <div
                                            key={booking.id}
                                            className={`bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition ${isNewest ? "bg-red-100 border-red-500" : "bg-white border-gray-300"}`}
                                        >
                                            <h3 className="font-semibold text-xl text-center">Đơn Đặt Số {booking.id}</h3>
                                            
                                            <p><strong>Thời Gian Đặt:</strong> {new Date(booking.bookingTime).toLocaleString()}</p>
                                            <p><strong>Thời Gian Hết Hạn:</strong> {booking.expiryTime ? new Date(booking.expiryTime).toLocaleString() : "Chưa Có"}</p>
                                            <p><strong>Trạng Thái:</strong>
                                                <span className={`font-bold ${booking.status === 'Đã Hủy' ? 'text-red-500' : booking.status === 'Đã Thanh Toán' ? 'text-green-500' : 'text-yellow-500'} ml-2`}>
                                                    {booking.status}
                                                </span>
                                            </p>
                                            
                                            <p><strong>Bàn:</strong> {booking.tableIds && booking.tableIds.length > 0 ? booking.tableIds.join(", ") : "Không có bàn"}</p>
                                        
                                        
                                            {booking.status === "Đã Thanh Toán" && (
                                                
                                                    <button
                                                    onClick={() => handleViewInvoice(booking.id)}
                                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1"
                                                >
                                                    <FaEye className="text-white" /> Xem Hóa Đơn
                                                </button>
                                                
                                                
                                            )}
                                            
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {/* <div className="flex justify-center mt-4">
                        
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
                    </div> */}

                            <div className="mt-4">
                                <p className="text-sm">Trang {currentPage} / {totalPages}</p>
                                <div className="flex justify-center">
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>

                    {/* {showInvoiceDetail && selectedInvoice && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded shadow-lg w-96">
                                <h2 className="text-2xl font-semibold mb-4 text-center">Chi Tiết Hóa Đơn</h2>
                                <p><strong>ID Hóa Đơn:</strong> {selectedInvoice.id}</p>
                                <p><strong>Ngày Lập Hóa Đơn:</strong> {new Date(selectedInvoice.billDate).toLocaleString()}</p>
                                <p><strong>Tổng Tiền:</strong> {formatCurrency(selectedInvoice.totalMoney)} VND</p>
                                <p><strong>Trạng Thái Thanh Toán:</strong> {selectedInvoice.status}</p>
                                <p><strong>Phương Thức Thanh Toán:</strong> {getMethodName(selectedInvoice.methodId)}</p>
                                <p><strong>Bàn Đã Đặt:</strong> {selectedInvoice.tableId}</p>

                                <div className="mt-4">
                                    <button
                                        onClick={handleCancelInvoiceDetail}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )} */}

                     {showInvoiceDetail && selectedInvoice && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded shadow-lg w-96">
                                <h2 className="text-2xl font-semibold mb-4 text-center">Chi Tiết Hóa Đơn</h2>
                                {Array.isArray(selectedInvoice) ? (
                                    selectedInvoice.map((invoice) => (
                                        <div key={invoice.id}>
                                            <p><strong>ID Hóa Đơn:</strong> {invoice.id}</p>
                                            <p><strong>Ngày Lập Hóa Đơn:</strong> {invoice.billDate ? new Date(invoice.billDate).toLocaleString() : "Chưa có ngày"}</p>
                                            <p><strong>Tổng Tiền:</strong> {formatCurrency(invoice.totalMoney)} VND</p>
                                            <p><strong>Trạng Thái Thanh Toán:</strong> {invoice.status}</p>
                                            <p><strong>Phương Thức Thanh Toán:</strong> {getMethodName(invoice.methodId)}</p>
                                            <p><strong>Bàn Đã Đặt:</strong> {invoice.tableId}</p>
                                            <hr className="my-4" />
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        <p><strong>ID Hóa Đơn:</strong> {selectedInvoice.id}</p>
                                        <p><strong>Ngày Lập Hóa Đơn:</strong> {new Date(selectedInvoice.billDate).toLocaleString()}</p>
                                        <p><strong>Tổng Tiền:</strong> {formatCurrency(selectedInvoice.totalMoney)} VND</p>
                                        <p><strong>Trạng Thái Thanh Toán:</strong> {selectedInvoice.status}</p>
                                        <p><strong>Bàn Đã Đặt:</strong> {selectedInvoice.tableId}</p>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <button
                                        onClick={handleCancelInvoiceDetail}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                    )}
                </main>
                <Chatbox/>
            </div>
        </div>
    );
};

export default CustomerHistoryTable;
