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
    const [bookingTables, setBookingTables] = useState([]); 
    const [selectedBooking, setSelectedBooking] = useState(null);
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

    const formatCurrency = (value) => {
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

    
    const handleSelectBooking = async (booking) => {
        // Kiểm tra trạng thái booking trước khi tiếp tục xử lý
        // if (booking.status !== "Chưa Thanh Toán") {
        //     // Hiển thị thông báo lỗi nếu trạng thái booking chưa kết thúc
        //     alert("Đơn đặt bàn chưa được kết thúc. Vui lòng kết thúc đơn trước khi tạo hóa đơn.");
        //     return; // Dừng không cho phép xử lý tiếp
        // }

        setSelectedBooking(booking);
    
        try {
            const tablesResponse = await axios.get(`/api/bookings/booking_table/${booking.bookingId}`);
            const tables = tablesResponse.data;
    
            const tableIdsList = tables.map(table => table.id.tableId);
            setTableIds(tableIdsList);
    
            if (tableIdsList.length > 0) {
                const tableDetailsPromises = tableIdsList.map(async (tableId) => {
                    try {
                        const response = await axios.get(`/api/tables/with-type-price/${tableId}`);
                        return response.data;
                    } catch (error) {
                        console.error(`Lỗi khi lấy dữ liệu bàn ID ${tableId}:`, error);
                        return null;
                    }
                });
    
                const tableDetails = await Promise.all(tableDetailsPromises);
                const validTableDetails = tableDetails.filter(detail => detail !== null);
    
                if (validTableDetails.length > 0) {
                    const types = validTableDetails.map(detail => detail.typeName);
                    const prices = validTableDetails.map(detail => detail.price);
    
                    setTableType(types.join(', '));
                    setTablePrice(prices); 
    
                    const startTime = new Date(booking.startTime);
                    console.log('Start Time:', startTime);

                    const endTime = new Date(booking.endTime);
                    console.log('End Time:', endTime);

                    const timeDiffMilliseconds = endTime - startTime;

                    console.log("Time Diff:", timeDiffMilliseconds);
                    
                    // Tính toán giờ và phút
                    const hours = Math.floor(timeDiffMilliseconds / 3600000); //tính số giờ
                    console.log('Hours:', hours);
                    
                    const minutes = Math.floor((timeDiffMilliseconds % 3600000) / 60000); //tính số phút
                    console.log('Minutes:', minutes);
    
                    // Tính tổng tiền
                    const totalMoney = Math.round(validTableDetails.reduce((total, detail) => {
                        const pricePerHour = detail.price; 
                        return total + (hours * pricePerHour) + ((pricePerHour / 60) * minutes); 
                    }, 0));

                    console.log("Total Money:", totalMoney);

                    // Tính tổng giá loại bàn
                    const totalTablePrice = validTableDetails.reduce((total, detail) => total + detail.price, 0);
    
                    setFormValues({
                        bookingId: booking.bookingId,
                        startTime: format(startTime, 'dd/MM/yyyy HH:mm:ss'),
                        endTime: format(endTime, 'dd/MM/yyyy HH:mm:ss'),
                        totalMoney,
                        totalTablePrice,
                        totalTime: `${hours} giờ ${minutes} phút`, // Thêm tổng thời gian vào state
                    });
                } else {
                    setTableType('Không xác định');
                    setTablePrice(0);
                }
            }
    
            setShowForm(true);
        } catch (error) {
            setError('Có lỗi xảy ra khi lấy dữ liệu chi tiết bàn.');
            console.error('Chi tiết lỗi:', error);
        }
    };


    const handleUpdateInvoice = async () => {
        try {
            console.log("Booking:", selectedBooking.bookingId);
            if (!selectedBooking || !selectedBooking.bookingId) {
                alert('Vui lòng chọn một đơn đặt.');
                return;
            }
    
            if (!formValues.totalMoney) {
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
                totalMoney: formValues.totalMoney,  
                status: 'Chờ Thanh Toán',  
            };
    
            const response = await axios.put(`/api/invoices/update/bill-totalMoney/${selectedBooking.bookingId}`, updatedInvoice);
    
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


    const handleConfirmInvoice = async () => {
        if (!setSelectedInvoice) {
            alert('Vui lòng chọn một đơn đặt.');
            return;
        }

        try {

            console.log(selectedInvoice.bookingId); // Kiểm tra giá trị của bookingId

            // Cập nhật trạng thái đơn đặt bàn
        await axios.put(`/api/bookings/update/${selectedInvoice.bookingId}/status`, {
            status: "Đã Thanh Toán" // Cập nhật trạng thái đơn đặt thành "Đã Thanh Toán"
        });

            // Update invoice status to "Đã Thanh Toán"
            const updatedInvoice = {
                ...selectedBooking,
                status: 'Đã Thanh Toán',
            };

            await axios.put(`/api/invoices/update/${selectedInvoice.id}`, updatedInvoice);

            
            
            // Alert success and refresh invoices
            alert('Hóa đơn đã được cập nhật thành công!');

            // Export to Excel
            handleExportToExcel([updatedInvoice]);

            // Refresh invoice list
            fetchInvoices();

            // Close confirmation dialog
            setShowForm(false);
            setSelectedBooking(null);
        } catch (error) {
            console.error('Error updating invoice:', error);
            alert('Có lỗi xảy ra khi cập nhật hóa đơn. Vui lòng thử lại.');
        }
    };

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

    const handleRefresh = () => {
        window.location.reload();
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
                                            <th className="border px-4 py-2 text-center">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterInvoicesByStatus('Chưa Thanh Toán').map(invoice => (
                                            <tr key={invoice.id}>
                                                <td className="border px-4 py-2 text-center">{invoice.id}</td>
                                                {/* <td className="border px-4 py-2 text-center">{format(new Date(invoice.startTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(invoice.endTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(invoice.billDate), 'dd/MM/yyyy HH:mm:ss')}</td> */}
                                                 <td className="border px-4 py-2 text-center">{formatDate(invoice.startTime)}</td>
                                                <td className="border px-4 py-2 text-center">{formatDate(invoice.endTime)}</td>
                                                <td className="border px-4 py-2 text-center">{formatDate(invoice.billDate)}</td>
                                                <td className="border px-4 py-2 text-center">{formatCurrency(invoice.totalMoney)} VND</td>
                                                <td className="border px-4 py-2 text-center">{invoice.status}</td>
                                                <td className="border px-4 py-2 text-center">{invoice.bookingId}</td>
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
                                            <th className="border px-4 py-2 text-center">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterInvoicesByStatus('Chờ Thanh Toán').map(invoice => (
                                            <tr key={invoice.id}>
                                                <td className="border px-4 py-2 text-center">{invoice.id}</td>
                                                {/* <td className="border px-4 py-2 text-center">{format(new Date(invoice.startTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(invoice.endTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(invoice.billDate), 'dd/MM/yyyy HH:mm:ss')}</td> */}
                                                 <td className="border px-4 py-2 text-center">{formatDate(invoice.startTime)}</td>
            <td className="border px-4 py-2 text-center">{formatDate(invoice.endTime)}</td>
            <td className="border px-4 py-2 text-center">{formatDate(invoice.billDate)}</td>
                                                <td className="border px-4 py-2 text-center">{formatCurrency(invoice.totalMoney)} VND</td>
                                                <td className="border px-4 py-2 text-center">{invoice.status}</td>
                                                <td className="border px-4 py-2 text-center">{invoice.bookingId}</td>
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
                                           
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterInvoicesByStatus('Đã Thanh Toán').map(invoice => (
                                            <tr key={invoice.id}>
                                                <td className="border px-4 py-2 text-center">{invoice.id}</td>
                                                {/* <td className="border px-4 py-2 text-center">{format(new Date(invoice.startTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(invoice.endTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td className="border px-4 py-2 text-center">{format(new Date(invoice.billDate), 'dd/MM/yyyy HH:mm:ss')}</td> */}
                                                 <td className="border px-4 py-2 text-center">{formatDate(invoice.startTime)}</td>
            <td className="border px-4 py-2 text-center">{formatDate(invoice.endTime)}</td>
            <td className="border px-4 py-2 text-center">{formatDate(invoice.billDate)}</td>
                                                <td className="border px-4 py-2 text-center">{formatCurrency(invoice.totalMoney)} VND</td>
                                                <td className="border px-4 py-2 text-center">{invoice.status}</td>
                                                <td className="border px-4 py-2 text-center">{invoice.bookingId}</td>
                                                
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>

                        
                    </Tabs>

                    
                    {showForm && selectedBooking && (
                        <div className="bg-white p-6 mt-4 rounded shadow">
                            <h2 className="text-2xl font-semibold mb-4">Thông Tin Chi Tiết</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Mã Đơn Đặt:</label>
                                    <input type="text" value={selectedBooking.bookingId} readOnly className="border border-gray-300 rounded p-2 w-full" />
                                    <label className="block mb-2">Danh Sách Bàn:</label>
                                    <input type="text" value={tableIds.join(', ')} readOnly className="border border-gray-300 rounded p-2 w-full" />
                                    <label className="block mb-2">Loại Bàn:</label>
                                    <input type="text" value={tableType} readOnly className="border border-gray-300 rounded p-2 w-full" />
                                    <label className="block mb-2">Giá Loại Bàn:</label>
                                    <input type="text" value={tablePrice.map(price => `${formatCurrency(price)} VND`).join(', ')} readOnly className="border border-gray-300 rounded p-2 w-full" />
                                    <label className="block mb-2">Tổng Giá Loại Bàn:</label>
                                    <input type="text" value={`${formatCurrency(formValues.totalTablePrice)} VND`} readOnly className="border border-gray-300 rounded p-2 w-full" />
                                </div>

                                

                                <div>
                                    <label className="block mb-2">Thời Gian Bắt Đầu:</label>
                                    <input type="text" value={formValues.startTime} readOnly className="border border-gray-300 rounded p-2 w-full" />
                                    <label className="block mb-2">Thời Gian Kết Thúc:</label>
                                    <input type="text" value={formValues.endTime} readOnly className="border border-gray-300 rounded p-2 w-full" />
                                    <label className="block mb-2">Tổng Thời Gian:</label>
                                    <input type="text" value={formValues.totalTime} readOnly className="border border-gray-300 rounded p-2 w-full" />                           
                                    <label className="block mb-2">Tổng Tiền:</label>
                                    <input type="text" value={`${formatCurrency(formValues.totalMoney)} VND`} readOnly className="border border-gray-300 rounded p-2 w-full" />
                                    
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

