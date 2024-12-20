import ManagerHeader from "../../components/Header/ManagerHeader"
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../contexts/AuthContext';
import ManagerSidebar from "../../components/Sidebar/ManagerSidebar";
import { FaSyncAlt, FaPlus, FaEdit, FaTrash  } from "react-icons/fa"

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

    // Thêm state để quản lý phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5); // Số bản ghi mỗi trang

    const { user } = useContext(AuthContext);
    console.log(user);

    // const fetchMenus = async () => {
    //     try {
            
    
    //         const response = await axios.get('/api/menus/all', {
                
    //         });
    
    //         if (Array.isArray(response.data)) {
    //             // Xử lý dữ liệu trả về
    //             const processedData = response.data.map(item => ({
    //                 id: item.id,
    //                 itemName: item.itemName,
    //                 price: item.price,
                    
    //             }));
                
    //             setMenus(processedData);
    //         } else {
    //             setError('Dữ liệu không hợp lệ.');
    //         }
    //     } catch (error) {
    //         setError('Không thể tải danh sách menu.');
    //         console.error(error);
    //     }
    // };

    const fetchMenus = async (page = 1, size = 5) => {
        try {
            const response = await axios.get('/api/menus/pages/all', {
                params: { page: page - 1, size }, // Backend sử dụng page bắt đầu từ 0
            });
    
            const { content, totalPages } = response.data;
            setMenus(content); // `content` chứa danh sách menu
            setTotalPages(totalPages); // Tổng số trang
            setCurrentPage(page); // Cập nhật trang hiện tại
        } catch (error) {
            setError('Không thể tải danh sách menu.');
            console.error(error);
        }
    };
    

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            fetchMenus(newPage, pageSize); // Gọi API với trang mới
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
        try {
            // Kiểm tra xem loại bàn có được sử dụng trong bất kỳ bàn chơi nào không
            const response = await axios.get(`/api/orders/check-menu-used/${id}`);
            console.log("Response:", response.data);

            if (response.data) {
                // Nếu loại bàn đang được sử dụng, hiển thị thông báo và không xóa
                alert('Menu này đang được sử dụng trong một đơn hoặc nhiều đơn món, không thể xóa.');
            } else {
                if (window.confirm(`Bạn có chắc chắn muốn xóa menu này không?`)) {
                    try {
                        await axios.delete(`/api/menus/delete/${id}`);
                        setMenus(menus.filter(menu => menu.id !== id));
                    } catch (error) {
                        console.error("Lỗi khi xóa menu", error);
                    }
                }
            } 
        }catch (error) {
            console.error("Lỗi khi kiểm tra/xóa menu", error);
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

                        <div className="flex mb-4">
                            <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1">
                                <FaSyncAlt className="text-white" />   Làm Mới
                            </button>

                            <button
                                onClick={() => {
                                    setShowForm(!showForm); setNewMenu({ id: null, itemName: '', price: ''}); }} 
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2 flex items-center gap-1"
                            >
                                <FaPlus className="text-white" />
                                {/* {showForm ? 'Ẩn Form' : 'Thêm Menu'} */}
                                Thêm Menu
                            </button>
                        </div>
                        

                        

                        {showForm && (
                            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded shadow-lg w-96">
                                <h2 className="text-xl font-bold mb-4 text-center">{newMenu.id ? 'Sửa Menu' : 'Thêm Menu'}</h2>
                                    <form onSubmit={handleAddOrUpdateMenu} className="mb-4">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold">
                                                Tên Món <span className="text-red-500">*</span>
                                            </label>
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
                                            <label className="block text-gray-700 font-bold">
                                                Giá <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={newMenu.price}
                                                onChange={handleInputChange}
                                                className="w-full border px-3 py-2"
                                                required
                                            />
                                        </div>

                                        <div className="flex mt-4 space-x-2">
                                            <button type="submit" className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                                {newMenu.id ? 'Chỉnh Sửa' : 'Thêm'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
                                            >
                                                Hủy
                                            </button>
                                        </div>

                                        

                                    </form>
                                </div>
                                
                            </div>
                            
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
                                        

                                        <td className="flex py-2 px-4 border text-center justify-center">
                                            <button onClick={() => handleEditMenu(menu)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700 flex items-center gap-1">
                                                <FaEdit className="text-white" /> Sửa
                                            </button>
                                            <button onClick={() => handleDeleteMenu(menu.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-2 flex items-center gap-1">
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
    )
}

export default MenusPage;