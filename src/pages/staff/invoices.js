import StaffHeader from "../components/Header/StaffHeader";
import StaffSidebar from "../components/Sidebar/StaffSidebar";
import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const StaffInvoices = () => {
    const [error, setError] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [bookingTables, setBookingTables] = useState([]); 
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [invoice, setInvoice] = useState(null);
    const [formValues, setFormValues] = useState({
        
        startTime: '',
        endTime: '',
        totalMoney: 0,
        totalTablePrice: 0,
    });

    const [tableIds, setTableIds] = useState([]);
    const [tableType, setTableType] = useState('');
    const [tablePrice, setTablePrice] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [tableDetails, setTableDetails] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showConfirmPrint, setShowConfirmPrint] = useState(false);

    const [currentPage, setCurrentPage] = useState({ 'Chưa Thanh Toán': 1, 'Chờ Thanh Toán': 1, 'Đã Thanh Toán': 1 });
    const itemsPerPage = 8;

    // const formatCurrency = (value) => {
    //     // return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    //     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // };

    const formatCurrency = (value) => {
        if (value == null || isNaN(value)) {
            console.error("formatCurrency nhận giá trị không hợp lệ:", value);
            return "0"; // Trả về giá trị mặc định nếu không hợp lệ
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    

    
    
    const formatDate = (date) => {
        return date ? format(new Date(date), 'dd/MM/yyyy HH:mm:ss') : 'Không xác định';
    };

    //hàm lấy hóa đơn
    const fetchInvoices = async () => {
        try {
            const response = await axios.get('/api/invoices/all');
            const invoicesData = response.data;
            console.log("Invoices Data:", invoicesData);
            setInvoices(invoicesData);
        } catch (error) {
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        }
    };

    //hàm lấy bàn chơi
    const fetchBookingTables = async () => {
        try {
            const response = await axios.get('/api/bookings/all'); // Đường dẫn API của bạn
            setBookingTables(response.data);
        } catch (error) {
            setError('Không thể tải danh sách bàn chơi. Vui lòng thử lại.');
        }
    };

    // Lấy danh sách menu
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get(`/api/menus/all`);
                console.log("Menu Data:", response.data);
                setMenuItems(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách menu:", error);
            }
        };
        fetchMenuItems();
    }, []);

    // Hàm để tìm tên món ăn từ menuItems dựa trên menuId
    const getMenuNameById = (menuId) => {
        const menuItem = menuItems.find(item => item.id === menuId);
        return menuItem ? menuItem.itemName : "Không có tên món";
    };

    // Hàm để tìm tên món ăn từ menuItems dựa trên menuId
    const getMenuPriceById = (menuId) => {
        const menuItem = menuItems.find(item => item.id === menuId);
        return menuItem ? menuItem.price : "Giá không được xác định";
    };



    const handleSelectBooking = async (invoice) => {
        try {
            // Lấy thông tin hóa đơn từ API
            const invoiceResponse = await axios.get(`/api/invoices/${invoice.id}`);
            const invoiceData = invoiceResponse.data;

            console.log('Dữ liệu hóa đơn:', invoiceData);

                // Lấy thông tin bàn từ API bằng tableId trong hóa đơn
                const tableResponse = await axios.get(`/api/tables/with-type-price/${invoiceData.tableId}`);
                const tableData = tableResponse.data;

                console.log("Table Data:", tableData);

                // Kiểm tra nếu bàn không phải là "Đang Xử Lý Thanh Toán" thì hiển thị thông báo
                if (tableData.tableStatus !== 'Đang Xử Lý Thanh Toán') {
                    alert(`Bàn số ${tableData.tableNum} chưa kết thúc, không thể tạo hóa đơn.`);
                    return;  // Dừng hàm nếu bàn không phải trạng thái "Đang Xử Lý Thanh Toán"
                }

                            // Tính toán tổng tiền dựa trên thông tin bàn và thời gian
                const startTime = new Date(invoiceData.startTime);
                console.log("StartTime:", startTime);
                const endTime = new Date(invoiceData.endTime);
                console.log("EndTime:", endTime);

                            const timeDiffMilliseconds = endTime - startTime;
                            console.log("Time Diff:", timeDiffMilliseconds);
        
                const hours = Math.floor(timeDiffMilliseconds / 3600000);

                console.log("Hour:", hours);
                const minutes = Math.floor((timeDiffMilliseconds % 3600000) / 60000);

                console.log("Minute:", minutes);


                // Lấy danh sách các OrderItems liên quan đến invoiceId
                const orderItemsResponse = await axios.get(`/api/orders/byInvoiceId/${invoiceData.id}`);
                console.log("OrderItem:", orderItemsResponse.data);

                let orderTotal = 0;
                // Tính tổng tiền từ các OrderItem
                orderItemsResponse.data.forEach(item => {
                    // orderTotal += item.quantity * item.price;
                    orderTotal += item.totalPriceItem;
                });
        
                const totalInvoice = Math.round(tableData.price * hours + (tableData.price / 60) * minutes);

                // Tính tổng tiền của hóa đơn (bao gồm cả thời gian sử dụng bàn và OrderItem nếu có)
                 const totalMoney = Math.round(totalInvoice + orderTotal);

            // Gán dữ liệu hóa đơn vào state
            setInvoice({
                id: invoiceData.id,
                bookingId: invoiceData.bookingId,
                tableId: invoiceData.tableId,
                tableType: tableData.typeName || "Không có loại",
                tablePrice: tableData.price || 0,
                startTime: invoiceData.startTime ? format(new Date(invoiceData.startTime), 'yyyy/MM/dd HH:mm:ss') : "Chưa có",
                endTime: invoiceData.endTime ? format(new Date(invoiceData.endTime), 'yyyy/MM/dd HH:mm:ss') : "Chưa có",
                // totalMoney: invoiceData.totalMoney || 0,
                totalInvoice: totalInvoice, //tổng tiền chơi
                totalMoney: totalMoney, //tổng tiền thanh toán (tiền chơi + tiền orderItem)
                totalTime: `${hours} giờ ${minutes} phút`,
                orderItems: orderItemsResponse.data,
                
            });

            // Cập nhật selectedBooking
            setSelectedBooking({
                bookingId: invoiceData.bookingId,
                tableId: invoiceData.tableId,
            });

            setShowForm(true);
        } catch (error) {
            console.error('Có lỗi xảy ra khi lấy thông tin:', error);
        }
    };

    
    


    const handleUpdateInvoice = async () => {
        try {
            console.log("Booking:", selectedBooking.bookingId);
            if (!selectedBooking || !selectedBooking.bookingId) {
                alert('Vui lòng chọn một đơn đặt.');
                return;
            }

             // Kiểm tra nếu `bookingId` không tồn tại trong `selectedBooking`
        if (!selectedBooking.bookingId) {
            alert('Vui lòng chọn một đơn đặt có thông tin hợp lệ.');
            console.error("Lỗi: bookingId không tồn tại trong selectedBooking.");
            return;
        }
    
            if (!invoice.totalMoney) {
                alert('Vui lòng nhập tổng tiền.');
                return;
            }
    
            // Lấy thời gian lập hóa đơn và định dạng theo kiểu 'yyyy-MM-dd HH:mm:ss'
        const now = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Ho_Chi_Minh' };
        const billDateParts = now.toLocaleString('sv-SE', options).split(','); // 'YYYY-MM-DD HH:mm:ss'
        const billDate = billDateParts.join(' ').replace(' ', ' '); // Kết hợp lại thành 'YYYY-MM-DD HH:mm:ss'
    
        // Cập nhật trạng thái đơn đặt bàn
        await axios.put(`/api/bookings/update/${selectedBooking.bookingId}/status`, {
            status: "Chờ Thanh Toán" // Cập nhật trạng thái đơn đặt thành "Chờ Thanh Toán"
        });
            
            const updatedInvoice = {
                bookingId: selectedBooking.bookingId,
                billDate: billDate, 
                totalMoney: invoice.totalMoney,  
                status: 'Chờ Thanh Toán',  
            };
    
            const response = await axios.put(`/api/invoices/update/bill-totalMoney/${selectedBooking.tableId}`, updatedInvoice);
    
            if (response.status === 200) {
                alert('Hóa đơn đã được cập nhật thành công!');
                fetchInvoices();  
                setShowForm(false);  
            } else {
                alert('Có lỗi xảy ra khi cập nhật hóa đơn: ' + response.data.message);
            }
    
        } catch (error) {
            console.error('Error updating invoice:', error);
            if (error.response) {
                alert('Có lỗi xảy ra: ' + error.response.data.message);
            } else {
                alert('Có lỗi xảy ra khi cập nhật hóa đơn. Vui lòng thử lại.');
            }
        }
    };

    // Handle button click to show print confirmation form
    const handlePrintClick = (invoice) => {
        if (!invoice) {
            alert('Vui lòng chọn một hóa đơn.');
            return;
        }
        setSelectedInvoice(invoice);
        setShowConfirmPrint(true);
    };

    // Hàm để cập nhật trạng thái của các bàn
    const updateTablesStatus = async (tableIds, status) => {
        try {
            // Lặp qua tất cả các tableIds để gửi yêu cầu cập nhật cho từng bàn
            for (let tableId of tableIds) {
                // Gửi yêu cầu PUT cho mỗi bàn với ID và trạng thái mới
                await axios.put('/api/tables/update-status', {
                    tableId: tableId,  // ID của bàn
                    status: status      // Trạng thái mới của bàn
                });
            }
        } catch (error) {
            // Nếu có lỗi xảy ra, log ra và thông báo cho người dùng
            console.error('Lỗi cập nhật trạng thái bàn:', error);
            alert('Đã có lỗi xảy ra khi cập nhật trạng thái bàn.');
        }
    };

    // Hàm cập nhật trạng thái bàn đc chọn (1 bàn)
    const updateTableStatus = async (tableId, status) => {
        if (!tableId) {
            console.error('Không có ID bàn để cập nhật trạng thái.');
            return;
        }
    
        try {
            // Cập nhật trạng thái của bàn
            const response = await axios.put(`/api/tables/${tableId}/status`, { tableStatus: status });
            if (response.status === 200) {
                console.log(`Trạng thái bàn ID ${tableId} đã được cập nhật thành: ${status}`);
            } else {
                console.error('Cập nhật trạng thái bàn thất bại:', response.data);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái bàn:', error);
        }
    };

    const handleConfirmInvoice = async () => {
        if (!selectedInvoice) {
            alert('Vui lòng chọn một đơn đặt.');
            return;
        }
    
        try {
            // Gửi yêu cầu cập nhật trạng thái Booking
            const bookingId = selectedInvoice.bookingId;
            console.log("Booking ID:", bookingId);

            // Cập nhật trạng thái của hóa đơn thành "Đã Thanh Toán"
            const updatedInvoice = {
                ...selectedBooking,
                status: 'Đã Thanh Toán',
            };
    
            // Gửi yêu cầu cập nhật trạng thái hóa đơn
            await axios.put(`/api/invoices/update/${selectedInvoice.id}`, updatedInvoice);

            // Cập nhật trạng thái bàn
            const tableId = selectedInvoice.tableId; // Lấy tableId từ hóa đơn
            console.log("Updating table with ID:", tableId);
            // await axios.put(`/api/tables/update-status/${tableId}`, null, {
            //     params: { newStatus: "Trống" }, // Truyền trạng thái mới qua query
            // });
            await axios.put(`/api/tables/${tableId}/status`, {
                tableStatus: "Trống" // Trạng thái mới
            });
    
            // Cập nhật trạng thái đơn đặt bàn và bàn liên quan
            const response = await axios.put(`/api/bookings/booking_table/update/${bookingId}/status`);
            console.log("Booking update response:", response);
    
            
            // Thông báo thành công và thực hiện xuất hóa đơn
            alert('Hóa đơn đã được cập nhật thành công và trạng thái của bàn và booking đã được cập nhật!');
            
            // Xuất ra Excel (nếu có)
            handleExportToExcel([updatedInvoice]);
    
            // Tải lại danh sách hóa đơn
            fetchInvoices();
    
            // Đóng hộp thoại xác nhận
            setShowForm(false);
            setSelectedBooking(null);
        } catch (error) {
            console.error('Error updating invoice:', error);
            alert('Có lỗi xảy ra khi cập nhật hóa đơn. Vui lòng thử lại.');
        }
    };


    const handleExportToExcel = () => {
        // Lọc hóa đơn theo trạng thái "Chờ Thanh Toán"
        const invoicesToExport = filterInvoicesByStatus('Chờ Thanh Toán').map(invoice => ({
            id: invoice.id,
            // startTime: invoice.startTime ? new Date(invoice.startTime).toISOString() : '',
            startTime: invoice.startTime ? formatDate(invoice.startTime) : '',
            // endTime: invoice.endTime ? new Date(invoice.endTime).toISOString() : '',
            endTime: invoice.endTime ? formatDate(invoice.endTime) : '',
            // billDate: invoice.billDate ? new Date(invoice.billDate).toISOString() : '',
            billDate: invoice.billDate ? formatDate(invoice.billDate) : '',
            totalMoney: formatCurrency(invoice.totalMoney),
            // status: invoice.status,
            // bookingId: invoice.bookingId,
        }));
    
        // Tạo một worksheet từ dữ liệu
        const worksheet = XLSX.utils.json_to_sheet(invoicesToExport);
    
        // Tạo một workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
    
        // Xuất file Excel
        XLSX.writeFile(workbook, 'invoices.xlsx');
    };
    

    // Hàm đóng form
    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedBooking(null);
        setTableIds([]);
        setTableType('');
        setTablePrice(0);
    };


    useEffect(() => {
        fetchInvoices();
        fetchBookingTables();
    }, []);

    const filterInvoicesByStatus = (status) => {
        return invoices.filter(invoice => invoice.status === status);
    };

    const handlePageChange = (status, page) => {
        setCurrentPage(prevState => ({ ...prevState, [status]: page }));
    };
    
    const totalPages = (status) => {
        const filteredInvoices = filterInvoicesByStatus(status);
        return Math.ceil(filteredInvoices.length / itemsPerPage);
    };
    
    const getPaginatedInvoices = (status) => {
        const filteredInvoices = filterInvoicesByStatus(status);
        const startIndex = (currentPage[status] - 1) * itemsPerPage;
        return filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <StaffHeader />
            <div className="flex flex-1">
                <StaffSidebar className="w-1/4 bg-gray-200 p-4" />
                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Hóa Đơn</h1>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    
                    <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mb-4">
                        Làm Mới
                    </button>

                    <Tabs>
                        <TabList className="mb-4">
                            <Tab className="react-tabs__tab">Chưa Thanh Toán</Tab>
                            <Tab className="react-tabs__tab">Chờ Thanh Toán</Tab>
                            <Tab className="react-tabs__tab">Đã Thanh Toán</Tab>
                        </TabList>

                        <TabPanel>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2 text-center">ID</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Bắt Đầu</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Kết Thúc</th>
                                            <th className="border px-4 py-2 text-center">Ngày Lập Hóa Đơn</th>
                                            <th className="border px-4 py-2 text-center">Tổng Tiền</th>
                                            <th className="border px-4 py-2 text-center">Trạng Thái</th>
                                            <th className="border px-4 py-2 text-center">Mã Đơn Đặt</th>
                                            <th className="border px-4 py-2 text-center">Bàn</th>
                                            <th className="border px-4 py-2 text-center">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {filterInvoicesByStatus('Chưa Thanh Toán').map(invoice => ( */}
                                        {getPaginatedInvoices('Chưa Thanh Toán').map(invoice => (
                                            <tr key={invoice.id}>
                                                <td className="border px-4 py-2 text-center">{invoice.id}</td>
                                                {/* <td className="border px-4 py-2 text-center">{format(new Date(invoice.startTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(invoice.endTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(invoice.billDate), 'dd/MM/yyyy HH:mm:ss')}</td> */}
                                                 <td className="border px-4 py-2 text-center">{formatDate(invoice.startTime)}</td>
                                                <td className="border px-4 py-2 text-center">{invoice.endTime ? formatDate(invoice.endTime) : 'Chưa Có'}</td>
                                                <td className="border px-4 py-2 text-center">{invoice.billDate ? formatDate(invoice.billDate): 'Chưa Có'}</td>
                                                <td className="border px-4 py-2 text-center">{formatCurrency(invoice.totalMoney)} VND</td>
                                                <td className="border px-4 py-2 text-center">{invoice.status}</td>
                                                <td className="border px-4 py-2 text-center">{invoice.bookingId}</td>
                                                <td className="border px-4 py-2 text-center">{invoice.tableId || 'Không có dữ liệu'}</td>
                                                <td className="border px-4 py-2 text-center">
                                                    <button onClick={() => handleSelectBooking(invoice)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">
                                                        Tạo Hóa Đơn
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>

                            {/* Phân trang */}
                            <div className="mt-4">
                                <p className="text-sm">Trang {currentPage['Chưa Thanh Toán']} / {totalPages('Chưa Thanh Toán')}</p>
                                <div className="flex justify-center">
                                    {Array.from({ length: totalPages('Chưa Thanh Toán') }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange('Chưa Thanh Toán', index + 1)}
                                        className={`mx-1 px-3 py-1 rounded ${currentPage['Chưa Thanh Toán'] === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {index + 1}
                                    </button>
                                    ))}
                                </div>
                            </div>
                        </TabPanel>


                        <TabPanel>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2 text-center">ID</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Bắt Đầu</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Kết Thúc</th>
                                            <th className="border px-4 py-2 text-center">Ngày Lập Hóa Đơn</th>
                                            <th className="border px-4 py-2 text-center">Tổng Tiền</th>
                                            <th className="border px-4 py-2 text-center">Trạng Thái</th>
                                            <th className="border px-4 py-2 text-center">Mã Đơn Đặt</th>
                                            <th className="border px-4 py-2 text-center">Bàn</th>
                                            <th className="border px-4 py-2 text-center">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {filterInvoicesByStatus('Chờ Thanh Toán').map(invoice => ( */}
                                        {getPaginatedInvoices('Chờ Thanh Toán').map(invoice => (
                                            <tr key={invoice.id}>
                                                <td className="border px-4 py-2 text-center">{invoice.id}</td>
                                                <td className="border px-4 py-2 text-center">{formatDate(invoice.startTime)}</td>
                                                <td className="border px-4 py-2 text-center">{formatDate(invoice.endTime)}</td>
                                                <td className="border px-4 py-2 text-center">{formatDate(invoice.billDate)}</td>
                                                <td className="border px-4 py-2 text-center">{formatCurrency(invoice.totalMoney)} VND</td>
                                                <td className="border px-4 py-2 text-center">{invoice.status}</td>
                                                <td className="border px-4 py-2 text-center">{invoice.bookingId}</td>
                                                <td className="border px-4 py-2 text-center">{invoice.tableId || 'Không có dữ liệu'}</td>
                                                <td className="border px-4 py-2 text-center">
                                                    <button onClick={() => handlePrintClick(invoice)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">
                                                        In Hóa Đơn
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Phân trang */}
                            <div className="mt-4">
                                <p className="text-sm">Trang {currentPage['Chờ Thanh Toán']} / {totalPages('Chờ Thanh Toán')}</p>
                                <div className="flex justify-center">
                                    {Array.from({ length: totalPages('Chờ Thanh Toán') }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange('Chờ Thanh Toán', index + 1)}
                                        className={`mx-1 px-3 py-1 rounded ${currentPage['Chờ Thanh Toán'] === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {index + 1}
                                    </button>
                                    ))}
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2 text-center">ID</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Bắt Đầu</th>
                                            <th className="border px-4 py-2 text-center">Thời Gian Kết Thúc</th>
                                            <th className="border px-4 py-2 text-center">Ngày Lập Hóa Đơn</th>
                                            <th className="border px-4 py-2 text-center">Tổng Tiền</th>
                                            <th className="border px-4 py-2 text-center">Trạng Thái</th>
                                            <th className="border px-4 py-2 text-center">Mã Đơn Đặt</th>
                                            <th className="border px-4 py-2 text-center">Bàn</th>
                                           
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {filterInvoicesByStatus('Đã Thanh Toán').map(invoice => ( */}
                                        {getPaginatedInvoices('Đã Thanh Toán').map(invoice => (
                                            <tr key={invoice.id}>
                                                <td className="border px-4 py-2 text-center">{invoice.id}</td>
                                                <td className="border px-4 py-2 text-center">{formatDate(invoice.startTime)}</td>
                                                <td className="border px-4 py-2 text-center">{formatDate(invoice.endTime)}</td>
                                                <td className="border px-4 py-2 text-center">{formatDate(invoice.billDate)}</td>
                                                <td className="border px-4 py-2 text-center">{formatCurrency(invoice.totalMoney)} VND</td>
                                                <td className="border px-4 py-2 text-center">{invoice.status}</td>
                                                <td className="border px-4 py-2 text-center">{invoice.bookingId}</td>
                                                <td className="border px-4 py-2 text-center">{invoice.tableId || 'Không có dữ liệu'}</td>
                                                
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Phân trang */}
                            <div className="mt-4">
                                <p className="text-sm">Trang {currentPage['Đã Thanh Toán']} / {totalPages('Đã Thanh Toán')}</p>
                                <div className="flex justify-center">
                                    {Array.from({ length: totalPages('Đã Thanh Toán') }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange('Đã Thanh Toán', index + 1)}
                                        className={`mx-1 px-3 py-1 rounded ${currentPage['Đã Thanh Toán'] === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {index + 1}
                                    </button>
                                    ))}
                                </div>
                            </div>
                        </TabPanel>

                        
                    </Tabs>

                
                    {showForm && invoice && (
                        <div className="bg-white p-6 mt-4 rounded shadow">
                            <h2 className="text-2xl font-semibold mb-4 text-center">Thông Tin Chi Tiết</h2>
                            <div className="grid grid-cols-2 gap-4">
                                
                                <div>

                                    <div className="mt-6">
                                        <h3 className="text-xl font-semibold mb-2">Thông Tin Đơn Đặt</h3>
                                        <label className="block mb-2 font-bold">Mã Đơn Đặt:</label>
                                        <input
                                            type="text"
                                            value={invoice.bookingId || "Không có dữ liệu"}
                                            readOnly
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />

                                        <label className="block mb-2 font-bold">Bàn Được Chọn:</label>
                                        <input
                                            type="text"
                                            value={invoice.tableId || "Không có dữ liệu"}
                                            readOnly
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />

                                        <label className="block mb-2 font-bold">Loại Bàn:</label>
                                        <input
                                            type="text"
                                            value={invoice.tableType || "Không có dữ liệu"}
                                            readOnly
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />

                                        <label className="block mb-2 font-bold">Giá Loại Bàn:</label>
                                        <input
                                            type="text"
                                            value={`${formatCurrency(invoice.tablePrice || 0)} VND`}
                                            readOnly
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />
                                    </div>

                                    

                                    {invoice?.orderItems?.length > 0 ? (
                                        <div className="mt-6">
                                            <h3 className="text-xl font-semibold mb-2">Thông Tin OrderItem</h3>
                                            <table className="w-full table-auto border-collapse">
                                                <thead>
                                                    <tr>
                                                        <th className="border px-4 py-2 text-center">Món</th>
                                                        <th className="border px-4 py-2 text-center">Đơn Giá</th>
                                                        <th className="border px-4 py-2 text-center">Số Lượng</th>
                                                        <th className="border px-4 py-2 text-center">Tổng Giá Món</th>
                                                        {/* <th className="border px-4 py-2 text-center">Tổng OrderItem</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {invoice.orderItems.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="border px-4 py-2 text-center">{getMenuNameById(item.menuId)}</td> {/* Lấy tên món từ menuItems */}
                                                            <td className="border px-4 py-2 text-center">{formatCurrency(getMenuPriceById(item.menuId))} VND</td>
                                                            {/* <td className="border px-4 py-2">{item.itemName || "Không có tên món"}</td> */}
                                                            <td className="border px-4 py-2 text-center">{item.quantity}</td>
                                                            <td className="border px-4 py-2 text-center">{formatCurrency(item.totalPriceItem)} VND</td>
                                                            {/* <td className="border px-4 py-2 text-center">{formatCurrency(item.quantity * item.price)} VND</td> */}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-center mt-4">Không có OrderItem nào được chọn.</p>
                                    )}

                                </div>


                                <div>
                                    <div className="mt-6">
                                        <h3 className="text-xl font-semibold mb-2">Thông Tin Hóa Đơn</h3>
                                        <label className="block mb-2 font-bold">Mã Hóa Đơn:</label>
                                        <input
                                            type="text"
                                            value={invoice.id || "Không có dữ liệu"}
                                            readOnly
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />

                                        <label className="block mb-2 font-bold">Thời Gian Bắt Đầu:</label>
                                        <input
                                            type="text"
                                            value={invoice.startTime || "Chưa có"}
                                            readOnly
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />

                                        <label className="block mb-2 font-bold">Thời Gian Kết Thúc:</label>
                                        <input
                                            type="text"
                                            value={invoice.endTime || "Chưa có"}
                                            readOnly
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />

                                        <label className="block mb-2 font-bold">Ngày Lập Hóa Đơn:</label>
                                        <input
                                            type="text"
                                            value={invoice.billDate || "Chưa có"}
                                            readOnly
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />

                                        <label className="block mb-2 font-bold">Tổng Thời Gian:</label>
                                        <input
                                            type="text"
                                            value={invoice.totalTime || "Không có dữ liệu"}
                                            readOnly
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />

                                        <label className="block mb-2 font-bold">Tổng Tiền Chơi:</label>
                                        <input
                                            type="text"
                                            value={`${formatCurrency(invoice.totalInvoice || 0)} VND`}
                                            readOnly
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />

                                        <label className="block mb-2 font-bold">Tổng Tiền Thanh Toán:</label>
                                        <input
                                            type="text"
                                            value={`${formatCurrency(invoice.totalMoney || 0)} VND`}
                                            readOnly
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />
                                    </div>
                                    
                                </div>
                            </div>

                            

                            <button onClick={handleUpdateInvoice} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Lưu
                            </button>

                            <button onClick={handleCloseForm} className="mt-4 ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                                Hủy
                            </button>
                        </div>
                    )}



                    {showConfirmPrint && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded shadow-lg">
                                <h2 className="text-lg font-semibold mb-4">Xác Nhận In Hóa Đơn</h2>
                                <p>Bạn có chắc chắn muốn in hóa đơn này?</p>
                                <div className="mt-4">
                                    <button onClick={handleConfirmInvoice} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mr-2">
                                        Xác Nhận
                                    </button>
                                    <button onClick={() => setShowConfirmPrint(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                </main>
            </div>
        </div>
    );
};

export default StaffInvoices;

