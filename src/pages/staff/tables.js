import ManagerHeader from "../components/Header/ManagerHeader";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import StaffSidebar from "../components/Sidebar/StaffSidebar";

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
            typeId: table.type.id, // Sử dụng type.id
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
    }, [currentPage, pageSize]);

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
                                        {types.find(type => type.id === table.type.id)?.name || 'Chưa xác định'}
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
                </main>
            </div>
        </div>
    );
}

export default TablePlay;
