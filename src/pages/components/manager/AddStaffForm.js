import { useState } from 'react';
import axios from 'axios';

const AddStaffForm = ({ staffData, onClose }) => {
    const [fullName, setFullName] = useState(staffData?.fullName || '');
    const [email, setEmail] = useState(staffData?.email || '');
    const [phone, setPhone] = useState(staffData?.phone || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Thêm state để điều khiển việc ẩn/hiện mật khẩu
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!fullName || !email || !phone || (staffData ? false : !password || !confirmPassword)) {
            alert('Tất cả các trường đánh dấu * là bắt buộc.');
            return;
        }

        if (password && password !== confirmPassword) {
            alert('Mật khẩu và mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            const url = staffData ? `/api/users/managers/staffs/update/${staffData.id}` : '/api/users/managers/staffs/add';
            const method = staffData ? 'PUT' : 'POST';

            await axios({
                method: method,
                url: url,
                data: {
                    fullName,
                    email,
                    phone,
                    password: staffData ? undefined : password,
                    role: 'STAFF',
                    status: 'Đang hoạt động'
                },

                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            alert(staffData ? 'Nhân viên đã được cập nhật thành công.' : 'Nhân viên đã được thêm thành công.');
            onClose(); // Đóng form sau khi thêm/cập nhật thành công
        } catch (err) {
            alert('Có lỗi xảy ra khi thêm/cập nhật nhân viên.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

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

            {!staffData && (
                <>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">
                            Mật Khẩu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'} // Kiểm tra để ẩn/hiện mật khẩu
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
                            type={showPassword ? 'text' : 'password'} // Kiểm tra để ẩn/hiện mật khẩu
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)} // Chuyển đổi giữa ẩn và hiện mật khẩu
                                className="mr-2"
                            />
                            Hiển thị mật khẩu
                        </label>
                    </div>
                </>
            )}

            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                {staffData ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên'}
            </button>
        </form>
    );
};

export default AddStaffForm;
