import { useEffect, useState, useContext } from "react";
import CustomerHeader from "../../components/Header/CustomerHeader";
import axios from "axios";

const CustomerMenu = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMenus = async () => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await axios.get("/api/menus/all");
    
            // Kiểm tra mã trạng thái và xử lý
            if (response.status === 200) {
                if (response.data.length === 0) {
                    // Nếu không có menu, thông báo không có menu
                    setMenus([]);  // Gán danh sách rỗng
                } else {
                    // Nếu có menu, gán vào state
                    setMenus(response.data);  // Gán dữ liệu vào menus
                }
            } else {
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            }
        } catch (err) {
            setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };
    

    // Gọi API khi component được mount
    useEffect(() => {
        fetchMenus();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <CustomerHeader/>
            <div className="bg-gray-100 min-h-screen p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Danh Sách Menu</h1>

            {/* Hiển thị trạng thái tải */}
            {loading && <p className="text-center">Đang tải dữ liệu...</p>}

            {/* Hiển thị lỗi */}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Hiển thị danh sách menu */}
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menus.map((menu) => (
                        <div
                            key={menu.id}
                            className="bg-white shadow-md rounded-lg p-4 border border-gray-300"
                        >
                            <h2 className="text-xl font-semibold mb-2">{menu.itemName}</h2>
                            <p className="text-gray-700 mb-2">
                                Giá: <span className="font-bold">{menu.price.toLocaleString()} VND</span>
                            </p>
                            {/* <p className="text-gray-600">{menu.description}</p> */}
                        </div>
                    ))}
                </div>
            )}

            {/* Hiển thị thông báo nếu danh sách trống */}
            {!loading && menus.length === 0 && (
                <p className="text-center text-gray-500">Không có menu nào để hiển thị.</p>
            )}
        </div>
        </div>
    )
}
export default CustomerMenu;