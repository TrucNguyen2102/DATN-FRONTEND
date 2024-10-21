import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { table } from "@nextui-org/react";

const TablePlay = () => {
    const [tables, setTables] = useState([]);
    const [error, setError] = useState('');
    const [newTable, setNewTable] = useState({ name: '' }); // State để quản lý bàn
    const [showForm, setShowForm] = useState(false); // State để kiểm soát hiển thị form

    const handleRefresh = () => {
        window.location.reload(); // Tải lại trang
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar className="w-1/4 bg-gray-200 p-4" />
                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Bàn</h1>
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        {/* Nút để hiển thị form thêm loại bàn mới */}
                        <button 
                            onClick={() => setShowForm(!showForm)} 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 mr-5"
                        >
                            {showForm ? 'Ẩn Form' : 'Thêm Loại'}
                        </button>

                        <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                                Làm Mới
                        </button>

                        {/* Bảng hiển thị danh sách loại bàn */}
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
                                        
                                        <td className="py-2 px-4 border text-center">
                                            <button onClick={() => handleEditTable(table)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700">
                                                Sửa
                                            </button>
                                            <button onClick={() => handleDeleteTable(table.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-2">
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                </main>
            </div>
        </div>
    )
}
export default TablePlay;