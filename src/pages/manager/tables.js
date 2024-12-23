import ManagerHeader from "../../components/Header/ManagerHeader";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import ManagerSidebar from "../../components/Sidebar/ManagerSidebar";
import { FaSyncAlt, FaPlus, FaEdit, FaTrash  } from "react-icons/fa"

const TablePlay = () => {
    const [tables, setTables] = useState([]);
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

    const fetchTables = async (page = 0, size = 5) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/tables/pages/all', {
                params: {
                    page: page,
                    size: size
                }
            });
            console.log('Phản hồi từ API:', response.data);
            if (response.data.content) {
                setTables(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                console.error('Dữ liệu trả về không đúng định dạng:', response.data);
            }
        } catch (error) {
            setError('Không thể tải danh sách bàn.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    

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

            alert("Thêm/Cập nhật bàn chơi thành công")

            setShowForm(false);
            fetchTables();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                // Hiển thị thông báo lỗi từ server
                alert(error.response.data.message);
            } else {
                // Hiển thị thông báo lỗi mặc định
                alert('Lỗi khi lưu bàn! Hãy thử lại.');
            }
        }
    };

    const handleEditTable = (table) => {
        setNewTable({
            tableNum: table.tableNum,
            tableStatus: table.tableStatus,
            typeId: table.type.id, // Sử dụng type.id
        });
        setEditingTableId(table.id);
        setIsEdit(true);
        setShowForm(true);
    };

    // const handleDeleteTable = async (id) => {
    //     if (window.confirm(`Bạn có chắc chắn muốn xóa bàn này không?`)) {
    //         try {
    //             await axios.delete(`/api/tables/delete/${id}`);
    //             fetchTables();
    //             alert('Xóa bàn thành công!'); // Thông báo thành công
    //         } catch (error) {
    //             setError('Lỗi khi xóa bàn! Hãy thử lại.');
    //             console.error(error);
    //         }
    //     }
    // };

    const handleDeleteTable = async (id) => {
        try {
            // // Gọi API kiểm tra xem bàn có đang trong booking không
            // const bookingResponse = await axios.get(`/api/bookings/booking_table/check-table-used/${id}`);
            // console.log("Booking Response:", bookingResponse.data);
            const invoiceResponse = await axios.get(`/api/invoices/check-table-used/${id}`);
            console.log("Invoice Response:", invoiceResponse.data);
    
            // if (bookingResponse.data || invoiceResponse.data) {
                if (invoiceResponse.data) {
                // Nếu bàn đang được sử dụng trong booking hoặc invoice, không cho phép xóa
                alert('Bàn này đang được sử dụng trong một đơn đặt bàn hoặc hóa đơn. Không thể xóa.');
            } else {
                // Nếu bàn chưa được sử dụng, tiếp tục xóa
                if (window.confirm('Bạn có chắc chắn muốn xóa bàn này không?')) {
                    await axios.delete(`/api/tables/delete/${id}`);
                    fetchTables();
                    alert('Xóa bàn thành công!');
                }
            }
        } catch (error) {
            setError('Lỗi khi xóa bàn! Hãy thử lại.');
            console.error(error);
        }
    };
    

    const handleRefresh = () => {
        window.location.reload();
    };

    // const handlePageChange = (page) => {
    //     setCurrentPage(page);
    // };

    // Hàm thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchTables(page - 1, pageSize); // Lưu ý: page trong API bắt đầu từ 0
    };
    


    useEffect(() => {
        // fetchTables();
        fetchTypes();
    }, []);

    // Gọi fetchTables với tham số phân trang
    useEffect(() => {
        fetchTables(currentPage - 1, pageSize);
    }, [currentPage, pageSize]);
    

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <ManagerHeader />
            <div className="flex flex-1">
                <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />
                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Bàn</h1>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    
                    {loading ? <p>Đang tải...</p> : null}

                    <div className="flex mb-4">
                        <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1">
                            <FaSyncAlt className="text-white" /> Làm Mới
                        </button>

                        <button 
                            onClick={() => setShowForm(!showForm)} 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2 flex items-center gap-1"
                        >
                            <FaPlus className="text-white" />
                            {/* {showForm ? 'Ẩn Form' : 'Thêm Bàn'} */}
                            Thêm Bàn
                        </button>
                    </div>
                    

                    

                    {showForm && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4 text-center">{isEdit ? 'Sửa Bàn' : 'Thêm Bàn'}</h2>
                            
                                <div className="mb-8">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold">
                                            Số Bàn <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            className="border border-gray-300 rounded px-4 py-2 w-full" 
                                            value={newTable.tableNum}
                                            onChange={e => setNewTable({ ...newTable, tableNum: e.target.value })}
                                            disabled={isEdit} // Vô hiệu hóa khi sửa
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold">
                                            Trạng Thái Bàn <span className="text-red-500">*</span>
                                        </label>
                                        <select 
                                            className="border border-gray-300 rounded px-4 py-2 w-full" 
                                            value={newTable.tableStatus}
                                            onChange={e => setNewTable({ ...newTable, tableStatus: e.target.value })}
                                        >
                                            <option value="">Chọn Trạng Thái</option>
                                            <option value="Trống">Trống</option>
                                            <option value="Đã Đặt">Đã Đặt</option>
                                            <option value="Đang Chơi">Đang Chơi</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold">
                                            Loại Bàn <span className="text-red-500">*</span>
                                        </label>
                                        <select 
                                            className="border border-gray-300 rounded px-4 py-2 w-full" 
                                            value={newTable.typeId}
                                            onChange={e => setNewTable({ ...newTable, typeId: e.target.value })}
                                            disabled={isEdit} // Vô hiệu hóa khi sửa
                                        >
                                            <option value="">Chọn Loại Bàn</option>
                                            {types.map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option> 
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex mt-4 space-x-2">
                                        <button 
                                            onClick={handleAddOrUpdateTable} 
                                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            {isEdit ? 'Chỉnh Sửa' : 'Thêm'}
                                        </button>

                                        <button
                                                    type="button"
                                                    onClick={() => setShowForm(false)}
                                                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
                                                >
                                                    Hủy
                                        </button>
                                    </div>

                                    
                                </div>
                            </div>
                            
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
                                        {types.find(type => type.id === table.type.id)?.name || 'Chưa xác định'}
                                    </td>
                                    <td className="flex py-2 px-4 border text-center justify-center">
                                        <button onClick={() => handleEditTable(table)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700 flex items-center gap-1">
                                            <FaEdit className="text-white" /> Sửa
                                        </button>
                                        <button onClick={() => handleDeleteTable(table.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-2 flex items-center gap-1">
                                            <FaTrash className="text-white" /> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* phân trang */}
                    {/* <div className="flex justify-center mt-4">
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



                </main>
            </div>
        </div>
    );
}

export default TablePlay;
