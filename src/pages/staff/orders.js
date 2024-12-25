
import React, { useState, useEffect } from "react";
import axios from "axios";
import StaffHeader from "../../components/Header/StaffHeader";
import StaffSidebar from "../../components/Sidebar/StaffSidebar";
import { FaPlus, FaSyncAlt  } from "react-icons/fa"

const MenuManagement = () => {
    const [tables, setTables] = useState([]); // Danh sách bàn
    const [menuItems, setMenuItems] = useState([]); // Danh sách menu
    const [selectedTable, setSelectedTable] = useState(""); // Bàn được chọn
    const [selectedMenu, setSelectedMenu] = useState(""); // Món được chọn
    const [quantity, setQuantity] = useState(1); // Số lượng
    const [orders, setOrders] = useState([]); // Danh sách đơn món cho bàn
    const [invoices, setInvoices] = useState(null); //

    const [error, setError] = useState(""); // Lỗi khi thêm món
    const [isAdding, setIsAdding] = useState(false); // Điều khiển việc hiển thị form thêm món
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Set the number of items per page
    const [totalPages, setTotalPages] = useState(1);
    
    const formatCurrency = (value) => {
        if (value == null || isNaN(value)) {
            console.error("formatCurrency nhận giá trị không hợp lệ:", value);
            return "0"; // Trả về giá trị mặc định nếu không hợp lệ
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // useEffect(() => {
    //     const fetchOrderItem = async () => {
    //         try {
    //             const response = await axios.get("/api/orders/all");
    //             setOrders(response.data);
    //             setTotalPages(Math.ceil(response.data.length / itemsPerPage)); // Calculate total pages
    //         } catch (error) {
    //             console.error("Lỗi khi lấy danh sách order:", error);
    //         }
    //     };
    //     fetchOrderItem();
    // }, []);

    const fetchOrderItem = async () => {
        try {
            const response = await axios.get("/api/orders/all");
            if (response.data && Array.isArray(response.data)) {
                setOrders(response.data);
                setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            } else {
                console.warn("Dữ liệu hóa đơn không hợp lệ.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách order:", error);
        }
    };
    

    useEffect(() => {
        fetchOrderItem();
    }, []);
    

     // Handle page change
     const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Get current orders to display based on pagination
    const currentOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    const fetchInvoices = async () => {
        try {
            const response = await axios.get("/api/invoices/all");
            setInvoices(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách hóa đơn:", error);
        }
    };

    useEffect(() => {
        
        fetchInvoices();
    }, []);


    const fetchTables = async () => {
        try {
            const response = await axios.get("/api/tables/all");
            setTables(response.data);
            console.log("Danh sách bàn: ", response.data); 
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bàn:", error);
        }
    };

    // Lấy danh sách bàn
    useEffect(() => {
        
        fetchTables();
    }, []);


    const fetchMenuItems = async () => {
        try {
            const response = await axios.get("/api/menus/all");
            console.log("Menu Data:", response.data);
            setMenuItems(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách menu:", error);
        }
    };

    // Lấy danh sách menu
    useEffect(() => {
        
        fetchMenuItems();
    }, []);


    // Lấy invoiceId khi chọn bàn
    // useEffect(() => {
    //     const fetchInvoiceId = async (tableId) => {
    //         if (!tableId) return;

    //         try {
    //             const status = "Chưa Thanh Toán";
    //             const response = await axios.get(`/api/invoices/byTableIdAndStatus/${tableId}/${status}`);
    //             if (response.data) {
    //                 setInvoices(response.data.invoiceId);
    //             } else {
    //                 setInvoices(null);
    //                 console.warn("Không tìm thấy hóa đơn.");
    //             }
    //         } catch (error) {
    //             console.error("Lỗi khi lấy InvoiceId:", error);
    //             setInvoices(null);
    //         }
    //     };

    //     fetchInvoiceId(selectedTable);
    // }, [selectedTable]);

    const fetchInvoiceId = async (tableId) => {
        if (!tableId) return null;
    
        try {
            const status = "Chưa Thanh Toán";
            const response = await axios.get(`/api/invoices/byTableIdAndStatus/${tableId}/${status}`);
            
            if (response.data) {
                return response.data.invoiceId; // Trả về invoiceId thay vì setInvoices
            } else {
                console.warn("Không tìm thấy hóa đơn.");
                return null;
            }
        } catch (error) {
            console.error("Lỗi khi lấy InvoiceId:", error);
            return null;
        }
    };
    
    // Sử dụng useEffect để gọi fetchInvoiceId
    useEffect(() => {
        const getInvoiceId = async () => {
            if (!selectedTable) return;
            const invoiceId = await fetchInvoiceId(selectedTable);
            setInvoices(invoiceId); // Cập nhật state invoices
        };
    
        // if (selectedTable) {
            getInvoiceId();
        // }
    }, [selectedTable]);

    

    // Thêm món vào hóa đơn
    const handleAddOrder = async () => {
        if (!selectedTable || !selectedMenu || quantity <= 0) {
            alert("Vui lòng chọn bàn, món và nhập số lượng hợp lệ.");
            return;
        }

        // Kiểm tra trạng thái bàn
        const selectedTableData = tables.find((table) => table.id === parseInt(selectedTable));
        if (!selectedTableData || selectedTableData.tableStatus !== "Đang Chơi") {
            alert("Bạn chỉ có thể thêm món vào bàn đang chơi.");
            return;
        }

        const selectedItem = menuItems.find((item) => item.id === parseInt(selectedMenu));
        if (!selectedItem) {
            alert("Món không hợp lệ.");
            return;
        }

        // Kiểm tra số lượng tối đa cho phép
        const maxQuantity = 10; // Ví dụ: Giới hạn tối đa là 100
        if (quantity > maxQuantity) {
            alert(`Số lượng món vượt quá mức cho phép. Vui lòng chọn số lượng nhỏ hơn hoặc bằng ${maxQuantity}.`);
            return;
        }

        const price = selectedItem.price * quantity; // Tính giá dựa trên số lượng
         const invoiceId = await fetchInvoiceId(selectedTable); // Lấy invoiceId từ tableId
        //const invoiceId = invoices;

        if (!invoiceId) {
            alert("Không thể lấy InvoiceId.");
            return;
        }

        try {
            const response = await axios.post("/api/orders/add", {
                menuId: selectedMenu,
                quantity,
                invoiceId: invoiceId, // Dùng invoiceId đúng
                
                price, // Sử dụng giá đã tính toán (tổng giá của mục món)
            });

            console.log("Response:", response.data);
            

            // Reset form
            setSelectedMenu("");
            setQuantity(1);

            // // Cập nhật danh sách order
            // const updatedOrders = [...orders, response.data];
            // setOrders(updatedOrders);
            // Cập nhật danh sách order sau khi thêm món
            // setOrders((prevOrders) => [...prevOrders, response.data]);
            await fetchOrderItem();

            //await fetchTables();

            await fetchInvoices();

            // Ẩn form sau khi thêm món thành công
            setIsAdding(false);

            alert("Thêm món thành công!");
        } catch (error) {
            console.error("Lỗi khi thêm món vào hóa đơn:", error);
            setError("Không thể thêm món vào hóa đơn.");
        }
    };

    // Làm mới lại trang
    const handleRefresh = () => {
        window.location.reload();
    };


    // const handleTableChange = (e) => {
    //     setSelectedTable(e.target.value);
    //     // Cập nhật lại các món đã thêm vào hóa đơn với bàn mới
    //     updateOrdersWithTable(e.target.value);
    // };
    
    // const updateOrdersWithTable = (tableId) => {
    //     // Cập nhật thông tin bàn cho tất cả các món trong hóa đơn (có thể gửi API hoặc cập nhật trong trạng thái local)
    //     setCurrentOrders(currentOrders.map(order => ({
    //         ...order,
    //         tableId: tableId, // Cập nhật tableId cho tất cả các order
    //     })));
    // };
    

    // Chuyển đổi trạng thái hiển thị form
    const toggleAddForm = () => {
        setIsAdding(!isAdding);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <StaffHeader />
            <div className="flex flex-1">
                <StaffSidebar className="w-1/4 bg-gray-200 p-4" />
                <main className="flex-1 p-6">
                    <div className="p-4">
                        <h1 className="text-3xl font-semibold mb-8 text-center">Danh Sách Đơn Món</h1>
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        <div className="flex">
                            <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mb-4 flex items-center gap-1">
                                <FaSyncAlt className="text-white" />
                                Làm Mới
                            </button>

                            {/* Nút "Thêm" */}
                            <button
                                onClick={toggleAddForm}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 ml-2 flex items-center gap-1"
                            >
                                {/* <FaPlus  className="text-white" /> {isAdding ? 'Ẩn Form' : 'Thêm Đơn'} */}
                                <FaPlus  className="text-white" /> Thêm Đơn
                            </button>
                        </div>
                        

                        {/* Hiển thị form khi isAdding là true */}
                        {isAdding && (
                            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded shadow-lg w-96">
                                    <div className="mb-8">
                                        {/* Chọn bàn */}
                                        <div className="mb-4">
                                            <h2 className="text-xl text-center font-bold mb-4">Thêm Món</h2>
                                            <label className="block mb-2 font-semibold">Chọn Bàn</label>
                                            <select
                                                className="border rounded px-4 py-2 w-full"
                                                value={selectedTable}
                                                onChange={(e) => setSelectedTable(e.target.value)}
                                            
                                            >
                                                <option value="">-- Chọn Bàn --</option>
                                                {tables.map((table) => (
                                                    <option key={table.id} value={table.id}>
                                                        Bàn Số {table.tableNum} ({table.tableStatus})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Chọn món */}
                                        <div className="mb-4">
                                            <label className="block mb-2 font-semibold">Chọn Món</label>
                                            <select
                                                className="border rounded px-4 py-2 w-full"
                                                value={selectedMenu}
                                                onChange={(e) => setSelectedMenu(e.target.value)}
                                            >
                                                <option value="">-- Chọn Món --</option>
                                                {menuItems.map((menu) => (
                                                    <option key={menu.id} value={menu.id}>
                                                        {menu.itemName} ({formatCurrency(menu.price)} VND)
                                                    </option>
                                                ))}
                                            </select>
                                            <label className="block mt-4 mb-2 font-semibold">Số Lượng</label>
                                            <input
                                                type="number"
                                                className="border rounded px-4 py-2 w-full"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Number(e.target.value))}
                                                min="1"
                                            />

                                            <div className="mt-4 flex space-x-2">
                                                <button
                                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                                    onClick={handleAddOrder}
                                                >
                                                    Thêm 
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setIsAdding(false)}
                                                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
                                                    >
                                                        Hủy
                                                </button>
                                            </div>

                                            
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            
                        )}

                        {/* Danh sách đơn món */}
                         <div>
                             {/* <h2 className="text-xl font-bold mb-2 text-center">Danh Sách Đơn Món</h2> */}
                             <table className="min-w-full bg-white border border-gray-300 table-fixed">
                                    <thead>
                                     <tr>
                                         <th className="py-2 px-4 border-b border-r w-1/10">Item ID</th>
                                         <th className="py-2 px-4 border-b border-r w-1/10">Món</th>
                                         <th className="py-2 px-4 border-b border-r w-1/10">Đơn Giá</th>
                                         <th className="py-2 px-4 border-b border-r w-1/10">Số lượng</th>
                                         <th className="py-2 px-4 border-b border-r w-1/10">Tổng Giá Món</th>
                                         
                                         <th className="py-2 px-4 border-b border-r w-1/10">Bàn</th>
                                         <th className="py-2 px-4 border-b border-r w-1/10">Hóa Đơn</th>
                                        
                                     </tr>
                                 </thead>
                                
                                 <tbody>
                                     {/* {orders.map(order => { */}
                                    {currentOrders.map((order) => {
                                        // Tìm tên món từ menuItems bằng menuId
                                        const menuItem = menuItems.find(item => item.id === order.menuId);

                                        // Tìm hóa đơn (invoice) từ invoiceId của order
                                         //const invoice = invoices ? invoices.find(invoice => invoice.id === order.invoiceId) : null;
                                        const invoice =  Array.isArray(invoices) ? invoices.find(invoice => invoice.id === order.invoiceId) : null;

                                        // Nếu không tìm thấy hóa đơn, hiển thị thông báo lỗi
                                        if (!invoice) {
                                            console.log(`Không tìm thấy hóa đơn cho order ${order.id}`);
                                        }

                                        const tableId = invoice ? invoice.tableId : null;

                                        // Nếu không tìm thấy tableId, hiển thị thông báo lỗi
                                        if (!tableId) {
                                            console.log(`Không tìm thấy tableId cho hóa đơn ${order.invoiceId}`);
                                        }

                                        // Tìm bàn dựa trên tableId
                                        const table = tableId ? tables.find((table) => table.id === tableId) : null;

                                        // Nếu không tìm thấy bàn, hiển thị thông báo lỗi
                                        if (!table) {
                                            console.log(`Không tìm thấy bàn với tableId ${tableId}`);
                                        }

                                        // // Tính giá lại nếu cần
                                        // const calculatedPrice = menuItem ? menuItem.price * order.quantity : order.price;

                                        return (
                                            <tr key={order.id}>
                                                <td className="py-2 px-4 border text-center">{order.id}</td>
                                                <td className="py-2 px-4 border text-center">
                                                    {menuItem ? menuItem.itemName : 'Món không tồn tại'}
                                                </td>

                                                <td className="py-2 px-4 border text-center">
                                                    {menuItem ? formatCurrency(menuItem.price)  : 'Giá không được xác định'} VND
                                                </td>

                                                <td className="py-2 px-4 border text-center">{order.quantity}</td>
                                                <td className="py-2 px-4 border text-center">{formatCurrency(order.totalPriceItem)} VND</td>
                                                

                                                <td className="py-2 px-4 border text-center">
                                                    {table ? table.tableNum : 'Bàn không tồn tại'}
                                                    
                                                </td>

                                                <td className="py-2 px-4 border text-center">{order.invoiceId}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>

                            {/* Pagination Controls */}
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
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MenuManagement;
