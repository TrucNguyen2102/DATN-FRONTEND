import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerHeader from '../components/Header/ManagerHeader';
import ManagerSidebar from '../components/Sidebar/ManagerSidebar';
import { FaSyncAlt, FaPlus, FaEdit, FaTrash  } from "react-icons/fa"

const TypeTable = () => {
    const [types, setTypes] = useState([]);
    const [prices, setPrices] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [newType, setNewType] = useState({id: '', name: '', priceId: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading
    // Thêm state để quản lý phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5); // Số bản ghi mỗi trang

    // const fetchTypes = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.get('/api/tables/types/all');
    //         console.log('Phản hồi từ API:', response.data); // Ghi log phản hồi
    //         if (Array.isArray(response.data)) {
    //             setTypes(response.data);
    //         } else {
    //             console.error('Dữ liệu trả về không phải là một mảng:', response.data);
    //             setTypes([]); // Hoặc xử lý khác
    //         }
    //     } catch (error) {
    //         setError('Không thể tải danh sách loại bàn.');
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const fetchTypes = async (page = 0, size = 5) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/tables/types/pages/all', {
                params: {
                    page: page,
                    size: size
                }
            });
            console.log('Phản hồi từ API:', response.data);
            if (response.data.content) {
                setTypes(response.data.content);
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
    

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/tables/prices/all');
            console.log('Phản hồi từ API:', response.data); // Ghi log phản hồi
            if (Array.isArray(response.data)) {
                setPrices(response.data);
            } else {
                console.error('Dữ liệu trả về không phải là một mảng:', response.data);
                setPrices([]); // Hoặc xử lý khác
            }
        } catch (error) {
            console.error('Không thể tải danh sách giá.', error);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchTypes();
        fetchPrices();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewType({ ...newType, [name]: value });
    };

    const handleAddType = async (e) => {
        e.preventDefault();
        try {
            const existingType = types.find((type) => type.name === newType.name);
            if (existingType) {
                alert('Tên loại đã tồn tại');
                return;
            }
    
            if (!newType.priceId) {
                alert('Vui lòng chọn một giá.');
                return;
            }

            const response = await axios.post('/api/tables/types/add', {
                name: newType.name,
                priceIds: [newType.priceId], 
            });

            // Lưu ID loại bàn được thêm vào
            const addedType = { ...response.data, id: response.data.id }; // Giả sử ID được trả về từ server

            setTypes([...types, addedType]);
            // setTypes([...types, response.data]);
            setSuccessMessage('Thêm loại bàn thành công!');
            resetForm();
        } catch (error) {
            alert('Lỗi khi thêm loại bàn', error);
        }
    };
    
    const handleEditExistingType = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/tables/types/update/${newType.id}`, {
                name: newType.name,
                priceIds: [newType.priceId], 
            });
            setTypes(types.map((type) => (type.id === response.data.id ? response.data : type)));
            setSuccessMessage('Chỉnh sửa loại bàn thành công!');
            resetForm();
        } catch (error) {
            alert('Lỗi khi chỉnh sửa loại bàn', error);
        }
    };
    
    const resetForm = () => {
        setNewType({id: '', name: '', priceId: '' });
        setIsEditing(false);
        setShowForm(false);
        setError('');
        setSuccessMessage('');
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleEditType = (type) => {
        setNewType({ id: type.id, name: type.name, priceId: type.priceIds[0] });
        setIsEditing(true);
        setShowForm(true);
    };

    // Hàm thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchPrices(page - 1, pageSize); // Lưu ý: page trong API bắt đầu từ 0
    };

    // Gọi fetchTables với tham số phân trang
    useEffect(() => {
        fetchPrices(currentPage - 1, pageSize);
    }, [currentPage, pageSize]);

    // const handleDeleteType = async (id) => {
    //     if (window.confirm(`Bạn có chắc chắn muốn xóa loại bàn này không?`)) {
    //         try {
    //             await axios.delete(`/api/tables/types/delete/${id}`);
    //             setTypes(types.filter((type) => type.id !== id));
    //             setSuccessMessage('Xóa loại bàn thành công!');
    //         } catch (error) {
    //             console.error("Lỗi khi xóa loại bàn", error);
    //         }
    //     }
    // };

    const handleDeleteType = async (id) => {
        try {
            // Kiểm tra xem loại bàn có được sử dụng trong bất kỳ bàn chơi nào không
            const response = await axios.get(`/api/tables/types/check-used/${id}`);
            console.log("Response:", response.data);
            
            if (response.data.isUsed) {
                // Nếu loại bàn đang được sử dụng, hiển thị thông báo và không xóa
                alert('Loại bàn này đang được sử dụng trong một hoặc nhiều bàn chơi, không thể xóa.');
            } else {
                // Nếu loại bàn chưa được sử dụng, hỏi xác nhận và xóa loại bàn
                if (window.confirm(`Bạn có chắc chắn muốn xóa loại bàn này không?`)) {
                    await axios.delete(`/api/tables/types/delete/${id}`);
                    setTypes(types.filter((type) => type.id !== id));
                    setSuccessMessage('Xóa loại bàn thành công!');
                }
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra/xóa loại bàn", error);
        }
    };
    

    const priceMap = prices.reduce((acc, price) => {
        acc[price.id] = price.price;
        return acc;
    }, {});

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    };
    

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <ManagerHeader />
            <div className="flex flex-1">
                <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Loại Bàn</h1>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

                    <div className='flex mb-4'>
                        <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1">
                            <FaSyncAlt className="text-white" /> Làm Mới
                        </button>
                        
                        <button 
                            onClick={() => setShowForm(!showForm)} 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2 flex items-center gap-1"
                        >
                            <FaPlus className="text-white" />
                            {/* {showForm ? 'Ẩn Form' : 'Thêm Loại'} */}
                            Thêm Loại
                        </button>
                    </div>
                    

                    

                    {showForm && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4 text-center">{newType.id ? 'Sửa Loại Bàn' : 'Thêm Loại Bàn'}</h2>
                                <form onSubmit={isEditing ? handleEditExistingType : handleAddType} className="mb-4">
                                    <div>
                                        <label className="block text-gray-700 font-bold">
                                            Tên Loại Bàn <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newType.name}
                                            onChange={handleInputChange}
                                            className="border px-3 py-2 w-full"
                                            required
                                            disabled={isEditing} // Vô hiệu hóa trường giá nếu đang trong chế độ chỉnh sửa
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-gray-700 font-bold">
                                            Chọn Giá Áp Dụng <span className="text-red-500">*</span>
                                        </label>
                                        {/* <select
                                            name="priceId"
                                            value={newType.priceId}
                                            onChange={handleInputChange}
                                            className="border px-3 py-2 w-full"
                                            required
                                        
                                        >
                                            <option value="">Chọn một giá</option>
                                            {prices.map((price) => (
                                                <option key={price.id} value={price.id}>
                                                    {formatPrice(price.price)} (Áp dụng từ: {price.startDate} đến {price.endDate})
                                                </option>
                                            ))}
                                        </select> */}

                                        <select
                                            name="priceId"
                                            value={newType.priceId}
                                            onChange={handleInputChange}
                                            className="border px-3 py-2 w-full"
                                            required
                                        >
                                            <option value="">Chọn một giá</option>
                                            {prices.map((price) => {
                                                // Kiểm tra nếu có ngày kết thúc và ngày kết thúc nhỏ hơn ngày hiện tại, hoặc nếu không có ngày kết thúc
                                                const isActive = price.endDate && new Date(price.endDate) < new Date();
                                                const endDateMessage = price.endDate ? `Đã hết hạn từ: ${price.endDate}` : "Chưa có ngày kết thúc"; // Tin nhắn cho giá đã hết hạn
                                                return (
                                                    <option
                                                        key={price.id}
                                                        value={price.id}
                                                        disabled={isActive} // Vô hiệu hóa giá đã hết hạn
                                                        title={isActive ? endDateMessage : ""}
                                                    >
                                                        {formatPrice(price.price)} (Áp dụng từ: {price.startDate} đến {price.endDate || "Chưa Có"})
                                                    </option>
                                                );
                                            })}
                                        </select>


                                    </div>

                                    <div className="mt-4 flex space-x-2">
                                        <button type="submit" className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                            {isEditing ? 'Chỉnh Sửa' : 'Thêm'}
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

                    {loading ? ( // Hiển thị spinner khi đang tải
                        <div className="text-center">
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <table className="min-w-full bg-white border border-gray-300 table-fixed">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-r w-1/5">ID</th>
                                    <th className="py-2 px-4 border-b border-r w-1/5">Tên Loại Bàn</th>
                                    <th className="py-2 px-4 border-b border-r w-1/5">Giá</th>
                                    <th className="py-2 px-4 border-b border-r w-1/5">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {types.map((type) => (
                                    <tr key={type.id}>
                                        <td className="py-2 px-4 border text-center">{type.id}</td>
                                        <td className="py-2 px-4 border text-center">{type.name}</td>
                                        {/* <td className="py-2 px-4 border text-center">
                                            {type.priceIds.length > 0 // Kiểm tra xem priceIds có tồn tại không
                                                ? (priceMap[type.priceIds[0]] ? `${priceMap[type.priceIds[0]]} VND` : 'Giá không xác định') 
                                                : 'Chưa có giá'}
                                        </td> */}

                                        <td className="py-2 px-4 border text-center">
                                            {type.priceIds.length > 0 // Kiểm tra xem priceIds có tồn tại không 
                                                ? (priceMap[type.priceIds[0]] ? formatPrice(priceMap[type.priceIds[0]]) : 'Giá không xác định') 
                                                : 'Chưa có giá'}
                                        </td>

                                        <td className="flex py-2 px-4 border text-center justify-center">
                                            <button onClick={() => handleEditType(type)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700 mr-2 flex items-center gap-1">
                                                <FaEdit className="text-white" /> Sửa
                                            </button>
                                            <button onClick={() => handleDeleteType(type.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center gap-1">
                                                <FaTrash className="text-white" /> Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>


                        </table>
                    )}

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
};

export default TypeTable;
