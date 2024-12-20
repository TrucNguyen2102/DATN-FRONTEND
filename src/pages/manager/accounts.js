import { useState, useContext, useEffect } from "react";
import ManagerHeader from "../../components/Header/ManagerHeader";
import ManagerSidebar from "../../components/Sidebar/ManagerSidebar";
import AuthContext from "../../contexts/AuthContext";
import axios from "axios";
import { FaSyncAlt, FaPlus, FaEdit, FaTrash  } from "react-icons/fa"

const Modal = ({ isOpen, onClose, onSave, initialData }) => {
    const [id, setId] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthDay, setBirthDay] = useState("");
    

    const [errors, setErrors] = useState({
        fullName: '',
        phone: '',
        email: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    

    // Cập nhật state khi initialData thay đổi
    useEffect(() => {
        if (initialData) {
            setId(initialData.id || "");
            setFullName(initialData.fullName || "");
            setPhone(initialData.phone || "");
            setEmail(initialData.email || "");

            // Đảm bảo ngày sinh có định dạng yyyy-MM-dd
            if (initialData.birthDay) {
                const formattedDate = new Date(initialData.birthDay).toISOString().split("T")[0];
                setBirthDay(formattedDate);
            } else {
                setBirthDay(""); // Nếu không có ngày sinh
            }
        }
    }, [initialData]);

    if (!isOpen) return null;


    const handleSave = () => {
        let hasError = false;

        // Xóa thông báo lỗi cũ
        setErrors('');

        // Kiểm tra các trường bắt buộc
        if (!fullName) {
            setErrors((prev) => ({ ...prev, fullName: 'Họ tên không được để trống' }));
            hasError = true;
        }
        if (!phone) {
            setErrors((prev) => ({ ...prev, phone: 'Số điện thoại không được để trống' }));
            hasError = true;
        }
        if (!email) {
            setErrors((prev) => ({ ...prev, email: 'Email không được để trống' }));
            hasError = true;
        }

        // Nếu có lỗi, hiển thị thông báo chung và dừng lại
        if (hasError) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const updatedData = { id, fullName, phone, email, birthDay };
        onSave(updatedData);
        onClose();
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
    
        // Cập nhật giá trị theo trường
        switch (id) {
            case 'fullName':
                setFullName(value);
                setErrors((prev) => ({ ...prev, fullName: value ? '' : 'Họ tên không được để trống' }));
                break;
            case 'birthDay':
                setBirthDay(value);
                break;
            case 'phone':
                setPhone(value);
                setErrors((prev) => ({ ...prev, phone: value ? '' : 'Số điện thoại không được để trống' }));
                break;
            case 'email':
                setEmail(value);
                setErrors((prev) => ({ ...prev, email: value ? '' : 'Email không được để trống' }));
                break;
            default:
                break;
        }
    };
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4 text-center">Cập Nhật Thông Tin</h2>
                {errorMessage && (
                    <div className="text-red-500 p-2 mb-4 rounded text-center">
                        {errorMessage}
                    </div>
                )}
                <form className="space-y-4">
                    {/* <div>
                        <label htmlFor="id" className="block text-sm font-semibold">Mã</label>
                        <input
                            id="id"
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full p-3 border rounded-md mt-1"
                            disabled
                        />
                    </div> */}

                    <div>
                        <label htmlFor="fullName" className="block text-sm font-semibold">
                            Họ Tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            // onChange={(e) => setFullName(e.target.value)}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        
                    </div>

                    <div>
                        <label htmlFor="birthDay" className="block text-sm font-semibold">
                            Ngày Sinh
                        </label>
                        <input
                            id="birthDay"
                            type="date"
                            value={birthDay}
                            // onChange={(e) => setBirthDay(e.target.value)}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                        
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold">
                            Số Điện Thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="phone"
                            type="text"
                            value={phone}
                            // onChange={(e) => setPhone(e.target.value)}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            // onChange={(e) => setEmail(e.target.value)}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="flex mt-3 space-x-2">
                        
                        <button
                            type="button"
                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                            onClick={handleSave}
                        >
                            Lưu Thông Tin
                        </button>

                        <button
                            type="button"
                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 ml-2"
                            onClick={onClose}
                        >
                            Hủy
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};


const ChangePasswordModal = ({ isOpen, onClose, onSave }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errors, setErrors] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const { user } = useContext(AuthContext);
    if (!isOpen) return null;

    const handlePasswordChange = async (oldPassword, newPassword) => {
        let hasError = false;

        // Xóa thông báo lỗi cũ
        setErrors('');

        // Kiểm tra các trường bắt buộc
        if (!oldPassword) {
            setErrors((prev) => ({ ...prev, oldPassword: 'Mật khẩu cũ không được để trống' }));
            hasError = true;
        }
        if (!newPassword) {
            setErrors((prev) => ({ ...prev, newPassword: 'Mật khẩu mới không được để trống' }));
            hasError = true;
        }
        if (!confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: 'Xác nhận mật khẩu không được để trống' }));
            hasError = true;
        }

        // Nếu có lỗi, hiển thị thông báo chung và dừng lại
        if (hasError) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        if (!user?.id) {
            alert("Không tìm thấy User ID. Vui lòng đăng nhập lại.");
            return;
        }
    
        try {
            // Bước 1: Gửi yêu cầu đổi mật khẩu
            const passwordResponse = await axios.put(
                `/api/users/change-password/${user.id}`, // API đổi mật khẩu
                {
                    oldPassword,
                    newPassword,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
    
            if (passwordResponse.status === 200) {
                alert("Mật khẩu đã được cập nhật thành công.");
    
                // Bước 2: Gửi yêu cầu cập nhật updatedAt
                try {
                    const timestampResponse = await axios.put(
                        `/api/users/${user.id}/updateAt`, // API cập nhật updatedAt
                        {},
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
    
                    if (timestampResponse.status === 200) {
                        console.log("Cập nhật updatedAt thành công.");
                    }
                } catch (timestampError) {
                    console.error(
                        "Lỗi khi cập nhật updatedAt:",
                        timestampError.response?.data || timestampError.message
                    );
                }
            }
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error.response?.data || error.message);
            alert("Đổi mật khẩu thất bại. Vui lòng thử lại.");
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
    
        // Cập nhật giá trị theo trường
        switch (id) {
            case 'oldPassword':
                setOldPassword(value);
                setErrors((prev) => ({ ...prev, oldPassword: value ? '' : 'Mật khẩu cũ không được để trống' }));
                break;
           
            case 'newPassword':
                setNewPassword(value);
                setErrors((prev) => ({ ...prev, newPassword: value ? '' : 'Mật khẩu mới không được để trống' }));
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                setErrors((prev) => ({ ...prev, confirmPassword: value ? '' : 'Xác nhận mật khẩu không được để trống' }));
                break;
            default:
                break;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4 text-center">Đổi Mật Khẩu</h2>
                {errorMessage && (
                    <div className="text-red-500 p-2 mb-4 rounded text-center">
                        {errorMessage}
                    </div>
                )}
                <form className="space-y-4">
                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-semibold">
                            Mật Khẩu Cũ <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="oldPassword"
                            // type="password"
                            type={showPassword ? 'text' : 'password'}
                            value={oldPassword}
                            // onChange={(e) => setOldPassword(e.target.value)}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-semibold">
                            Mật Khẩu Mới <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="newPassword"
                            // type="password"
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            //onChange={(e) => setNewPassword(e.target.value)}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold">
                            Xác Nhận Mật Khẩu Mới <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="confirmPassword"
                            // type="password"
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            //onChange={(e) => setConfirmPassword(e.target.value)}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)} // Thay đổi trạng thái showPassword
                        />
                        <label className="ml-2 text-sm" htmlFor="showPassword">Hiển Thị Mật Khẩu</label>
                    </div>

                    

                    <div className="flex mt-4 space-x-2">
                        
                        <button
                            type="button"
                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                            onClick={() => handlePasswordChange(oldPassword, newPassword)}
                        >
                            Đổi Mật Khẩu
                        </button>

                        <button
                            type="button"
                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 ml-2"
                            onClick={onClose}
                        >
                            Hủy
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};





const ManagerAccount = () => {
    const { user, setUser } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState({
        id: "",
        fullName: "",
        birthDay: "",
        phone: "",
        email: ""
    });
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const fetchUserData = async (userId) => {
        try {
            console.log("Fetching user data for ID:", userId);
            const response = await axios.get(`/api/users/${userId}`);
            console.log("Response data:", response.data);
            return response.data; // Trả về dữ liệu người dùng
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null; // Trả về null nếu có lỗi
        }
    };
    
    useEffect(() => {
        if (user?.id) {
            fetchUserData(user.id).then((data) => {
                if (data) {
                    setUserInfo(data); // Cập nhật thông tin user
                }
            });
        }
    }, [user?.id]);
    

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenPasswordModal = () => setIsPasswordModalOpen(true);
    const handleClosePasswordModal = () => setIsPasswordModalOpen(false);

    const handleSaveInfo = async (updatedData) => {
        try {
            const response = await axios.put(`/api/users/update/${updatedData.id}`, updatedData);
            if (response.status === 200) {
                setUserInfo(response.data); // Cập nhật thông tin người dùng sau khi lưu
                alert("Cập nhật thành công!");
                handleCloseModal();

                // Cập nhật thời gian updatedAt
                await axios.put(`/api/users/${updatedData.id}/updateAt`, {}, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
            }
        } catch (error) {
            console.error("Có lỗi khi cập nhật thông tin:", error);
            alert("Cập nhật thất bại!");
        }
    };

    const handlePasswordChange = async (passwordData) => {
        try {
            const response = await axios.put(`/api/users/change-password/${user.id}`, passwordData);
            if (response.status === 200) {
                alert("Đổi mật khẩu thành công!");
                handleClosePasswordModal();
            }
        } catch (error) {
            console.error("Có lỗi khi đổi mật khẩu:", error);
            alert("Đổi mật khẩu thất bại!");
        }
    };

    if (!userInfo) {
        return <p>Đang tải thông tin...</p>;
    }

    const handleRefresh = () => {
        window.location.reload(); // Tải lại trang
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <ManagerHeader />
            <div className="flex flex-1">
                <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />
                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">QUẢN LÝ TÀI KHOẢN</h1>

                        <div className="mb-4">
                            <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1">
                                <FaSyncAlt className="text-white" /> Làm Mới
                            </button>
                        </div>

                    <div className="bg-white shadow p-6 rounded-lg max mx-auto">

                        
                        <h2 className="text-2xl font-bold mb-4 text-center">Thông Tin Cá Nhân</h2>

                        {userInfo && (
                            <div className="space-y-4">

                                {/* <div>
                                    <label className="block text-sm font-semibold">Mã</label>
                                    <input 
                                        type="text" 
                                        value={userInfo.id || "Chưa có"} 
                                        className="w-full p-3 border rounded-md"
                                        onChange={(e) => setUserInfo({ ...userInfo, id: e.target.value })}
                                        disabled
                                    />
                                    
                                </div> */}

                                <div>
                                    <label className="block text-sm font-semibold">Họ Tên</label>
                                    <input className="w-full p-3 border rounded-md"
                                        type="text" 
                                        value={userInfo.fullName || "Chưa có"} 
                                        onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                                        disabled
                                    />
                                    {/* <input value={userInfo.fullName || "Chưa"} className="w-full p-3 border rounded-md" disabled /> */}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold">Ngày Sinh</label>
                                    <input className="w-full p-3 border rounded-md"
                                        type="text" 
                                        value={userInfo.birthDay || "Chưa có"} 
                                        onChange={(e) => setUserInfo({ ...userInfo, birthDay: e.target.value })}
                                        disabled
                                    />
                                    {/* <input value={userInfo.birthDay || "Chưa"} className="w-full p-3 border rounded-md" disabled /> */}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold">Số Điện Thoại</label>
                                    <input className="w-full p-3 border rounded-md"
                                        type="text" 
                                        value={userInfo.phone || "Chưa có"} 
                                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                        disabled
                                    />
                                    {/* <input value={userInfo.phone || "Chưa"} className="w-full p-3 border rounded-md" disabled /> */}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold">Email</label>
                                    <input className="w-full p-3 border rounded-md"
                                        type="email" 
                                        value={userInfo.email || "Chưa có"} 
                                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                        disabled
                                    />
                                    {/* <input value={userInfo.email || "Chưa"} className="w-full p-3 border rounded-md" disabled /> */}
                                </div>

                                <div className="flex">
                                    <button
                                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center gap-1"
                                        onClick={handleOpenModal}
                                    >
                                        <FaEdit className="text-white" /> Cập Nhật
                                    </button>

                                    <button
                                        className="bg-blue-500 text-white py-2 px-4 rounded-md ml-4 hover:bg-blue-700 flex items-center gap-1"
                                        onClick={handleOpenPasswordModal}
                                    >
                                        <FaEdit className="text-white" /> Đổi Mật Khẩu
                                    </button>

                                </div>
                                
                            </div>
                        )}
                    </div>
                </main>
            </div>
            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveInfo}
                initialData={userInfo}
            />

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={handleClosePasswordModal}
                onSave={handlePasswordChange}
            />

        </div>
    );
};

export default ManagerAccount;
