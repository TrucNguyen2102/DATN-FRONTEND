import ManagerHeader from "../components/Header/ManagerHeader"
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import ManagerSidebar from "../components/Sidebar/ManagerSidebar";

const MenusPage = () => {
    const [menus, setMenus] = useState([]);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newMenu, setNewMenu] = useState({
        id: null,
        itemName: '',
        price: '',
        
    });
    const [isEditing, setIsEditing] = useState(false);

    const { user } = useContext(AuthContext);
    console.log(user);

    const fetchMenus = async () => {
        try {
            
    
            const response = await axios.get('/api/menus/all', {
                
            });
    
            if (Array.isArray(response.data)) {
                // Xử lý dữ liệu trả về
                const processedData = response.data.map(item => ({
                    id: item.id,
                    itemName: item.itemName,
                    price: item.price,
                    
                }));
                
                setMenus(processedData);
            } else {
                setError('Dữ liệu không hợp lệ.');
            }
        } catch (error) {
            setError('Không thể tải danh sách menu.');
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMenu(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddMenu = async () => {
        try {
            // Kiểm tra xem tên món đã tồn tại chưa
            const existingMenu = menus.find((menu) => menu.itemName === newMenu.itemName);
            if (existingMenu) {
                alert('Tên menu đã tồn tại');
                return;
            }
    
            const response = await axios.post('/api/menus/add', newMenu);
            setMenus([...menus, response.data]); // Thêm menu mới vào danh sách
    
            // Reset lại form
            setNewMenu({ id: null, itemName: '', price: '' });
            setShowForm(false); // Ẩn form sau khi hoàn thành
        } catch (error) {
            console.error("Lỗi khi thêm menu", error);
            setError("Có lỗi xảy ra khi thêm. Vui lòng thử lại.");
        }
    };
    
    const handleUpdateMenu = async () => {
        try {
            await axios.put(`/api/menus/update/${newMenu.id}`, newMenu);
            setMenus(menus.map(menu => (menu.id === newMenu.id ? newMenu : menu))); // Cập nhật menu trong danh sách
    
            // Reset lại form
            setNewMenu({ id: null, itemName: '', price: '' });
            setShowForm(false); // Ẩn form sau khi hoàn thành
        } catch (error) {
            console.error("Lỗi khi cập nhật menu", error);
            setError("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.");
        }
    };
    
    const handleAddOrUpdateMenu = async (e) => {
        e.preventDefault();
        if (newMenu.id) {
            // Nếu có ID, gọi hàm cập nhật
            await handleUpdateMenu();
        } else {
            // Nếu không có ID, gọi hàm thêm mới
            await handleAddMenu();
        }
    };
    

    const handleEditMenu = (menu) => {
        setNewMenu(menu); // Đặt giá trị cho form sửa
        setShowForm(true); // Hiển thị form để sửa
    };

    const handleDeleteMenu = async (id) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa menu này không?`)) {
            try {
                await axios.delete(`/api/menus/delete/${id}`);
                setMenus(menus.filter(menu => menu.id !== id));
            } catch (error) {
                console.error("Lỗi khi xóa menu", error);
            }
        }
    };

    const formatPrice = (price) => {
        return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`; // Sử dụng dấu chấm cho hàng ngàn
    };

    const handleRefresh = () => {
        window.location.reload(); // Tải lại trang
    };

    useEffect(() => {
        fetchMenus();
        
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
                <ManagerHeader />

                <div className="flex flex-1">
                    <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />

                    <main className="flex-1 p-6">
                        <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Menu</h1>
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        <button
                            onClick={() => {
                                setShowForm(!showForm); setNewMenu({ id: null, itemName: '', price: ''}); }} 
                            className="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-700 mr-5"
                        >
                            {showForm ? 'Ẩn Form' : 'Thêm Menu'}
                        </button>

                        <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                                Làm Mới
                        </button>

                        {showForm && (
                            <form onSubmit={handleAddOrUpdateMenu} className="mb-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold">Tên Món</label>
                                    <input
                                        type="text"
                                        name="itemName"
                                        value={newMenu.itemName}
                                        onChange={handleInputChange}
                                        className="w-full border px-3 py-2"
                                        required
                                        disabled={!!newMenu.id} // Vô hiệu hóa trường nhập khi đang sửa
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold">Giá</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newMenu.price}
                                        onChange={handleInputChange}
                                        className="w-full border px-3 py-2"
                                        required
                                    />
                                </div>

                                

                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                                    {newMenu.id ? 'Cập Nhật' : 'Thêm'}
                                </button>
                            </form>
                        )}

                        <table className="min-w-full bg-white border border-gray-300 table-fixed">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-r w-1/5">ID</th>
                                    <th className="py-2 px-4 border-b border-r w-1/5">Tên Món</th>
                                    <th className="py-2 px-4 border-b border-r w-1/5">Giá</th>
                                    <th className="py-2 px-4 border-b border-r w-1/5">Hành Động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {menus.map((menu) => (
                                    <tr key={menu.id}>
                                        <td className="py-2 px-4 border text-center">{menu.id}</td>
                                        <td className="py-2 px-4 border text-center">{menu.itemName}</td>
                                        <td className="py-2 px-4 border text-center">{formatPrice(menu.price)}</td>
                                        

                                        <td className="py-2 px-4 border text-center">
                                            <button onClick={() => handleEditMenu(menu)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700">
                                                Sửa
                                            </button>
                                            <button onClick={() => handleDeleteMenu(menu.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-2">
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

export default MenusPage;