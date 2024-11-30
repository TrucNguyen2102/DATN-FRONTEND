import ManagerHeader from "../components/Header/ManagerHeader";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import StaffSidebar from "../components/Sidebar/StaffSidebar";
import { FaRegClock } from 'react-icons/fa';

const TablePlay = () => {
    const [tables, setTables] = useState([]);
    const [tableTypes, setTableTypes] = useState([]);
    const [prices, setPrices] = useState ([]);
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState('');
    const [newTable, setNewTable] = useState({ tableNum: '', tableStatus: '', typeId: '' });
    const [showForm, setShowForm] = useState(false);
    const [types, setTypes] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editingTableId, setEditingTableId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Thêm state để quản lý phân trang   
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5); // Số bản ghi mỗi trang

    const [elapsedTime, setElapsedTime] = useState({});

    const [selectedTab, setSelectedTab] = useState(null);

    const [filteredTables, setFilteredTables] = useState([]);
    
    

    // const fetchTables = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.get('/api/tables/all');
    //         console.log('Phản hồi từ API:', response.data);
    //         if (Array.isArray(response.data)) {
    //             setTables(response.data);
    //         } else {
    //             console.error('Dữ liệu trả về không phải là một mảng:', response.data);
    //             setTables([]);
    //         }
    //     } catch (error) {
    //         setError('Không thể tải danh sách bàn.');
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const fetchTables = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/tables/pages/all?page=${currentPage - 1}&size=${pageSize}`);
            console.log('Phản hồi từ API:', response.data);
            if (Array.isArray(response.data.content)) {
                setTables(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                console.error('Dữ liệu trả về không phải là một mảng:', response.data);
                setTables([]);
            }
        } catch (error) {
            setError('Không thể tải danh sách bàn.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/tables/types/all');
            console.log('Phản hồi từ API:', response.data);
            if (Array.isArray(response.data)) {
                setTypes(response.data);
            } else {
                console.error('Dữ liệu trả về không phải là một mảng:', response.data);
                setTypes([]);
            }
        } catch (error) {
            setError('Không thể tải danh sách loại bàn.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/tables/prices/all');  // API lấy giá từ bảng giá
            console.log('Phản hồi từ API bảng giá:', response.data);
            if (Array.isArray(response.data)) {
                setPrices(response.data);  // Lưu thông tin bảng giá
            } else {
                console.error('Dữ liệu trả về không phải là một mảng:', response.data);
                setPrices([]);  // Nếu không phải mảng, xử lý lỗi
            }
        } catch (error) {
            setError('Không thể tải bảng giá.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/invoices/all'); // Đường dẫn API cần thay bằng endpoint thực tế
            console.log('Phản hồi từ API hóa đơn:', response.data);
            if (Array.isArray(response.data)) {
                setInvoices(response.data); // Lưu danh sách hóa đơn
            } else {
                console.error('Dữ liệu trả về không phải là một mảng:', response.data);
                setInvoices([]); // Nếu không phải mảng, xử lý lỗi
            }
        } catch (error) {
            setError('Không thể tải danh sách hóa đơn.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filterPlayingTables = () => {
        const playingTables = tables
            .filter((table) => table.tableStatus === "Đang Chơi")
            .map((table) => {
                const invoice = invoices.find((invoice) => invoice.tableId === table.id);
                return {
                    ...table,
                    startTime: invoice ? invoice.startTime : null,
                };
            });
        setFilteredTables(playingTables);
    };

    const formatCurrency = (value) => {
        if (value == null || isNaN(value)) {
            console.error("formatCurrency nhận giá trị không hợp lệ:", value);
            return "0"; // Trả về giá trị mặc định nếu không hợp lệ
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    
    
    

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const validateForm = () => {
        if (!newTable.tableNum || !newTable.tableStatus || !newTable.typeId) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return false;
        }
        return true;
    };

    const handleAddOrUpdateTable = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Ngừng nếu không hợp lệ
        }

        const tableData = {
            tableNum: newTable.tableNum,
            tableStatus: newTable.tableStatus,
            typeId: newTable.typeId
        };
        try {
            const isDuplicate = tables.some(table => table.tableNum === newTable.tableNum && (!isEdit || table.id !== editingTableId));
            if (isDuplicate) {
                alert('Số bàn đã tồn tại!');
                return;
            }

            if (isEdit) {
                await axios.put(`/api/tables/update/${editingTableId}`, tableData);
            } else {
                await axios.post('/api/tables/add', tableData);
            }

            setShowForm(false);
            fetchTables();
        } catch (error) {
            setError('Lỗi khi lưu bàn! Hãy thử lại.');
            console.error(error);
        }
    };

    
    const handleEditTable = (table) => {
        setNewTable({
            tableNum: table.tableNum,
            tableStatus: table.tableStatus,
            // typeId: table.type.id, // Sử dụng type.id
             typeId: table.type.id

        });
        setEditingTableId(table.id);
        setIsEdit(true);
        setShowForm(true);
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    useEffect(() => {
        fetchTables();
        fetchTypes();
        fetchInvoices();
        fetchPrices();
        
    }, [currentPage, pageSize]);

    // useEffect(() => {
    //     fetchPrices();
    // }, []);

    useEffect(() => {
        filterPlayingTables();
    }, [tables, invoices]);
    

    // Hàm để tra cứu giá từ bảng giá
    const getPriceById = (priceId) => {
        const price = prices.find(price => price.id === priceId);  // Tìm giá trong mảng bảng giá
        return price ? price.price : 'Chưa có giá';  // Nếu tìm thấy, trả về giá, nếu không có, trả về thông báo
    };


    // Lấy `startTime` từ bảng hóa đơn dựa vào `tableId`
    const getStartTimeForTable = (tableId) => {
        const invoice = invoices.find((invoice) => invoice.tableId === tableId && invoice.status === 'Chưa Thanh Toán');
        return invoice ? invoice.startTime : null;
    };

    // Tính toán thời gian đã chơi
    const calculateElapsedTime = (startTime) => {
        if (!startTime) return "N/A";

        const now = new Date();
        const start = new Date(startTime);
        const diffMs = now - start; // Chênh lệch thời gian (ms)
        const hours = Math.floor(diffMs / 3600000); // Số giờ
        const minutes = Math.floor((diffMs % 3600000) / 60000); // Số phút
        const seconds = Math.floor((diffMs % 60000) / 1000); // Số giây
        return `${hours} giờ ${minutes} phút ${seconds} giây`;
    };

    // Cập nhật thời gian đã chơi cho các bàn
    const updateElapsedTimes = () => {
        const newElapsedTime = {};
        tables.forEach((table) => {
            if (table.tableStatus === 'Đang Chơi') {
                const startTime = getStartTimeForTable(table.id);
                if (startTime) {
                    newElapsedTime[table.id] = calculateElapsedTime(startTime);
                }
            }
        });
        setElapsedTime(newElapsedTime);
    };

    // Cập nhật thời gian đã chơi mỗi giây
    useEffect(() => {
        const intervalId = setInterval(() => {
            updateElapsedTimes();
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(intervalId); // Xóa interval khi component bị unmount
    }, [tables, invoices]);




    

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <ManagerHeader />
            <div className="flex flex-1">
                <StaffSidebar className="w-1/4 bg-gray-200 p-4" />
                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Bàn</h1>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    
                    {loading ? <p>Đang tải...</p> : null}

                    {/* <button 
                        onClick={() => setShowForm(!showForm)} 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 mr-5"
                    >
                        {showForm ? 'Ẩn Form' : 'Thêm Bàn'}
                    </button> */}

                    <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mb-4">
                        Làm Mới
                    </button>

                    {showForm && (
                        <div className="mb-8">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold">Số Bàn</label>
                                <input 
                                    type="text" 
                                    className="border border-gray-300 rounded px-4 py-2 w-full" 
                                    value={newTable.tableNum}
                                    onChange={e => setNewTable({ ...newTable, tableNum: e.target.value })}
                                    disabled={!!newTable.tableNum}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold">Trạng Thái Bàn</label>
                                <select 
                                    className="border border-gray-300 rounded px-4 py-2 w-full" 
                                    value={newTable.tableStatus}
                                    onChange={e => setNewTable({ ...newTable, tableStatus: e.target.value })}
                                >
                                    <option value="Chọn">Chọn</option>
                                    <option value="Trống">Trống</option>
                                    <option value="Đã Đặt">Đã Đặt</option>
                                    <option value="Đang Chơi">Đang Chơi</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold">Loại Bàn</label>
                                <select 
                                    className="border border-gray-300 rounded px-4 py-2 w-full" 
                                    value={newTable.typeId}
                                    onChange={e => setNewTable({ ...newTable, typeId: e.target.value })}
                                    disabled={!!newTable.typeId}
                                >
                                    <option value="">Chọn loại bàn</option>
                                    {types.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option> 
                                    ))}
                                </select>
                            </div>

                            <button 
                                onClick={handleAddOrUpdateTable} 
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                {isEdit ? 'Cập Nhật' : 'Thêm Bàn'}
                            </button>
                        </div>
                    )}

                    <table className="min-w-full bg-white border border-gray-300 table-fixed">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-r w-1/5">ID</th>
                                <th className="py-2 px-4 border-b border-r w-1/5">Số Bàn</th>
                                <th className="py-2 px-4 border-b border-r w-1/5">Trạng Thái Bàn</th>
                                <th className="py-2 px-4 border-b border-r w-1/5">Loại Bàn</th>
                                <th className="py-2 px-4 border-b border-r w-1/5">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map(table => (
                                <tr key={table.id}>
                                    <td className="py-2 px-4 border text-center">{table.id}</td>
                                    <td className="py-2 px-4 border text-center">{table.tableNum}</td>
                                    <td className="py-2 px-4 border text-center">{table.tableStatus}</td>
                                    <td className="py-2 px-4 border text-center">
                                        {/* {types.find(type => type.id === table.type.id)?.name || 'Chưa xác định'} */}
                                        {table.type.name}
                                    </td>
                                    <td className="py-2 px-4 border text-center">
                                        {/* <button onClick={() => handleViewTable(table)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700">
                                            Xem
                                        </button> */}
                                        <button onClick={() => handleEditTable(table)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700">
                                            Sửa
                                        </button>
                                        {/* <button onClick={() => handleDeleteTable(table.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2">
                                            Xóa
                                        </button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Hiển thị phân trang */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mb-4"
                        >
                            Trước
                        </button>
                        <span className="px-4 py-2">{`Trang ${currentPage} / ${totalPages}`}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mb-4"
                        >
                            Sau
                        </button>
                    </div>

                    
                    <div className="mt-4 text-center">
                        {/* <h3 className="text-xl font-semibold mb-4">Bàn Đang Chơi:</h3> */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {tables
                                .filter(table => table.tableStatus === "Đang Chơi")
                                .map((table) => (
                                    <div key={`${table.id}-${table.tableNum}`}>
                                        {/* Thời gian hiển thị bên ngoài khung */}
                                        <p className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
                                            <FaRegClock className="text-xl" />
                                                {elapsedTime[table.id] || "Đang tính toán..."}
                                        </p>

                                        {/* Khung chính của table */}
                                        <div
                                            className={`p-6 border rounded-lg shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 ${
                                                table.tableStatus === "Đang Chơi"
                                                    ? 'bg-orange-100 border-orange-400'
                                                    : ''
                                            }`}
                                        >
                                            <div className="text-center">
                                                <h2 className="text-xl font-bold mb-2">Bàn {table.tableNum}</h2>
                                                <p className="text-gray-700 mb-1">Trạng thái: {table.tableStatus}</p>
                                                <p className="text-gray-700 mb-1">Loại: {table.type.name}</p>
                                                <p className="text-gray-700 font-semibold">
                                                    Giá loại bàn: {
                                                        table.type.priceIds && table.type.priceIds.length > 0
                                                            ? formatCurrency(getPriceById(table.type.priceIds[0])) // Lấy giá từ bảng giá
                                                            : "Chưa có giá"
                                                    } VND
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>


                    
                </main>
            </div>
        </div>
    );
}

export default TablePlay;
