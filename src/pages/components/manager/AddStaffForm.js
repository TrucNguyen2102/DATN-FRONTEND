// import { useState } from 'react';
// import axios from 'axios';

// const AddStaffForm = () => {
//     const [fullName, setFullName] = useState('');
//     const [email, setEmail] = useState('');
//     const [phone, setPhone] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [role, setRole] = useState('STAFF'); // Mặc định là STAFF
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//          // Kiểm tra xem các trường bắt buộc có được điền không
//          if (!fullName || !email || !phone || !password || !confirmPassword) {
//             alert('Tất cả các trường đánh dấu * là bắt buộc.');
//             return;
//         }

//         // Kiểm tra xem mật khẩu và mật khẩu xác nhận có khớp không
//         if (password !== confirmPassword) {
//             alert('Mật khẩu và mật khẩu xác nhận không khớp.');
//             return;
//         }

//         try {
//             const response = await axios.post('/api/users/staffs/add', {
//                 fullName,
//                 email,
//                 phone,
//                 password,
//                 role: role,
//                 status: 'Đang hoạt động' // Có thể thêm trạng thái mặc định
//             });
//             alert('Nhân viên đã được thêm thành công.');
//             // Reset form
//             setFullName('');
//             setEmail('');
//             setPhone('');
//             setPassword('');
//             setConfirmPassword(''); // Reset trường mật khẩu xác nhận
//             setRole('STAFF');
//         } catch (err) {
//             alert('Có lỗi xảy ra khi thêm nhân viên.');
//             console.error(err);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
//             {/* <h2 className="text-xl font-semibold mb-4">Thêm Nhân Viên</h2> */}

//             {error && <p className="text-red-500">{error}</p>}
//             {success && <p className="text-green-500">{success}</p>}

//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold">
//                     Họ Tên <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                     type="text"
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                     className="border border-gray-300 rounded p-2 w-full"
//                     required
//                 />
//             </div>

//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold">
//                     Số Điện Thoại <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                     type="tel"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="border border-gray-300 rounded p-2 w-full"
//                     required
//                 />
//             </div>

//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold">
//                     Email <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="border border-gray-300 rounded p-2 w-full"
//                     required
//                 />
//             </div>

//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold">
//                     Mật Khẩu <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="border border-gray-300 rounded p-2 w-full"
//                     required
//                 />
//             </div>

//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold">
//                     Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                     type="password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className="border border-gray-300 rounded p-2 w-full"
//                     required
//                 />
//             </div>


//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold">
//                     Quyền <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     className="border border-gray-300 rounded p-2 w-full"
//                 >
//                     <option value="ADMIN">ADMIN</option>
//                     <option value="STAFF">STAFF</option>
//                 </select>
//             </div>

//             <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Thêm Nhân Viên</button>
//         </form>
//     );
// };

// export default AddStaffForm;

import { useState } from 'react';
import axios from 'axios';

const AddStaffForm = ({ staffData, onClose }) => {
    const [fullName, setFullName] = useState(staffData?.fullName || '');
    const [email, setEmail] = useState(staffData?.email || '');
    const [phone, setPhone] = useState(staffData?.phone || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState(staffData?.role || 'STAFF');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Kiểm tra xem các trường bắt buộc có được điền không
        if (!fullName || !email || !phone || (staffData ? false : !password || !confirmPassword)) {
            alert('Tất cả các trường đánh dấu * là bắt buộc.');
            return;
        }

        // Kiểm tra xem mật khẩu và mật khẩu xác nhận có khớp không
        if (password && password !== confirmPassword) {
            alert('Mật khẩu và mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            const url = staffData ? `/api/users/staffs/update/${staffData.id}` : '/api/users/staffs/add';
            const method = staffData ? 'PUT' : 'POST';
            
            const response = await axios({
                method: method,
                url: url,
                data: {
                    fullName,
                    email,
                    phone,
                    password: staffData ? undefined : password,
                    role: role,
                    status: 'Đang hoạt động' // Có thể thêm trạng thái mặc định
                },
            });

            alert(staffData ? 'Nhân viên đã được cập nhật thành công.' : 'Nhân viên đã được thêm thành công.');
            // Reset form
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
                    <option value="STAFF">STAFF</option>
                </select>
            </div>

            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                {staffData ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên'}
            </button>
        </form>
    );
};

export default AddStaffForm;
