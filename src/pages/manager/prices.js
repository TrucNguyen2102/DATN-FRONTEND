import { useState, useEffect, useContext } from 'react';
import ManagerHeader from '../components/Header/ManagerHeader';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import ManagerSidebar from '../components/Sidebar/ManagerSidebar';
import { FaSyncAlt, FaPlus, FaEdit, FaTrash  } from "react-icons/fa"

const PricesPage = () => {
    
    const [prices, setPrices] = useState([]);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false); // Quản lý trạng thái hiển thị form
    const [newPrice, setNewPrice] = useState({
        id: null,
        price: '',
        startDate: '',
        endDate: '',

    });

    const { user } = useContext(AuthContext);
    console.log(user);
     


    const fetchPrices = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Chưa đăng nhập hoặc token không tồn tại.');
    
            const response = await axios.get('/api/tables/prices/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log("Response:", response.data);
    
            if (Array.isArray(response.data)) {
                // Xử lý dữ liệu trả về
                const processedData = response.data.map(item => ({
                    id: item.id,
                    price: item.price,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    active: item.active
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
            // Kiểm tra nếu endDate rỗng thì gán nó bằng null
            const priceData = { 
                ...newPrice,
                endDate: newPrice.endDate === '' ? null : newPrice.endDate
            };
    
            if (priceData.id) {
                // Nếu có ID, thực hiện sửa
                const response = await axios.put(`/api/tables/prices/update/${priceData.id}`, priceData);
                setPrices(prices.map(price => (price.id === response.data.id ? response.data : price))); // Cập nhật danh sách giá
            } else {
                // Thêm mới
                const response = await axios.post('/api/tables/prices/add', priceData);
                setPrices([...prices, response.data]); // Cập nhật danh sách giá sau khi thêm mới
            }
    
            setNewPrice({ id: null, price: '', startDate: '', endDate: '' }); // Reset form
            setShowForm(false); // Ẩn form sau khi thêm/sửa
        } catch (error) {
            alert("Lỗi khi thêm/sửa giá", error);
        }
    };

    const handleLockPrice = async (id) => {
        if (window.confirm(`Bạn có chắc chắn muốn khóa giá này không?`)) {
            try {
                const response = await axios.put(`/api/tables/prices/lock/${id}`);
                setPrices(prices.map(price => price.id === id ? { ...price, active: false } : price)); // Cập nhật trạng thái giá thành khóa
            } catch (error) {
                console.error("Lỗi khi khóa giá", error);
            }
        }
    };
    

    const handleEditPrice = (price) => {
        setNewPrice(price); // Đặt giá trị cho form sửa
        setShowForm(true); // Hiển thị form để sửa
    };

    // const handleDeletePrice = async (id) => {
    //     if (window.confirm(`Bạn có chắc chắn muốn xóa giá này không?`)) {
    //         try {
    //             await axios.delete(`/api/tables/prices/delete/${id}`);
    //             setPrices(prices.filter(price => price.id !== id)); // Cập nhật danh sách giá
    //         } catch (error) {
    //             console.error("Lỗi khi xóa giá", error);
    //         }
    //     }
    // };

    // const handleDeletePrice = async (id) => {
    //     if (window.confirm(`Bạn có chắc chắn muốn xóa giá này không?`)) {
    //         try {
    //             await axios.delete(`/api/tables/prices/delete/${id}`);
    //             setPrices(prices.filter(price => price.id !== id)); // Cập nhật danh sách giá
    //             alert("Xóa giá thành công!");
    //         } catch (error) {
    //             // Kiểm tra lỗi từ API
    //             if (error.response && error.response.status === 400) {
    //                 alert(error.response.data || "Giá đang được sử dụng, không thể xóa.");
    //             } else {
    //                 alert("Đã xảy ra lỗi khi xóa giá.");
    //             }
    //             console.error("Lỗi khi xóa giá", error);
    //         }
    //     }
    // };
    

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
            <ManagerHeader />

            <div className="flex flex-1">
                <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Giá</h1>
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <div className='flex mb-4'>
                        <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1">
                            <FaSyncAlt className="text-white" /> Làm Mới
                        </button>
                        

                        <button
                                onClick={() => {
                                    setShowForm(!showForm); setNewPrice({ id: null, price: '', startDate: '', endDate: '' }); }} 
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2 flex items-center gap-1"
                            >
                                <FaPlus className="text-white" />
                                {/* {showForm ? 'Ẩn Form' : 'Thêm Giá'} */}
                                Thêm Giá
                        </button>
                    </div>

                    

                    

                    {/* Form để thêm/sửa giá */}
                    {showForm && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded shadow-lg w-96">
                                <h2 className="text-xl font-bold mb-4 text-center">{newPrice.id ? 'Sửa Giá' : 'Thêm Giá'}</h2>
                                <form onSubmit={handleAddOrUpdatePrice}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold">
                                            Giá <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={newPrice.price}
                                            onChange={handleInputChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label 
                                            className="block text-gray-700 font-bold">
                                                Ngày Áp Dụng <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={newPrice.startDate}
                                            onChange={handleInputChange}
                                            className="w-full border px-3 py-2 rounded"
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
                                            className="w-full border px-3 py-2 rounded"
                                        />
                                    </div>
                                    <div className="mt-4 flex space-x-2">
                                        
                                        <button
                                            type="submit"
                                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            {newPrice.id ? 'Chỉnh Sửa' : 'Thêm'}
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

                    {/* Bảng hiển thị danh sách giá */}
                    <table className="min-w-full bg-white border border-gray-300 table-fixed">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-r w-1/5">ID</th>
                            <th className="py-2 px-4 border-b border-r w-1/5">Giá</th>
                            <th className="py-2 px-4 border-b border-r w-1/5">Ngày Áp Dụng</th>
                            <th className="py-2 px-4 border-b border-r w-1/5">Ngày Kết Thúc</th>
                            <th className="py-2 px-4 border-b border-r w-1/5">Trạng Thái</th>
                            <th className="py-2 px-4 border-b border-r w-1/5">Hành Động</th>
                        </tr>
                        </thead>

                        <tbody>
                        {prices.map((price) => (
                            <tr key={price.id}>
                                <td className="py-2 px-4 border text-center">{price.id}</td>
                                <td className="py-2 px-4 border text-center">{formatPrice(price.price)}</td>
                                <td className="py-2 px-4 border text-center">{formatDate(price.startDate)}</td>
                                {/* <td className="py-2 px-4 border text-center">{formatDate(price.endDate)}</td> */}
                                <td className="py-2 px-4 border text-center">
                                    {price.endDate ? formatDate(price.endDate) : 'Chưa Có'}
                                </td>

                                <td className="py-2 px-4 border text-center">{ price.active === true ? 'Còn áp dụng' : 'Hết hạn'}</td>


                                <td className="flex py-2 px-4 border text-center justify-center">
                                    <button onClick={() => handleEditPrice(price)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700 flex items-center gap-1">
                                        <FaEdit className="text-white" /> Sửa
                                    </button>
                                    {/* <button onClick={() => handleDeletePrice(price.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-2 flex items-center gap-1">
                                        <FaTrash className="text-white" /> Xóa
                                    </button> */}
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
