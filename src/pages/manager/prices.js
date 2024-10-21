import { useState, useEffect, useContext } from 'react';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';

const PricesPage = () => {
    
    const [prices, setPrices] = useState([]);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false); // Quản lý trạng thái hiển thị form
    const [newPrice, setNewPrice] = useState({
        id: null,
        price: '',
        startDate: '',
        endDate: ''
    });

    const { user } = useContext(AuthContext);
    console.log(user);
     

    // const fetchPrices = async () => {
    //     try {
    //         const response = await axios.get('/api/tables/prices/all');
    //         setPrices(response.data);
    //     } catch (error) {
    //         setError('Không thể tải danh sách giá.');
    //         console.error(error);
    //     }
    // };

    

    const fetchPrices = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Chưa đăng nhập hoặc token không tồn tại.');
    
            const response = await axios.get('/api/tables/prices/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (Array.isArray(response.data)) {
                // Xử lý dữ liệu trả về
                const processedData = response.data.map(item => ({
                    id: item.id,
                    price: item.price,
                    startDate: item.startDate,
                    endDate: item.endDate
                }));
                
                setPrices(processedData);  // Gán dữ liệu đã xử lý cho state 'prices'
            } else {
                setError('Dữ liệu không hợp lệ.');
            }
        } catch (error) {
            setError('Không thể tải danh sách giá.');
            console.error(error);
        }
    };
    
    
    
    

    useEffect(() => {
        fetchPrices();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPrice(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRefresh = () => {
        window.location.reload(); // Tải lại trang
    };

    

    const handleAddOrUpdatePrice = async (e) => {
        e.preventDefault();
        try {
            if (newPrice.id) {
                // Nếu có ID, thực hiện sửa
                const response = await axios.put(`/api/tables/prices/update/${newPrice.id}`, newPrice);
                setPrices(prices.map(price => (price.id === response.data.id ? response.data : price))); // Cập nhật danh sách giá
            } else {
                // Thêm mới
                const response = await axios.post('/api/tables/prices/add', newPrice);
                setPrices([...prices, response.data]); // Cập nhật danh sách giá sau khi thêm mới
            }
            setNewPrice({ id: null, price: '', startDate: '', endDate: '' }); // Reset form
            setShowForm(false); // Ẩn form sau khi thêm/sửa
        } catch (error) {
            alert("Lỗi khi thêm/sửa giá", error);
        }
    };

    const handleEditPrice = (price) => {
        setNewPrice(price); // Đặt giá trị cho form sửa
        setShowForm(true); // Hiển thị form để sửa
    };

    const handleDeletePrice = async (id) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa giá này không?`)) {
            try {
                await axios.delete(`/api/tables/prices/delete/${id}`);
                setPrices(prices.filter(price => price.id !== id)); // Cập nhật danh sách giá
            } catch (error) {
                console.error("Lỗi khi xóa giá", error);
            }
        }
    };

    const formatPrice = (price) => {
        return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`; // Sử dụng dấu chấm cho hàng ngàn
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('vi-VN', options); // Định dạng ngày sang tiếng Việt
    };

   
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />

            <div className="flex flex-1">
                <Sidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Giá</h1>
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                            onClick={() => {
                                setShowForm(!showForm); setNewPrice({ id: null, price: '', startDate: '', endDate: '' }); }} 
                            className="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-700 mr-5"
                        >
                            {showForm ? 'Ẩn Form' : 'Thêm Giá'}
                    </button>

                    <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                                Làm Mới
                    </button>

                    {/* Form để thêm/sửa giá */}
                    {showForm && (
                        <form onSubmit={handleAddOrUpdatePrice} className="mb-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold">Giá</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={newPrice.price}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold">Ngày Áp Dụng</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={newPrice.startDate}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold">Ngày Kết Thúc</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={newPrice.endDate}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2"
                                    required
                                />
                            </div>

                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                                {newPrice.id ? 'Cập Nhật' : 'Thêm'}
                            </button>
                        </form>
                    )}

                    {/* Bảng hiển thị danh sách giá */}
                    <table className="min-w-full bg-white border border-gray-300 table-fixed">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-r w-1/5">ID</th>
                            <th className="py-2 px-4 border-b border-r w-1/5">Giá</th>
                            <th className="py-2 px-4 border-b border-r w-1/5">Ngày Áp Dụng</th>
                            <th className="py-2 px-4 border-b border-r w-1/5">Ngày Kết Thúc</th>
                            <th className="py-2 px-4 border-b border-r w-1/5">Hành Động</th>
                        </tr>
                        </thead>

                        <tbody>
                        {prices.map((price) => (
                            <tr key={price.id}>
                                <td className="py-2 px-4 border text-center">{price.id}</td>
                                <td className="py-2 px-4 border text-center">{formatPrice(price.price)}</td>
                                <td className="py-2 px-4 border text-center">{formatDate(price.startDate)}</td>
                                <td className="py-2 px-4 border text-center">{formatDate(price.endDate)}</td>
                                <td className="py-2 px-4 border text-center">
                                    <button onClick={() => handleEditPrice(price)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700">
                                        Sửa
                                    </button>
                                    <button onClick={() => handleDeletePrice(price.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-2">
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
    );
};

export default PricesPage;
