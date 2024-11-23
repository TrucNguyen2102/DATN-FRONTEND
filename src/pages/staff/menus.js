import React, { useState, useEffect } from "react";
import axios from "axios";
import StaffHeader from "../components/Header/StaffHeader";
import StaffSidebar from "../components/Sidebar/StaffSidebar";

const MenuManagement = () => {
    const [tables, setTables] = useState([]); // Danh sách bàn
    const [menuItems, setMenuItems] = useState([]); // Danh sách menu
    const [selectedTable, setSelectedTable] = useState(""); // Bàn được chọn
    const [selectedMenu, setSelectedMenu] = useState(""); // Món được chọn
    const [quantity, setQuantity] = useState(1); // Số lượng
    const [orders, setOrders] = useState([]); // Danh sách đơn món cho bàn

    // Lấy danh sách bàn
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await axios.get("/api/tables/available");
                setTables(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bàn:", error);
            }
        };
        fetchTables();
    }, []);

    // Lấy danh sách menu
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get("/api/menu");
                setMenuItems(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách menu:", error);
            }
        };
        fetchMenuItems();
    }, []);

    // Thêm món vào danh sách đơn
    const handleAddOrder = async () => {
        if (!selectedTable || !selectedMenu || quantity <= 0) {
            alert("Vui lòng chọn bàn, món và nhập số lượng hợp lệ.");
            return;
        }

        try {
            const response = await axios.post(`/api/order/${selectedTable}`, {
                menuId: selectedMenu,
                quantity,
            });
            alert("Thêm món thành công!");

            // Cập nhật danh sách đơn món
            setOrders((prevOrders) => [
                ...prevOrders,
                {
                    table: selectedTable,
                    menu: menuItems.find((item) => item.id === selectedMenu).itemName,
                    quantity,
                },
            ]);

            // Reset form
            setSelectedMenu("");
            setQuantity(1);
        } catch (error) {
            console.error("Lỗi khi thêm món vào hóa đơn:", error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <StaffHeader/>
                <div className="flex flex-1">
                    <StaffSidebar className="w-1/4 bg-gray-200 p-4" />
                        <div className="p-4">
                            <h1 className="text-2xl font-bold mb-4">Quản lý menu</h1>

                            {/* Chọn bàn */}
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Chọn bàn:</label>
                                <select
                                    className="border rounded px-4 py-2 w-full"
                                    value={selectedTable}
                                    onChange={(e) => setSelectedTable(e.target.value)}
                                >
                                    <option value="">-- Chọn bàn --</option>
                                    {tables.map((table) => (
                                        <option key={table.id} value={table.id}>
                                            Bàn số {table.table_num} ({table.table_status})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Thêm món */}
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Chọn món:</label>
                                <select
                                    className="border rounded px-4 py-2 w-full"
                                    value={selectedMenu}
                                    onChange={(e) => setSelectedMenu(e.target.value)}
                                >
                                    <option value="">-- Chọn món --</option>
                                    {menuItems.map((menu) => (
                                        <option key={menu.id} value={menu.id}>
                                            {menu.itemName} ({menu.price} VND)
                                        </option>
                                    ))}
                                </select>
                                <label className="block mt-4 mb-2 font-semibold">Số lượng:</label>
                                <input
                                    type="number"
                                    className="border rounded px-4 py-2 w-full"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    min="1"
                                />
                                <button
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={handleAddOrder}
                                >
                                    Thêm vào hóa đơn
                                </button>
                            </div>

                            {/* Danh sách đơn món */}
                            <div>
                                <h2 className="text-xl font-bold mb-2">Danh sách đơn món</h2>
                                <table className="w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2">Bàn</th>
                                            <th className="border px-4 py-2">Món</th>
                                            <th className="border px-4 py-2">Số lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order, index) => (
                                            <tr key={index}>
                                                <td className="border px-4 py-2">Bàn {order.table}</td>
                                                <td className="border px-4 py-2">{order.menu}</td>
                                                <td className="border px-4 py-2">{order.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                </div>
            
        </div>
        
    );
};

export default MenuManagement;
