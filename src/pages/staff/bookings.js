import StaffHeader from "../components/Header/StaffHeader";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StaffSidebar from "../components/Sidebar/StaffSidebar";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { format } from 'date-fns';

const StaffBooking = () => {
    const [error, setError] = useState('');
    const [bookings, setBookings] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleRefresh = () => {
        window.location.reload();
    };

    const fetchBookings = async () => {
        try {
            const response = await axios.get('/api/bookings/all');
            const bookingsData = response.data;

            const bookingsWithFullNames = await Promise.all(bookingsData.map(async (booking) => {
                const fullNameResponse = await axios.get(`/api/users/fullNameUser?userId=${booking.userId}`);
                const fullName = fullNameResponse.data;
                return { ...booking, fullName };
            }));

            setBookings(bookingsWithFullNames);
        } catch (error) {
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filterBookingsByStatus = (status) => {
        return bookings.filter(booking => booking.status === status);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value); // Cập nhật giá trị tìm kiếm
    };

    const filteredBookings = bookings.filter(booking => {
        return (
            booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || // Lọc theo tên
            booking.userPhone?.toLowerCase().includes(searchTerm.toLowerCase()) // Lọc theo số điện thoại (giả định có thuộc tính userPhone)
        );
    });

    const handleEdit = (booking) => {
        setCurrentBooking(booking); // Lưu thông tin đơn đặt vào state
        setIsEditing(true); // Hiển thị form chỉnh sửa
    };

    //ấn nút xác nhận cập nhật trạng thái đơn
    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        if (!currentBooking || !currentBooking.id) {
            console.error("ID của booking không hợp lệ.");
            return;
        }
    
        try {
            // Cập nhật trạng thái booking
            await axios.put(`/api/bookings/update/${currentBooking.id}/status`, {
                status: "Đã Xác Nhận" // Cập nhật trạng thái đơn đặt bàn
            });
    
            // // Cập nhật trạng thái bàn
            // if (currentBooking.tableId) {
            //     await axios.put(`/api/tables/update/${currentBooking.tableId}/status`, {
            //         status: "Đã Đặt" // Cập nhật trạng thái bàn thành "Đã Đặt"
            //     });
            //     console.log(`Cập nhật trạng thái bàn thành "Đã Đặt" cho bàn ID: ${currentBooking.tableId}`);
            // }
    
            fetchBookings(); // Tải lại danh sách đơn đặt bàn
            setIsEditing(false);
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
        }
    };
    
    
    

    // const handleConfirm = async (id) => {
    //     // Logic xác nhận đơn đặt
    //     console.log(`Xác nhận đơn đặt với ID: ${id}`);
    //     // Cập nhật trạng thái thành "Đã Xác Nhận" hoặc logic khác
    // };

    //ấn nút Nhận Bàn
    const handleConfirm = async (booking) => {
        console.log(booking);
        if (!booking || !booking.id) {
            console.error("ID của booking không hợp lệ.");
            return;
        }
    
        try {
            // Cập nhật trạng thái đơn đặt bàn
            await axios.put(`/api/bookings/update/${booking.id}/status`, {
                status: "Đã Nhận Bàn" // Cập nhật trạng thái đơn đặt thành "Chờ Thanh Toán"
            });
    
            // Cập nhật trạng thái bàn thành "Đang Chơi"
        if (currentBooking.tableId) {
            await axios.put(`/api/tables/update/${currentBooking.tableId}/status`, {
                status: "Đang Chơi" // Cập nhật trạng thái bàn thành "Đã Đặt"
            });
            console.log(`Cập nhật trạng thái bàn thành "Đã Đặt" cho bàn ID: ${currentBooking.tableId}`);
        }
            // Gọi API để tạo mới một hóa đơn (invoice)
            await axios.post('/api/invoices/create', {
                bookingId: booking.id // Chỉ gửi ID của booking
            });
    
            console.log(`Đã tạo hóa đơn cho booking ID: ${booking.id}`);
    
            // Tải lại danh sách đơn đặt bàn sau khi cập nhật
            fetchBookings();
        } catch (error) {
            console.error('Lỗi khi xử lý xác nhận và tạo hóa đơn:', error);
        }
    };
    
    
    //ấn nút Kết Thúc

    const handleRecieved = async (booking) => {
        // Kiểm tra booking có hợp lệ không
        if (!booking || !booking.id) {
            console.error("Booking ID is invalid or undefined.");
            return;
        }
    
        try {
            // Lấy thời gian hiện tại
            const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    
            // Cập nhật endTime trong hóa đơn bằng bookingId
            const updateInvoiceResponse = await axios.put(`/api/invoices/update/byBookingId/${booking.id}/endTime`, {
                endTime: currentDateTime // Thời gian kết thúc cần cập nhật
            });

            
    
            // Kiểm tra phản hồi từ API cập nhật hóa đơn
            if (updateInvoiceResponse.status === 200) {
                console.log(`Đã cập nhật thời gian kết thúc cho hóa đơn có booking ID: ${booking.id}`);
            } else {
                console.error(`Lỗi khi cập nhật hóa đơn: ${updateInvoiceResponse.statusText}`);
            }
    
            // Cập nhật trạng thái booking (nếu cần)
            const updateBookingResponse = await axios.put(`/api/bookings/update/${booking.id}/status`, {
                status: "Chưa Thanh Toán" // Cập nhật trạng thái booking thành "Chưa Thanh Toán"
            });
    
            // Kiểm tra phản hồi từ API cập nhật booking
            if (updateBookingResponse.status === 200) {
                console.log(`Đã cập nhật trạng thái booking thành "Chưa Thanh Toán" cho booking ID: ${booking.id}`);
            } else {
                console.error(`Lỗi khi cập nhật trạng thái booking: ${updateBookingResponse.statusText}`);
            }
            fetchBookings();
    
        } catch (error) {
            console.error("Lỗi khi thực hiện cập nhật:", error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <StaffHeader />
            <div className="flex flex-1">
                <StaffSidebar className="w-1/4 bg-gray-200 p-4" />
                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Đơn Đặt</h1>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    
                    <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mb-4">
                        Làm Mới
                    </button>

                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border border-gray-400 rounded p-2 mb-4"
                    />
                    <Tabs>
                        <TabList className="mb-4">
                            <Tab className="react-tabs__tab">Chờ Xác Nhận</Tab> 
                            <Tab className="react-tabs__tab">Đã Xác Nhận</Tab>
                            <Tab className="react-tabs__tab">Đã Hủy</Tab>
                            <Tab className="react-tabs__tab">Đã Nhận Bàn</Tab>
                        </TabList>

                        {/* Tab "Chờ Xác Nhận" */}
                        <TabPanel>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2 text-center">ID</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Đặt</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Hết Hạn</th>
                                            <th className="border px-4 py-2 text-center">Trạng Thái</th>
                                            <th className="border px-4 py-2 text-center">Tên Người Dùng</th>
                                            <th className="border px-4 py-2 text-center">ID Bàn</th>
                                            <th className="border px-4 py-2 text-center">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {filterBookingsByStatus('Chờ Xác Nhận').map(booking => (
                                            <tr key={booking.id}>
                                                <td className="border px-4 py-2 text-center">{booking.id}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(booking.bookingTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(booking.expiryTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{booking.status}</td>
                                                <td className="border px-4 py-2 text-center">{booking.fullName}</td>
                                                <td className="border px-4 py-2 text-center">{booking.tableIds.join(', ')}</td>
                                                <td className="border px-4 py-2 text-center">
                                                    <button onClick={() => handleEdit(booking)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">
                                                        Cập Nhật
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>

                        {/* Tab "Đã Xác Nhận" */}
                        <TabPanel>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2 text-center">ID</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Đặt</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Hết Hạn</th>
                                            <th className="border px-4 py-2 text-center">Trạng Thái</th>
                                            <th className="border px-4 py-2 text-center">Tên Người Dùng</th>
                                            <th className="border px-4 py-2 text-center">ID Bàn</th>
                                            <th className="border px-4 py-2 text-center">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {filterBookingsByStatus('Đã Xác Nhận').map(booking => (
                                            <tr key={booking.id}>
                                                <td className="border px-4 py-2 text-center">{booking.id}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(booking.bookingTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(booking.expiryTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{booking.status}</td>
                                                <td className="border px-4 py-2 text-center">{booking.fullName}</td>
                                                <td className="border px-4 py-2 text-center">{booking.tableIds.join(', ')}</td>
                                                <td className="border px-4 py-2 text-center">
                                                    <button onClick={() => handleConfirm(booking)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700">
                                                        Nhận Bàn
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>

                        {/* Tab "Đã Hủy" */}
                        <TabPanel>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2 text-center">ID</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Đặt</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Hết Hạn</th>
                                            <th className="border px-4 py-2 text-center">Trạng Thái</th>
                                            <th className="border px-4 py-2 text-center">Tên Người Dùng</th>
                                            <th className="border px-4 py-2 text-center">ID Bàn</th>
                                           
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {filterBookingsByStatus('Đã Hủy').map(booking => (
                                            <tr key={booking.id}>
                                                <td className="border px-4 py-2 text-center">{booking.id}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(booking.bookingTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(booking.expiryTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{booking.status}</td>
                                                <td className="border px-4 py-2 text-center">{booking.fullName}</td>
                                                <td className="border px-4 py-2 text-center">{booking.tableIds.join(', ')}</td>
                                                
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>

                        {/* Tab "Đã Nhận Bàn" */}
                        <TabPanel>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2 text-center">ID</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Đặt</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Hết Hạn</th>
                                            <th className="border px-4 py-2 text-center">Trạng Thái</th>
                                            <th className="border px-4 py-2 text-center">Tên Người Dùng</th>
                                            <th className="border px-4 py-2 text-center">ID Bàn</th>
                                            <th className="border px-4 py-2 text-center">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {filterBookingsByStatus('Đã Nhận Bàn').map(booking => (
                                            <tr key={booking.id}>
                                                <td className="border px-4 py-2 text-center">{booking.id}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(booking.bookingTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(booking.expiryTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{booking.status}</td>
                                                <td className="border px-4 py-2 text-center">{booking.fullName}</td>
                                                <td className="border px-4 py-2 text-center">{booking.tableIds.join(', ')}</td>
                                                <td className="border px-4 py-2 text-center">
                                                    <button onClick={() => handleRecieved(booking)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700">
                                                        Kết Thúc
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>
                    </Tabs>

                    {/* Form chỉnh sửa trạng thái booking */}
                    {isEditing && (
                        <div className="mt-6 p-4 border border-gray-300 bg-white">
                            <h2 className="text-2xl mb-4">Cập Nhật Trạng Thái Đơn Đặt</h2>
                            <form onSubmit={handleUpdateStatus}>
                                <div>
                                    <label className="block mb-2">Trạng Thái:</label>
                                    <select
                                        value={currentBooking.status}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, status: e.target.value })}
                                        className="border rounded px-3 py-2"
                                    >
                                        <option value="Chờ Xác Nhận">Chờ Xác Nhận</option>
                                        <option value="Đã Xác Nhận">Đã Xác Nhận</option>
                                        <option value="Đã Hủy">Đã Hủy</option>
                                        
                                    </select>
                                </div>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4">
                                    Cập Nhật
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mt-4 ml-2">
                                    Hủy
                                </button>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default StaffBooking;
