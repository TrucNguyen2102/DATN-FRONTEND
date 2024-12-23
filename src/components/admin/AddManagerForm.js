import { useState } from 'react';
import axios from 'axios';

const AddManagerForm = ({ managerData, onClose, onSuccess }) => {
    const [fullName, setFullName] = useState(managerData?.fullName || '');
    const [birthDay, setBirthDay] = useState(managerData?.birthDay || '');
    const [email, setEmail] = useState(managerData?.email || '');
    const [phone, setPhone] = useState(managerData?.phone || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('MANAGER');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleCancel = () => {
        setShowForm(false); // Ẩn form khi nhấn nút Hủy
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Email không đúng định dạng!');
            return;
        }

        // Kiểm tra định dạng số điện thoại
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!phoneRegex.test(phone)) {
            setError('Số điện thoại không đúng định dạng!');
            return;
        }

        setError('');
        setSuccess('');
    
        // Kiểm tra xem các trường bắt buộc có được điền không (chỉ kiểm tra trường role nếu đang cập nhật)
        if (!fullName || !birthDay || !email || !phone || (managerData ? false : !password || !confirmPassword)) {
            alert('Tất cả các trường đánh dấu * là bắt buộc.');
            return;
        }
    
        // Kiểm tra mật khẩu và mật khẩu xác nhận có khớp không (chỉ kiểm tra khi thêm mới)
        if (password && password !== confirmPassword) {
            alert('Mật khẩu và mật khẩu xác nhận không khớp.');
            return;
        }
    
        try {

            const url = managerData ? `/api/users/admins/managers/update/${managerData.id}` : '/api/users/admins/managers/add';
            const method = managerData ? 'PUT' : 'POST';

            await axios({
                method: method,
                url: url,
                data: {
                    fullName,
                    birthDay,
                    email,
                    phone,
                    password,
                    role,
                    status: 'Đang hoạt động'
                },

                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            // const data = { 
            //     fullName, 
            //     birthDay, 
            //     email, 
            //     phone, 
            //     password, 
            //     role, 
            //     status: 'Đang hoạt động'
            // };
    
            // // Gửi request thêm mới tài khoản
            // await axios.post('/api/users/admins/managers/add', data, {
            //     headers: {
            //         'Authorization': `Bearer ${localStorage.getItem('token')}`
            //     }
            // });
    
            // Thông báo thành công và đóng form
            alert(managerData ? 'Quản lý đã được cập nhật thành công.' : 'Quản lý đã được thêm thành công.');

            // Gọi API updateUpdatedAt sau khi thành công
            if (managerData) {
                await axios.put(`/api/users/${managerData.id}/updateAt`, {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log('Cập nhật thời gian thành công');
            }

            onSuccess();
            onClose(); // Đóng form sau khi thêm thành công
    
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError(err.response.data);
            } else {
                alert('Có lỗi xảy ra khi thêm quản lý.');
            }
        }
    };
    

   
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            {/* <div className="bg-white rounded-lg p-6 w-[600px]"> */}
            <div className="bg-white rounded-lg p-6 w-96">
                <form onSubmit={handleSubmit}>
                    {/* <h2 className='text-xl mb-4 font-bold text-center'>Thêm Tài Khoản</h2> */}
                    <h2 className="text-xl font-bold mb-4 text-center">{managerData ? 'Chỉnh Sửa' : 'Thêm Tài Khoản'}</h2>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">
                            Họ Tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">
                            Ngày Sinh <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={birthDay}
                            onChange={(e) => setBirthDay(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">
                            Số Điện Thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>

                    {!managerData && (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold">
                                    Mật Khẩu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'} // Hiển thị mật khẩu nếu showPassword là true
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border border-gray-300 rounded p-2 w-full"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold">
                                    Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    // type="password"
                                    type={showPassword ? 'text' : 'password'} // Hiển thị mật khẩu nếu showPassword là true
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="border border-gray-300 rounded p-2 w-full"
                                    required
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
                        </>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">
                            Quyền <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                        </select>
                    </div>

                    <div className='flex mt-4 space-x-2'>
                        <button type="submit" className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                            {managerData ? 'Cập Nhật' : 'Thêm'}
                        </button>

                        <button
                                type="button"
                                onClick={(onClose)}
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
                                >
                                    Hủy
                        </button>
                    </div>
                    
                    
                </form>
            </div>
            
        </div>
        
    );
};

export default AddManagerForm;