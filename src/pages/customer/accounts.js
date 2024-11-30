import { useState, useContext, useEffect } from "react";
import CustomerHeader from "../components/Header/CustomerHeader";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";
import AuthContext from "../contexts/AuthContext";
import axios from "axios";

const Modal = ({ isOpen, onClose, onSave, initialData }) => {
    const [id, setId] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthDay, setBirthDay] = useState("");

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
        const updatedData = { id, fullName, phone, email, birthDay };
        onSave(updatedData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Cập nhật thông tin</h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="id" className="block text-sm font-semibold">Mã</label>
                        <input
                            id="id"
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full p-3 border rounded-md mt-1"
                            disabled
                        />
                    </div>

                    <div>
                        <label htmlFor="fullName" className="block text-sm font-semibold">Họ tên</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="birthDay" className="block text-sm font-semibold">Ngày sinh</label>
                        <input
                            id="birthDay"
                            type="date"
                            value={birthDay}
                            onChange={(e) => setBirthDay(e.target.value)}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold">Số điện thoại</label>
                        <input
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                    </div>

                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            type="button"
                            className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                            onClick={handleSave}
                        >
                            Lưu thông tin
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
    const [showPassword, setShowPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { user } = useContext(AuthContext);

    if (!isOpen) return null;

    const handlePasswordChange = async (oldPassword, newPassword) => {
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
    

    
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Đổi Mật Khẩu</h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-semibold">Mật khẩu cũ</label>
                        <input
                            id="oldPassword"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-semibold">Mật khẩu mới</label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border rounded-md mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold">Xác nhận mật khẩu mới</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        <label className="ml-2 text-sm" htmlFor="showPassword">Hiển thị mật khẩu</label>
                    </div>

                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            type="button"
                            className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                            onClick={() => handlePasswordChange(oldPassword, newPassword)}
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CustomerAccount = () => {
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
            <CustomerHeader />
            <div className="flex flex-1">
                <CustomerSidebar className="w-1/4 bg-gray-200 p-4" />
                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">QUẢN LÝ TÀI KHOẢN</h1>

                        <div className="mb-4">
                            <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                                        Làm Mới
                            </button>
                        </div>

                    <div className="bg-white shadow p-6 rounded-lg max mx-auto">

                        
                        <h2 className="text-2xl font-bold mb-4">Thông Tin Cá Nhân</h2>

                        {userInfo && (
                            <div className="space-y-4">

                                <div>
                                    <label className="block text-sm font-semibold">Mã</label>
                                    <input 
                                        type="text" 
                                        value={userInfo.id || "Chưa có"} 
                                        className="w-full p-3 border rounded-md"
                                        onChange={(e) => setUserInfo({ ...userInfo, id: e.target.value })}
                                        disabled
                                    />
                                    {/* <input type = "text" value={userInfo.id || "Chưa"} className="w-full p-3 border rounded-md" disabled /> */}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold">Họ tên</label>
                                    <input className="w-full p-3 border rounded-md"
                                        type="text" 
                                        value={userInfo.fullName || "Chưa có"} 
                                        onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                                        disabled
                                    />
                                    {/* <input value={userInfo.fullName || "Chưa"} className="w-full p-3 border rounded-md" disabled /> */}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold">Ngày sinh</label>
                                    <input className="w-full p-3 border rounded-md"
                                        type="text" 
                                        value={userInfo.birthDay || "Chưa có"} 
                                        onChange={(e) => setUserInfo({ ...userInfo, birthDay: e.target.value })}
                                        disabled
                                    />
                                    {/* <input value={userInfo.birthDay || "Chưa"} className="w-full p-3 border rounded-md" disabled /> */}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold">Số điện thoại</label>
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

                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                                    onClick={handleOpenModal}
                                >
                                    Cập nhật
                                </button>

                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md ml-4 hover:bg-blue-700"
                                    onClick={handleOpenPasswordModal}
                                >
                                    Đổi mật khẩu
                                </button>

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

export default CustomerAccount;