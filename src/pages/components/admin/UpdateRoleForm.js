// import React, { useState, useEffect } from 'react';

// const RoleForm = ({ user, onSave, onClose }) => {
//     const [selectedRole, setSelectedRole] = useState(user?.roles[0] || ''); // Vai trò hiện tại

//     const handleRoleChange = (e) => {
//         setRole(e.target.value);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSave(role);  // Gọi hàm onSave khi form được submit
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//             <div className="bg-white rounded-lg p-6 w-96">
//                 <form onSubmit={handleSubmit}>
//                     <h2 className="text-xl mb-4 text-center font-bold">Chỉnh sửa quyền</h2>
//                     <div className="mb-4">
//                         <label htmlFor="role" className="block text-sm font-semibold">Chọn Vai Trò:</label>
//                         <select id="role" value={role} onChange={handleRoleChange} className="w-full p-2 border border-gray-300 rounded">
//                             <option value="ADMIN">ADMIN</option>
//                             <option value="MANAGER">MANAGER</option>

//                         </select>
//                     </div>
//                     <div className="flex justify-end">
//                         <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Hủy</button>
//                         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Lưu</button>
//                     </div>
//                 </form>
//             </div>
            
//         </div>
//     );
// };

// export default RoleForm;


import React, { useState } from 'react';

const RoleForm = ({ user, onSave, onClose }) => {
    const [selectedRole, setSelectedRole] = useState(user?.roles[0] || ''); // Vai trò hiện tại

    const handleSave = () => {
        if (selectedRole) {
            onSave(selectedRole); // Truyền vai trò mới qua onSave
        } else {
            alert('Vui lòng chọn vai trò.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-96">
                {/* <h2>Cập nhật vai trò cho {user?.fullName}</h2> */}
                <h2 className="text-xl font-bold mb-4 text-center">Chỉnh Sửa Quyền</h2>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                
                </select>
                <button onClick={handleSave}>Lưu</button>
                <button onClick={onClose}>Hủy</button>
            </div>
        </div>
        
    );
};

export default RoleForm;
