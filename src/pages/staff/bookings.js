import StaffHeader from "../components/Header/StaffHeader";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StaffSidebar from "../components/Sidebar/StaffSidebar";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { format, differenceInSeconds  } from 'date-fns';
import CancelBookingModal from "../components/staff/CancelBookingModal";

const StaffBooking = () => {
    const [error, setError] = useState('');
    const [bookings, setBookings] = useState([]);
    const [timeLeft, setTimeLeft] = useState({}); // State để lưu thời gian đếm ngược
    const [isEditing, setIsEditing] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState(
        "Chờ Xác Nhận",
        "Đã Xác Nhận", 
        "Đã Hủy",
        "Đã Nhận Bàn",
    ); // Trạng thái mặc định của tab đầu tiên
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
    const [isChangeNewModalOpen, setIsChangeNewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);  // Lưu thông tin booking hiện tại
    const [selectedTable, setSelectedTable] = useState(null); //lưu trữ ds bàn được chọn
    const [showPartialModal, setShowPartialModal] = useState(false);
    const [selectedTables, setSelectedTables] = useState([]); // State để lưu danh sách bàn được chọn

    const [selectedOldTables, setSelectedOldTables] = useState([]); // Lưu các bàn cũ được chọn
    const [selectedNewTables, setSelectedNewTables] = useState([]); // Lưu các bàn mới được chọn

    const [selectedTableIds, setSelectedTableIds] = useState([]);  // Lưu trạng thái bàn đã chọn
    

    const [availableTables, setAvailableTables] = useState([]); // Danh sách bàn trống

    const [tablesInfo, setTablesInfo] = useState([]);


    const [currentPage, setCurrentPage] = useState({ 'Chờ Xác Nhận': 1, 'Đã Xác Nhận': 1, 'Đã Hủy': 1, 'Đã Nhận Bàn': 1 });
    const itemsPerPage = 5;

    const handleRefresh = () => {
        window.location.reload();
    };


    const fetchBookings = async () => {
        try {
            const response = await axios.get('/api/bookings/all');
            const bookingsData = response.data;
            console.log("Bookings Data:", bookingsData);  // Kiểm tra dữ liệu bookings

            const tablesResponse = await axios.get('/api/tables/with-tableNum-typeName');
            const tablesInfo = tablesResponse.data;
    
            console.log("Tables Data:", tablesInfo);  // Kiểm tra dữ liệu bàn

            const bookingsWithDetails  = await Promise.all(bookingsData.map(async (booking) => {
                const fullNameResponse = await axios.get(`/api/users/fullNameUser?userId=${booking.userId}`);
                const fullName = fullNameResponse.data;

                

                // Kết hợp thông tin bàn từ tablesInfo vào booking
                const tableNumbers = [];
                const tableTypes = [];
                booking.tableIds.forEach(tableId => {
                    const tableInfo = tablesInfo.find(table => table.id === tableId);
                    if (tableInfo) {
                        tableNumbers.push(tableInfo.tableNum);
                        tableTypes.push(tableInfo.typeName);
                    }
                });

                return { ...booking, fullName, tableNumbers, tableTypes};
            }));

            

            setBookings(bookingsWithDetails );
        } catch (error) {
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        }
    };


    useEffect(() => {
        const interval = setInterval(() => {
            const updatedTimeLeft = bookings.reduce((acc, booking) => {
                if (booking.bookingTime && booking.expiryTime) {
                    const bookingTime = new Date(booking.bookingTime); // Thời gian đặt bàn
                    const expiryTime = new Date(booking.expiryTime); // Thời gian hết hạn
                    const now = new Date(); // Thời gian hiện tại

                    // Nếu thời gian hiện tại đã vượt qua thời gian đặt bàn (bookingTime)
                    if (now >= bookingTime) {
                        // Tính thời gian còn lại từ thời điểm hiện tại đến expiryTime
                        const secondsLeft = differenceInSeconds(expiryTime, now);

                        // Nếu hết thời gian thì dừng đếm ngược
                        acc[booking.id] = secondsLeft > 0 ? secondsLeft : 0;
                    } else {
                        // Nếu thời gian hiện tại chưa đến thời gian đặt bàn thì không làm gì
                        acc[booking.id] = 0;
                    }
                }
                return acc;
            }, {});
            setTimeLeft(updatedTimeLeft); // Cập nhật thời gian còn lại
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(interval); // Dừng khi component unmount
    }, [bookings]);

    useEffect(() => {
        fetchBookings(); // Lấy danh sách đơn đặt bàn
       
    }, []);

    const formatTimeLeft = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} phút ${remainingSeconds} giây`;
    };
    

    const filterBookingsByStatus = (status) => {
        return bookings.filter(booking => booking.status === status);
    };

    const handlePageChange = (status, page) => {
        setCurrentPage(prevState => ({ ...prevState, [status]: page }));
    };
    
    const totalPages = (status) => {
        const filteredBookings = filterBookingsByStatus(status);
        return Math.ceil(filteredBookings.length / itemsPerPage);
    };
    
    const getPaginatedBookings = (status) => {
        const filteredBookings = filterBookingsByStatus(status);
        const startIndex = (currentPage[status] - 1) * itemsPerPage;
        return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
    };

    const handleSearchChange = (tab, value) => {
        setSearchTerm(prev => ({ ...prev, [tab]: value }));
      };



    // // Xử lý tìm kiếm booking
    // const handleSearch = async (currentStatus) => {
    //     try {
    //         console.log("Tìm kiếm với tên/phone:", searchTerm, "và trạng thái:", currentStatus);
    //         const response = await axios.get("/api/bookings/search", {
    //             params: {
    //                 name: searchTerm,
    //                 phone: searchTerm,
    //                 status: currentStatus, // Truyền trạng thái hiện tại
    //             },
    //         });
    //         console.log("Kết quả tìm kiếm:", response.data); // Kiểm tra kết quả trả về
    //         setBookings(response.data); // Cập nhật danh sách bookings
    //     } catch (error) {
    //         console.error("Lỗi khi tìm kiếm booking:", error);
    //     }
    // };

    // const handleSearch = async (currentStatus) => {
    //     try {
    //         // Mã hóa các tham số name và phone trước khi gửi yêu cầu
    //         const encodedName = encodeURIComponent(searchTerm);
    //         const encodedPhone = encodeURIComponent(searchTerm);
    //         const encodedStatus = encodeURIComponent(currentStatus);
    
    //         console.log("Tìm kiếm với tên/phone:", searchTerm, "và trạng thái:", currentStatus);
    
    //         const response = await axios.get("/api/bookings/search", {
    //             params: {
    //                 name: encodedName,  // Mã hóa tên
    //                 phone: encodedPhone, // Mã hóa số điện thoại
    //                 status: encodedStatus, // Mã hóa trạng thái
    //             },
    //         });
    
    //         console.log("Kết quả tìm kiếm:", response.data); // Kiểm tra kết quả trả về
    //         setBookings(response.data); // Cập nhật danh sách bookings
    //     } catch (error) {
    //         console.error("Lỗi khi tìm kiếm booking:", error);
    //     }
    // };

    
    

    // const handleSearch = async (currentStatus) => {
    //     try {
    //         // Kiểm tra nếu searchTerm có chứa tên và số điện thoại, ví dụ: searchTerm là một đối tượng
    //         const fullName = searchTerm.fullName || ""; // Lấy tên nếu có
    //         console.log("FullName:", fullName);

    //         const phone = searchTerm.phone || ""; // Lấy số điện thoại nếu có
    //         console.log("Phone:", phone);

    //         const encodedFullName = encodeURIComponent(fullName); // Mã hóa tên
    //         console.log("encodedFullName:", encodedFullName);

    //         const encodedPhone = encodeURIComponent(phone); // Mã hóa số điện thoại
    //         console.log("encodedPhone:", encodedPhone);

    //         const encodedStatus = encodeURIComponent(currentStatus); // Mã hóa trạng thái
    //         console.log("encodedStatus:", encodedStatus);

    
    //         console.log("Tìm kiếm với tên:", fullName, "và số điện thoại:", phone, "và trạng thái:", currentStatus);
    
    //         // Gửi yêu cầu tìm kiếm
    //         const response = await axios.get("/api/bookings/search", {
    //             params: {
    //                 fullName: encodedFullName,  // Mã hóa tên
    //                 phone: encodedPhone, // Mã hóa số điện thoại
    //                 status: encodedStatus, // Mã hóa trạng thái
    //             },
    //         });
    
    //         // Kiểm tra kết quả tìm kiếm
    //         console.log("Kết quả tìm kiếm:", response.data);
    //         setBookings(response.data); // Cập nhật danh sách bookings
    //     } catch (error) {
    //         console.error("Lỗi khi tìm kiếm booking:", error);
    //     }
    // };
    
    


    const handleEdit = (booking) => {
        setCurrentBooking(booking); // Lưu thông tin đơn đặt vào state
        setIsEditing(true); // Hiển thị form chỉnh sửa
    };


    

    const updateTablesStatus = async (tableIds, status) => {
        try {
            // // Nếu tableIds không phải là mảng, chuyển nó thành mảng
            const tableIdsArray = Array.isArray(tableIds) ? tableIds : [tableIds];
    
            // Lặp qua tất cả các tableIds để gửi yêu cầu cập nhật cho từng bàn
            for (let tableId of tableIdsArray) {
                // Gửi yêu cầu PUT cho mỗi bàn với ID và trạng thái mới
                const response =  await axios.put('/api/tables/update-status', {
                    tableId: tableId,  // ID của bàn
                    status: status      // Trạng thái mới của bàn
                });

                 // Log phản hồi từ API để kiểm tra
                console.log(`Đã cập nhật trạng thái bàn ${tableId} thành "${status}". Phản hồi:`, response.data);
            
            }
        } catch (error) {
            // Nếu có lỗi xảy ra, log ra và thông báo cho người dùng
            console.error('Lỗi cập nhật trạng thái bàn:', error);
            alert('Đã có lỗi xảy ra khi cập nhật trạng thái bàn.');
        }
    };
    
    

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
    
        // Kiểm tra tính hợp lệ của ID booking
        if (!currentBooking || !currentBooking.id) {
            console.error("ID của booking không hợp lệ.");
            return;
        }
    
        setLoading(true); // Bắt đầu quá trình gửi yêu cầu
    
        try {
            // Cập nhật trạng thái booking
            const updateBookingResponse = await axios.put(`/api/bookings/update/${currentBooking.id}/status`, {
                status: "Đã Xác Nhận" // Cập nhật trạng thái đơn đặt bàn
            });
    
            if (updateBookingResponse.status === 200 || updateBookingResponse.status === 201) {
                // Lấy danh sách các bàn liên quan đến booking này
                const tableIds = currentBooking.tableIds;
                console.log("Tables:", tableIds);
    
                // Cập nhật trạng thái bàn
                await updateTablesStatus(tableIds, "Đã Đặt");
    
                // Tải lại danh sách booking sau khi cập nhật
                fetchBookings();
                setIsEditing(false);
                alert('Đơn đặt bàn đã được xác nhận và bàn đã được cập nhật trạng thái.');
            } else {
                alert('Cập nhật trạng thái đơn không thành công.');
            }
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setLoading(false); // Kết thúc quá trình gửi yêu cầu
        }
    };



    

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

            //cập nhật trạng thái bàn

            // Lấy danh sách các bàn liên quan đến booking này
            const tableIds = booking.tableIds;
            console.log("Tables:", tableIds);

            // // Cập nhật trạng thái bàn
            // await updateTablesStatus(tableIds, "Đang Chơi");
            // Cập nhật trạng thái các bàn
        // const tableIds = booking.tableIds;
        if (tableIds && tableIds.length > 0) {
            await updateTablesStatus(tableIds, "Đang Chơi");
             // Gọi API để tạo mới hóa đơn (invoice)
             await axios.post(`/api/invoices/create-for-booking/${booking.id}`, tableIds);
        }
            

            // // Gọi API để tạo mới một hóa đơn (invoice)
            // await axios.post('/api/invoices/create', {
            //     bookingId: booking.id // Chỉ gửi ID của booking
            // });

           


            alert('Đã nhận bàn và tạo hóa đơn thành công!');
    
            console.log(`Đã tạo hóa đơn cho booking ID: ${booking.id}`);


            
    
            // Tải lại danh sách đơn đặt bàn sau khi cập nhật
            fetchBookings();
        } catch (error) {
            console.error('Lỗi khi xử lý xác nhận và tạo hóa đơn:', error);
        }
    };

    // // Hàm để mở modal khi người dùng muốn chuyển bàn
    const handleChange = async (booking) => {
        try {
            // Lấy danh sách bàn còn trống để hiển thị trong modal
            const response = await axios.get('/api/tables/available');
            setAvailableTables(response.data);
    
            // Lấy danh sách bàn đã chọn trong booking (bàn cũ)
            const bookingTablesResponse = await axios.get(`/api/bookings/booking_table/${booking.id}`);
            const bookingTables = bookingTablesResponse.data;
    
            // Lấy thông tin bàn từ API chi tiết bàn
            const tablesResponse = await axios.get('/api/tables/all'); // API lấy thông tin bàn, gồm tableId và tableNum
            const allTables = tablesResponse.data;
    
            // Kết hợp thông tin tableNum vào bookingTables
            const updatedBookingTables = bookingTables.map((bookingTable) => {
                const table = allTables.find(t => t.id === bookingTable.tableId);
                return {
                    ...bookingTable,
                    tableNum: table ? table.tableNum : 'Không có thông tin',
                    tableStatus: table ? table.tableStatus : 'Không rõ',
                    typeName: table?.type?.name || 'Không rõ',
                    
                };
            });
    
            setSelectedBooking({
                ...booking,
                tables: updatedBookingTables // Cập nhật bàn cũ vào selectedBooking
            });
    
            // Mở modal để chọn bàn mới
            setIsChangeNewModalOpen(true);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bàn trống hoặc bàn cũ:", error);
        }
    };
    

    // Hàm xử lý khi bàn cũ được chọn
    const handleOldTableSelect = (tableId) => {
        setSelectedOldTables(prevState =>
            prevState.includes(tableId)
                ? prevState.filter(id => id !== tableId)  // Xóa bàn khỏi danh sách nếu đã chọn
                : [...prevState, tableId]  // Thêm bàn vào danh sách nếu chưa chọn
        );
    };

    // Hàm xử lý khi bàn mới được chọn
    const handleNewTableSelect = (tableId) => {
        setSelectedNewTables(prevState =>
            prevState.includes(tableId)
                ? prevState.filter(id => id !== tableId)  // Xóa bàn khỏi danh sách nếu đã chọn
                : [...prevState, tableId]  // Thêm bàn vào danh sách nếu chưa chọn
        );
    };

        // // Hàm xác nhận chuyển bàn mới
    const handleConfirmChange = async () => {
        // Kiểm tra nếu bàn mới được chọn
        if (selectedNewTables.length === 0) {
            alert("Vui lòng chọn ít nhất một bàn mới.");
            return;
        }
    
        if (!selectedBooking || !selectedBooking.id) {
            alert("Không tìm thấy booking để chuyển bàn.");
            return;
        }
    
        try {
            // Kiểm tra nếu bàn mới trùng với bàn hiện tại để tránh cập nhật không cần thiết
            if (selectedNewTables.some(newTableId => 
                selectedBooking.tables.some(oldTable => oldTable.id === newTableId))) {
                alert("Bàn mới phải khác bàn hiện tại.");
                return;
            }
    
            // Trường hợp chỉ có 1 bàn trong booking (một bàn được chọn)
            if (selectedBooking.tables.length === 1) {
                if (selectedNewTables.length === 1) {
                    // Cập nhật 1 bàn
                    await axios.put(`/api/bookings/booking_table/update-table-id`, {
                        bookingId: selectedBooking.id,
                        tableId: selectedNewTables[0]  // Gửi bàn mới được chọn
                    });
                } else {
                    alert("Vui lòng chỉ chọn 1 bàn mới cho booking này.");
                    return;
                }
            } else {
                const oldTableIds = selectedOldTables.map(table => table.tableId || table); // Chuyển đổi oldTableIds sang dạng ID

                console.log({
                    bookingId: selectedBooking.id,
                    oldTableIds: oldTableIds,  // Các bàn cũ
                    newTableIds: selectedNewTables   // Các bàn mới
                  });
                  
                // Trường hợp có nhiều bàn (nhiều bàn được chọn)
                await axios.put(`/api/bookings/booking_table/update-tables`, {
                    bookingId: selectedBooking.id,
                    // oldTableIds: selectedOldTables,  // Các bàn cũ
                    oldTableIds: oldTableIds,
                    newTableIds: selectedNewTables   // Các bàn mới
                });

                
                  

            }



    
            alert("Đã chuyển bàn thành công!");
            // Tải lại danh sách booking để cập nhật giao diện
            fetchBookings();
            // Đóng modal sau khi chuyển bàn thành công
            setIsChangeNewModalOpen(false);
    
        } catch (error) {
            console.error("Lỗi khi chuyển bàn:", error);
            alert("Có lỗi xảy ra khi chuyển bàn.");
        }
    };
    
    
    

    
    
    

    const handleCancelTable = (booking) => {
        // Kiểm tra nếu booking có nhiều hơn 1 bàn
        if (booking.tableIds.length <= 1) {
            alert("Chỉ có 1 bàn, không thể hủy.");
            return;
        }

        // Mở modal và truyền thông tin của booking vào modal
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    // Hàm để chọn hoặc bỏ chọn bàn trong modal
    const handleTableSelect = (tableId) => {
        setSelectedTables((prevSelectedTables) => {
            if (prevSelectedTables.includes(tableId)) {
                return prevSelectedTables.filter(id => id !== tableId); // Bỏ chọn bàn
            } else {
                return [...prevSelectedTables, tableId]; // Chọn bàn
            }
        });
    };


    // Hàm hủy các bàn đã chọn
    const handleCancelSelectedTables = async () => {
        if (selectedTables.length === 0) {
            alert("Vui lòng chọn ít nhất một bàn để hủy.");
            return;
        }

        try {
            // Cập nhật trạng thái bàn bị hủy thành "Trống"
            await updateTablesStatus(selectedTables, "Trống");

            // Giữ trạng thái các bàn còn lại thành "Đã Đặt"
            const remainingTableIds = selectedBooking.tableIds.filter(id => !selectedTables.includes(id));
            await updateTablesStatus(remainingTableIds, "Đã Đặt");

            // Gọi API để xóa các bàn bị hủy khỏi booking
            for (let tableId of selectedTables) {
                await deleteBookingTable(selectedBooking.id, tableId);
            }

            // Cập nhật trạng thái booking là "Đã Xác Nhận" nếu cần
            await axios.put(`/api/bookings/update/${selectedBooking.id}/status`, {
                status: "Đã Xác Nhận"
            });

            alert('Đã hủy bàn thành công và giữ lại các bàn còn lại.');

            // Tải lại danh sách booking
            fetchBookings();
            setIsModalOpen(false); // Đóng modal sau khi thực hiện
        } catch (error) {
            console.error('Lỗi khi xử lý hủy bàn:', error);
        }
    };

    const deleteBookingTable = async (bookingId, tableId) => {
        try {
            await axios.delete('/api/bookings/booking_table/delete', {
                params: {
                    bookingId: bookingId,
                    tableId: tableId
                }
            });
            console.log(`Bàn ${tableId} đã bị xóa khỏi booking ${bookingId}`);
        } catch (error) {
            console.error("Lỗi khi xóa bàn khỏi booking:", error);
        }
    };

    //ấn nút Kết Thúc để hiển thị ra form xác nhận
    const handleEndClick = (booking) => {
        // Kiểm tra nếu booking chỉ có 1 bàn
        if (booking.tableIds.length === 1) {
            // Gọi hàm handleRecieved ngay lập tức để kết thúc booking
            handleRecieved(booking);
        } else {
            // Nếu có nhiều bàn, mở modal để xác nhận
            setSelectedBooking(booking);
            setIsChangeModalOpen(true); // Hiển thị form để người dùng chọn bàn
        }
    };

    //ấn nút Kết Thúc ngay lập tức nếu đơn chỉ có 1 bàn
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


             // Kiểm tra nếu booking chỉ có một bàn
            if (booking.tableIds && booking.tableIds.length === 1) {
                // Lấy tableId từ booking và cập nhật trạng thái của bàn
                const tableId = booking.tableIds[0];

                const updateTableStatusResponse = await axios.put(`/api/tables/${tableId}/status`, {
                    tableStatus: "Đang Xử Lý Thanh Toán" // Cập nhật trạng thái bàn
                });

                // Kiểm tra phản hồi từ API cập nhật bàn
                if (updateTableStatusResponse.status === 200) {
                    console.log(`Đã cập nhật trạng thái bàn thành "Đang Xử Lý Thanh Toán" cho bàn ID: ${tableId}`);
                } else {
                    console.error(`Lỗi khi cập nhật trạng thái bàn: ${updateTableStatusResponse.statusText}`);
                }
            }

            fetchBookings();

            alert("Đã kết thúc và cập nhật hóa đơn thành công!")
    
        } catch (error) {
            console.error("Lỗi khi thực hiện cập nhật:", error);
        }
    };

    

    //hàm xác nhận hiển thị khi ấn kết thúc
    const ConfirmEndModal = ({ booking, onClose, onEndAll, onEndPartial }) => {
        return (
            <div className="mt-6 p-4 border border-gray-300 bg-white">
                <h3 className="text-2xl mb-4" >Xác Nhận Kết Thúc</h3>
                <p>Chọn bàn muốn kết thúc</p>
                {/* <button type="submit" onClick={() => onEndAll(booking)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mt-4">Tất Cả</button> */}
                <button type="submit" onClick={() => onEndPartial(booking)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4 ml-2">Chọn Bàn</button>
                <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mt-4 ml-2">Hủy</button>
            </div>
        );
    };

    const SelectTablesModal = ({ booking, onClose, onConfirm, selectedTableIds, setSelectedTableIds }) => {
        
        
        

        // // Hàm xử lý chọn hoặc bỏ chọn bàn
        // const handleTableSelection = (tableId) => {
        //     setSelectedTableIds(prev => 
        //         prev.includes(tableId) ? prev.filter(id => id !== tableId) : [...prev, tableId]
        //     );
        // };

        const handleTableSelection = async (tableId) => {
            try {
                // Lấy trạng thái của bàn từ bảng TablePlay qua API
                const response = await axios.get(`/api/tables/${tableId}`);
                console.log("Response:", response);
                const tableStatus = response.data.tableStatus;
        
                // Nếu bàn có trạng thái "Đang Xử Lý Thanh Toán", hiển thị thông báo lỗi
                if (tableStatus === "Đang Xử Lý Thanh Toán") {
                    alert(`Bàn ${tableId} đang xử lý thanh toán. Bạn không thể chọn bàn này.`);
                    return; // Dừng lại nếu bàn đang xử lý thanh toán
                }
        
                // Nếu không có lỗi, cho phép chọn hoặc bỏ chọn bàn
                setSelectedTableIds(prev => 
                    prev.includes(tableId) ? prev.filter(id => id !== tableId) : [...prev, tableId]
                );
            } catch (error) {
                console.error("Lỗi khi lấy trạng thái bàn:", error);
                alert("Lỗi khi kiểm tra trạng thái bàn.");
            }
        };
        

        const handleConfirmSelection = async () => {
            if (selectedTableIds.length === 0) {
                alert("Vui lòng chọn ít nhất một bàn.");
                return;
            }
        
            // Kiểm tra tất cả các bàn đã chọn
            for (const tableId of selectedTableIds) {
                try {
                    // Lấy trạng thái của bàn từ bảng TablePlay qua API
                    const response = await axios.get(`/api/tables/${tableId}`);
                    const tableStatus = response.data.tableStatus;
        
                    // Nếu bàn có trạng thái "Đang Xử Lý Thanh Toán", hiển thị thông báo lỗi
                    if (tableStatus === "Đang Xử Lý Thanh Toán") {
                        alert(`Bàn ${tableId} đang xử lý thanh toán. Bạn không thể chọn bàn này.`);
                        return; // Dừng lại nếu có bàn đang xử lý thanh toán
                    }
                } catch (error) {
                    console.error("Lỗi khi kiểm tra trạng thái bàn:", error);
                    alert("Lỗi khi kiểm tra trạng thái bàn.");
                    return;
                }
            }
        
            // Nếu không có bàn nào bị lỗi, gọi hàm onConfirm để xử lý tiếp
            onConfirm(booking, selectedTableIds); 
            onClose();  // Đóng modal sau khi xác nhận
        };
        
        
    
        return (
            <div className="mt-6 p-4 border border-gray-300 bg-white">
                <h3 className="text-2xl mb-4">Chọn Bàn Cần Kết Thúc</h3>
                <div className="space-y-2">
                    {booking.tableIds.map(tableId => (
                        <div key={tableId}>
                            <input 
                                type="checkbox" 
                                id={`table-${tableId}`} 
                                checked={selectedTableIds.includes(tableId)}  // Đánh dấu bàn đã chọn
                                onChange={() => handleTableSelection(tableId)} 
                            />
                            <label htmlFor={`table-${tableId}`} className="ml-2">Bàn {tableId}</label>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <button 
                        onClick={handleConfirmSelection} 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Xác Nhận
                    </button>
                    <button 
                        onClick={onClose} 
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        );
    };
    

    //hàm chọn tất cả bàn
    // const handleConfirmEndAll = async (booking) => {
    //     await handleRecievedAll(booking);
    //     setIsModalOpen(false);
    // };

    //hàm chọn bàn muốn kết thúc
    const handleConfirmEndPartial = async (booking) => {
        // Hiển thị modal để chọn các bàn muốn kết thúc, rồi gọi handleRecievedPartial
        // await handleRecievedPartial(booking);
        setSelectedTableIds([]);
        setSelectedBooking(booking);
        setShowPartialModal(true);
    };

    //nếu kết thúc tất cả
    // const handleRecievedAll = async (booking) => {
    //     if (!booking || !booking.id) {
    //         console.error("Booking ID is invalid or undefined.");
    //         return;
    //     }
    
    //     const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    
    //     try {
    //         // Cập nhật endTime cho hóa đơn và trạng thái booking
    //         const [updateInvoiceResponse, updateBookingResponse] = await Promise.all([
    //             axios.put(`/api/invoices/update/byBookingId/${booking.id}/endTime`, { endTime: currentDateTime }),
    //             axios.put(`/api/bookings/update/${booking.id}/status`, { status: "Chưa Thanh Toán" })
    //         ]);
    
    //         if (updateInvoiceResponse.status === 200 && updateBookingResponse.status === 200) {
    //             console.log(`Đã kết thúc tất cả bàn cho booking ID: ${booking.id}`);
    //         } else {
    //             console.error("Lỗi khi kết thúc tất cả bàn.");
    //         }
    
    //         fetchBookings();
    //         setIsChangeModalOpen(false);
    //     } catch (error) {
    //         console.error("Lỗi khi thực hiện cập nhật:", error);
    //     }
    // };
    

    // Cập nhật thời gian kết thúc cho nhiều hóa đơn liên quan đến các bàn
    const updateInvoiceEndTime = async (selectedTableIds, bookingId, endTime) => {
        try {
            // Giả sử bạn muốn cập nhật cho tất cả các bàn trong selectedTableIds
            for (const tableId of selectedTableIds) {
                const response = await axios.put(`/api/invoices/updateEndTimeAndLinkTable/${tableId}`, null, {
                    params: {
                        bookingId: bookingId,
                        endTime: endTime
                    }
                });
                console.log('Hóa đơn đã được cập nhật thời gian kết thúc và liên kết với bàn:', tableId);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thời gian kết thúc hóa đơn:", error);
        }
    };
    

    const handleRecievedPartial = async (booking, selectedTableIds) => {
        if (!booking || !booking.id) {
            console.error("Booking ID is invalid or undefined.");
            alert("Booking không hợp lệ.");
            return;
        }
    
        if (!Array.isArray(selectedTableIds)) {
            console.error("selectedTableIds phải là một mảng, nhưng nhận được:", selectedTableIds);
            alert("Danh sách bàn không hợp lệ.");
            return;
        }
    
        try {
            // Lấy thông tin các bàn được chọn
            const selectedTables = await Promise.all(
                selectedTableIds.map(async (tableId) => {
                    const { data } = await axios.get(`/api/tables/${tableId}`);
                    return data;
                })
            );
    
            console.log("Dữ liệu bàn được chọn:", selectedTables);
    
            // Cập nhật trạng thái của các bàn
            await Promise.all(
                selectedTables.map(async (table) => {
                    if (table.tableStatus !== "Đang Xử Lý Thanh Toán") {
                        console.log(`Cập nhật trạng thái bàn ${table.id} thành "Đang Xử Lý Thanh Toán".`);
                        await updateTableStatus(table.id, "Đang Xử Lý Thanh Toán");
                    }
                })
            );
    
            // Lấy lại thông tin các bàn sau khi cập nhật
            const updatedTables = await Promise.all(
                selectedTableIds.map(async (tableId) => {
                    const { data } = await axios.get(`/api/tables/${tableId}`);
                    return data;
                })
            );
    
            // Kiểm tra nếu tất cả các bàn đã đang xử lý thanh toán
            const allTablesProcessed = updatedTables.every(
                (table) => table.tableStatus === "Đang Xử Lý Thanh Toán"
            );
            console.log("Tất cả các bàn trong booking đều 'Đang Xử Lý Thanh Toán'? ", allTablesProcessed);
    
            // Cập nhật thời gian kết thúc hóa đơn
            const endTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
            console.log("Cập nhật thời gian kết thúc hóa đơn:", endTime);
            await updateInvoiceEndTime(selectedTableIds, booking.id, endTime);
    
            // Cập nhật trạng thái booking dựa trên trạng thái các bàn
            const bookingStatus = allTablesProcessed ? "Chưa Thanh Toán" : "Đã Nhận Bàn";
            console.log("Trạng thái booking sẽ được cập nhật thành:", bookingStatus);
    
            // Gửi yêu cầu cập nhật trạng thái booking
            const { data: currentBooking } = await axios.get(`/api/bookings/${booking.id}`);
            if (currentBooking.status !== bookingStatus) {
                await axios.put(`/api/bookings/booking_table/update/${booking.id}/status/paymentProcessing`, {
                    status: bookingStatus,
                });
                console.log("Trạng thái booking đã được cập nhật thành công.");
            } else {
                console.log("Trạng thái booking không thay đổi.");
            }
    
            alert("Đã cập nhật thành công.");
            fetchBookings(); // Lấy lại danh sách booking
        } catch (error) {
            console.error("Lỗi khi xử lý cập nhật bàn:", error);
            alert("Có lỗi xảy ra khi cập nhật trạng thái bàn. Vui lòng thử lại.");
        }
    };
    
    
    
    
    // Hàm cập nhật trạng thái bàn
    const updateTableStatus = async (tableId, status) => {
        try {
            const response = await axios.put(`/api/tables/${tableId}/status`, { tableStatus: status });
            console.log(`Trạng thái bàn ${tableId} đã được cập nhật thành công: ${status}`);
        } catch (error) {
            console.error(`Lỗi khi cập nhật trạng thái bàn ${tableId}:`, error);
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

                

                    <Tabs>
                        <TabList className="mb-4">
                            <Tab className="react-tabs__tab">Chờ Xác Nhận</Tab> 
                            <Tab className="react-tabs__tab">Đã Xác Nhận</Tab>
                            <Tab className="react-tabs__tab">Đã Hủy</Tab>
                            <Tab className="react-tabs__tab">Đã Nhận Bàn</Tab>
                        </TabList>

                        {/* Tab "Chờ Xác Nhận" */}
                        <TabPanel>
                            {/* Thanh tìm kiếm */}
                            <div className="flex justify-between mb-4">
                                <input
                                type="text"
                                placeholder="Search..."
                                className="border px-4 py-2 rounded w-1/3"
                                value={searchTerm['Chờ Xác Nhận']}
                                onChange={(e) => handleSearchChange('Chờ Xác Nhận', e.target.value)}
                                />
                                <button
                                onClick={() => handleSearch('Chờ Xác Nhận')}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                Tìm kiếm
                                </button>
                            </div>


                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2 text-center">Mã Đơn</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Đặt</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Hết Hạn</th>
                                            <th className="border px-4 py-2 text-center">Trạng Thái</th>
                                            <th className="border px-4 py-2 text-center">Tên Người Dùng</th>
                                            <th className="border px-4 py-2 text-center">Số Bàn</th>
                                            <th className="border px-4 py-2 text-center">Loại Bàn</th>
                                            <th className="border px-4 py-2 text-center">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {/* {filterBookingsByStatus('Chờ Xác Nhận').map(booking => ( */}
                                    {getPaginatedBookings('Chờ Xác Nhận').map(booking => (
                                            <tr key={booking.id}>
                                                <td className="border px-4 py-2 text-center">{booking.id}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(booking.bookingTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                {/* <td className="border px-4 py-2 text-center">{format(new Date(booking.expiryTime), 'dd/MM/yyyy HH:mm:ss')}</td> */}
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {booking.expiryTime ? format(new Date(booking.expiryTime), 'dd/MM/yyyy HH:mm:ss') : "Chưa Có"}
                                                </td>
                                                <td className="border px-4 py-2 text-center">{booking.status}</td>
                                                <td className="border px-4 py-2 text-center">{booking.fullName}</td>
                                                {/* <td className="border px-4 py-2 text-center">{booking.tableIds.join(', ')}</td> */}
                                                <td className="border px-4 py-2 text-center">{booking.tableNumbers.join(', ')}</td>
                                                <td className="border px-4 py-2 text-center">{booking.tableTypes.join(', ')}</td>
                                             
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

                            {/* Phân trang */}
                            <div className="mt-4">
                                <p className="text-sm">Trang {currentPage['Chờ Xác Nhận']} / {totalPages('Chờ Xác Nhận')}</p>
                                <div className="flex justify-center">
                                    {Array.from({ length: totalPages('Chờ Xác Nhận') }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange('Chờ Xác Nhận', index + 1)}
                                        className={`mx-1 px-3 py-1 rounded ${currentPage['Chờ Xác Nhận'] === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {index + 1}
                                    </button>
                                    ))}
                                </div>
                            </div>
                        </TabPanel>

                        {/* Tab "Đã Xác Nhận" */}
                        <TabPanel>
                             {/* Thanh tìm kiếm */}
                            <div className="flex justify-between mb-4">
                                <input
                                type="text"
                                placeholder="Search..."
                                className="border px-4 py-2 rounded w-1/3"
                                value={searchTerm['Đã Xác Nhận']}
                                onChange={(e) => handleSearchChange('Đã Xác Nhận', e.target.value)}
                                />
                                <button
                                onClick={() => handleSearch('Đã Xác Nhận')}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                Tìm kiếm
                                </button>
                            </div>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2 text-center w-1/10">Mã Đơn</th>
                                            <th className="border px-4 py-2 text-center w-1/10">Thời Gian Đặt</th>
                                            <th className="border px-4 py-2 text-center w-1/10">Thời Gian Hết Hạn</th>
                                            <th className="border px-4 py-2 text-center w-1/12">Đếm Ngược</th>
                                            <th className="border px-4 py-2 text-center w-1/10">Trạng Thái</th>
                                            <th className="border px-4 py-2 text-center w-1/10">Tên Người Dùng</th>
                                            <th className="border px-4 py-2 text-center w-10">Số Bàn</th>
                                            <th className="border px-4 py-2 text-center w-10">Loại Bàn</th>
                                            
                                            <th className="border px-4 py-2 text-center w-1/5">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {/* {filterBookingsByStatus('Đã Xác Nhận').map(booking => ( */}
                                    {getPaginatedBookings('Đã Xác Nhận').map(booking => (
                                            <tr key={booking.id}>
                                                <td className="border px-4 py-2 text-center">{booking.id}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(booking.bookingTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                {/* <td className="border px-4 py-2 text-center">{format(new Date(booking.expiryTime), 'dd/MM/yyyy HH:mm:ss')}</td> */}
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {booking.expiryTime ? format(new Date(booking.expiryTime), 'dd/MM/yyyy HH:mm:ss') : "Chưa Có"}
                                                </td>
                                                <td className="border px-4 py-2 text-center">
                                                    {timeLeft[booking.id] > 0 ? formatTimeLeft(timeLeft[booking.id]) : "Trong ít phút nữa"}
                                                </td>
                                                <td className="border px-4 py-2 text-center">{booking.status}</td>
                                                <td className="border px-4 py-2 text-center">{booking.fullName}</td>
                                                <td className="border px-4 py-2 text-center">{booking.tableIds.join(', ')}</td>
                                                {/* <td className="border px-4 py-2 text-center">{booking.tableNumbers.join(', ')}</td> */}
                                                <td className="border px-4 py-2 text-center">{booking.tableTypes.join(', ')}</td>
                                                <td className="border px-4 py-2 text-center">
                                                    <button onClick={() => handleConfirm(booking)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700">
                                                        Nhận Bàn
                                                    </button>

                                                    <button onClick={() => handleChange(booking)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 ml-2">
                                                        Chuyển Bàn
                                                    </button>

                                                    {/* Thêm nút hủy bàn */}
                                                    {booking.tableIds.length > 1 && (
                                                        <button onClick={() => handleCancelTable(booking)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-2">
                                                            Hủy Bàn
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Phân trang */}
                            <div className="mt-4">
                                <p className="text-sm">Trang {currentPage['Đã Xác Nhận']} / {totalPages('Đã Xác Nhận')}</p>
                                <div className="flex justify-center">
                                    {Array.from({ length: totalPages('Đã Xác Nhận') }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange('Đã Xác Nhận', index + 1)}
                                        className={`mx-1 px-3 py-1 rounded ${currentPage['Đã Xác Nhận'] === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {index + 1}
                                    </button>
                                    ))}
                                </div>
                            </div>
                        </TabPanel>

                        {/* Tab "Đã Hủy" */}
                        <TabPanel>
                            {/* Thanh tìm kiếm */}
                            <div className="flex justify-between mb-4">
                                <input
                                type="text"
                                placeholder="Search..."
                                className="border px-4 py-2 rounded w-1/3"
                                value={searchTerm['Đã Hủy']}
                                onChange={(e) => handleSearchChange('Đã Hủy', e.target.value)}
                                />
                                <button
                                onClick={() => handleSearch('Đã Hủy')}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                Tìm kiếm
                                </button>
                            </div>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2 text-center">ID</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Đặt</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Hết Hạn</th>
                                            <th className="border px-4 py-2 text-center">Đếm Ngược</th>
                                            <th className="border px-4 py-2 text-center">Trạng Thái</th>
                                            <th className="border px-4 py-2 text-center">Tên Người Dùng</th>
                                            <th className="border px-4 py-2 text-center">Số Bàn</th>
                                            <th className="border px-4 py-2 text-center">Loại Bàn</th>
                                           
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {/* {filterBookingsByStatus('Đã Hủy').map(booking => ( */}
                                    {getPaginatedBookings('Đã Hủy').map(booking => (
                                            <tr key={booking.id}>
                                                <td className="border px-4 py-2 text-center">{booking.id}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(booking.bookingTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                {/* <td className="border px-4 py-2 text-center">{format(new Date(booking.expiryTime), 'dd/MM/yyyy HH:mm:ss')}</td> */}
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {booking.expiryTime ? format(new Date(booking.expiryTime), 'dd/MM/yyyy HH:mm:ss') : "Chưa Có"}
                                                </td>
                                                <td className="border px-4 py-2 text-center">
                                                    {timeLeft[booking.id] > 0 ? formatTimeLeft(timeLeft[booking.id]) : "Hết hạn"}
                                                </td>
                                                <td className="border px-4 py-2 text-center">{booking.status}</td>
                                                <td className="border px-4 py-2 text-center">{booking.fullName}</td>
                                                {/* <td className="border px-4 py-2 text-center">{booking.tableIds.join(', ')}</td> */}
                                                <td className="border px-4 py-2 text-center">{booking.tableNumbers.join(', ')}</td>
                                                <td className="border px-4 py-2 text-center">{booking.tableTypes.join(', ')}</td>
                                                
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Phân trang */}
                            <div className="mt-4">
                                <p className="text-sm">Trang {currentPage['Đã Hủy']} / {totalPages('Đã Hủy')}</p>
                                <div className="flex justify-center">
                                    {Array.from({ length: totalPages('Đã Hủy') }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange('Đã Hủy', index + 1)}
                                        className={`mx-1 px-3 py-1 rounded ${currentPage['Đã Hủy'] === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {index + 1}
                                    </button>
                                    ))}
                                </div>
                            </div>
                        </TabPanel>

                        {/* Tab "Đã Nhận Bàn" */}
                        <TabPanel>
                            {/* Thanh tìm kiếm */}
                            <div className="flex justify-between mb-4">
                                <input
                                type="text"
                                placeholder="Search..."
                                className="border px-4 py-2 rounded w-1/3"
                                value={searchTerm['Đã Nhận Bàn']}
                                onChange={(e) => handleSearchChange('Đã Nhận Bàn', e.target.value)}
                                />
                                <button
                                onClick={() => handleSearch('Đã Nhận Bàn')}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                Tìm kiếm
                                </button>
                            </div>

                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2 text-center">ID</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Đặt</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Hết Hạn</th>
                                            <th className="border px-4 py-2 text-center">Trạng Thái</th>
                                            <th className="border px-4 py-2 text-center">Tên Người Dùng</th>
                                            <th className="border px-4 py-2 text-center">Số Bàn</th>
                                            <th className="border px-4 py-2 text-center">Loại Bàn</th>
                                            <th className="border px-4 py-2 text-center">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {/* {filterBookingsByStatus('Đã Nhận Bàn').map(booking => ( */}
                                    {getPaginatedBookings('Đã Nhận Bàn').map(booking => (
                                            <tr key={booking.id}>
                                                <td className="border px-4 py-2 text-center">{booking.id}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(booking.bookingTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                {/* <td className="border px-4 py-2 text-center">{format(new Date(booking.expiryTime), 'dd/MM/yyyy HH:mm:ss')}</td> */}
                                                <td className="py-2 px-4 border-b border-r text-center">
                                                    {booking.expiryTime ? format(new Date(booking.expiryTime), 'dd/MM/yyyy HH:mm:ss') : "Chưa Có"}
                                                </td>
                                                <td className="border px-4 py-2 text-center">{booking.status}</td>
                                                <td className="border px-4 py-2 text-center">{booking.fullName}</td>
                                                {/* <td className="border px-4 py-2 text-center">{booking.tableIds.join(', ')}</td> */}
                                                <td className="border px-4 py-2 text-center">{booking.tableNumbers.join(', ')}</td>
                                                <td className="border px-4 py-2 text-center">{booking.tableTypes.join(', ')}</td>
                                                <td className="border px-4 py-2 text-center">
                                                    {/* <button onClick={() => handleRecieved(booking)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700">
                                                        Kết Thúc
                                                    </button> */}
                                                    <button
                                                        onClick={() => handleEndClick(booking)}  // Gọi hàm handleEndClick
                                                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
                                                    >
                                                        Kết Thúc
                                                    </button>

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Phân trang */}
                            <div className="mt-4">
                                <p className="text-sm">Trang {currentPage['Đã Nhận Bàn']} / {totalPages('Đã Nhận Bàn')}</p>
                                <div className="flex justify-center">
                                    {Array.from({ length: totalPages('Đã Nhận Bàn') }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange('Đã Nhận Bàn', index + 1)}
                                        className={`mx-1 px-3 py-1 rounded ${currentPage['Đã Nhận Bàn'] === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {index + 1}
                                    </button>
                                    ))}
                                </div>
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

                    {/* Form xác nhận hủy bàn */}
                    {isModalOpen && selectedBooking && (
                        <div className="mt-6 p-4 border border-gray-300 bg-white">
                            <h3 className="text-2xl mb-4">Chọn các bàn cần hủy</h3>
                            {selectedBooking.tableIds.map((tableId) => (
                                <div key={tableId}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={tableId}
                                            checked={selectedTables.includes(tableId)}
                                            onChange={() => handleTableSelect(tableId)}
                                        />
                                        Bàn {tableId}
                                    </label>
                                </div>
                            ))}
                            <button onClick={handleCancelSelectedTables} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Xác Nhận
                            </button>
                            <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2">
                                Hủy
                            </button>
                        </div>
                    )}

                    {/* Modal để chọn bàn mới */}
                    {isChangeNewModalOpen && selectedBooking && (
                        <div className="mt-6 p-4 border border-gray-300 bg-white">
                            <h2 className="text-2xl mb-4">Chọn bàn mới</h2>
                            
                            {/* Hiển thị bàn cũ */}
                            {selectedBooking.tables && selectedBooking.tables.length > 0 && (
                                <div className="mb-4">
                                    <h3>Bàn hiện tại</h3>
                                    {selectedBooking.tables.map((table) => (
                                        <div key={table.id}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={table.id}
                                                    checked={selectedOldTables.includes(table.id)}
                                                    onChange={() => handleOldTableSelect(table.id)} // Chọn bàn cũ
                                                />
                                                Bàn {table.tableNum || "Không"} - {table.tableStatus} - {table.typeName}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Hiển thị bàn mới */}
                            <div className="mb-4">
                                <h3>Chọn bàn mới</h3>
                                {availableTables.map((table) => (
                                    <div key={table.id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={table.id}
                                                checked={selectedNewTables.includes(table.id)}
                                                onChange={() => handleNewTableSelect(table.id)} // Chọn bàn mới
                                            />
                                            Bàn {table.tableNum} - {table.tableStatus} - {table.type?.name}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* Các nút xác nhận hoặc hủy */}
                            <div className="mt-4">
                                <button onClick={handleConfirmChange} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Xác Nhận
                                </button>
                                <button onClick={() => setIsChangeNewModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2">
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}


                    {/* mở form để chọn xác nhận kết thúc */}
                    {isChangeModalOpen && (
                            <ConfirmEndModal
                                booking={selectedBooking}
                                onClose={() => setIsChangeModalOpen(false)}
                                // onEndAll={handleConfirmEndAll} //kết thúc tất cả
                                onEndPartial={handleConfirmEndPartial} //kết thúc bàn mu
                            />
                    )}

                    {/* {showPartialModal  && (
                        <SelectTablesModal
                            booking={selectedBooking}
                            onClose={() => setShowPartialModal(false)}  // Đóng modal khi người dùng hủy
                            oonConfirm={handleRecievedPartial}
                        />
                    )} */}

                {showPartialModal && (
                    <SelectTablesModal
                        booking={selectedBooking}
                        onClose={() => setShowPartialModal(false)}  // Đóng modal khi người dùng hủy
                        onConfirm={handleRecievedPartial}  // Khi xác nhận
                        selectedTableIds={selectedTableIds}  // Truyền danh sách bàn đã chọn vào modal
                        setSelectedTableIds={setSelectedTableIds}  // Truyền hàm cập nhật bàn đã chọn
                    />
                )}

                </main>
            </div>
        </div>
    );
};

export default StaffBooking;
