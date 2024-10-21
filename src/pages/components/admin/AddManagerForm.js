import { useState } from 'react';
import axios from 'axios';

const AddManagerForm = ({ managerData, onClose }) => {
    const [fullName, setFullName] = useState(managerData?.fullName || '');
    const [email, setEmail] = useState(managerData?.email || '');
    const [phone, setPhone] = useState(managerData?.phone || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState(managerData?.role || 'MANAGER');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Kiểm tra xem các trường bắt buộc có được điền không
        if (!fullName || !email || !phone || (managerData ? false : !password || !confirmPassword)) {
            alert('Tất cả các trường đánh dấu * là bắt buộc.');
            return;
        }

        // Kiểm tra xem mật khẩu và mật khẩu xác nhận có khớp không
        if (password && password !== confirmPassword) {
            alert('Mật khẩu và mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            const url = managerData ? `/api/users/managers/update/${managerData.id}` : '/api/users/admins/managers/add';
            const method = managerData ? 'PUT' : 'POST';
            
            const response = await axios({
                method: method,
                url: url,
                data: {
                    fullName,
                    email,
                    phone,
                    password: managerData ? undefined : password,
                    role: role,
                    status: 'Đang hoạt động' // Có thể thêm trạng thái mặc định
                },
            });

            alert(managerData ? 'Quản lý đã được cập nhật thành công.' : 'Quản lý đã được thêm thành công.');
            // Reset form
            onClose(); // Đóng form sau khi thêm/cập nhật thành công
        } catch (err) {
            alert('Có lỗi xảy ra khi thêm/cập nhật quản lý.');
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

            {!managerData && (
                <>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">
                            Mật Khẩu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
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
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
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

            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                {managerData ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên'}
            </button>
        </form>
    );
};

export default AddManagerForm;