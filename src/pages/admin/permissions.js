


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const PermissionManagement = () => {
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [newPermission, setNewPermission] = useState({ name: '', roles: [] });
    const [editingPermissionId, setEditingPermissionId] = useState(null);
    const [activeTab, setActiveTab] = useState('ADMIN');
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    
    // Thêm các trạng thái cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchPermissions = async () => {
        try {
            const token = localStorage.getItem('token');
                console.log("Token: ", token);  // Kiểm tra token trước khi gọi API
            
                if (!token) throw new Error('Chưa đăng nhập hoặc token không tồn tại.');

            const response = await axios.get('/api/users/admins/permissions/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = response.data;

            if (Array.isArray(data)) {
                setPermissions(data);
            } else {
                console.error('Dữ liệu không phải là mảng:', data);
                setPermissions([]);
            }
        } catch (error) {
            console.error('Không thể tải danh sách quyền hạn:', error);
            setPermissions([]);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get('/api/users/admins/roles/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = response.data;

            if (Array.isArray(data)) {
                const rolesExtracted = data.map(item => {
                    return { id: item.id, name: item.name };
                });
                setRoles(rolesExtracted);
            } else {
                console.warn('Dữ liệu không phải là mảng:', data);
                setRoles([]);
            }
        } catch (error) {
            console.error('Không thể tải danh sách role:', error);
            setRoles([]);
        }
    };

    const savePermission = async (e) => {
        e.preventDefault();
        try {
            const rolesWithId = newPermission.roles.map(roleName => {
                const role = roles.find(r => r.name === roleName);
                return role ? { id: role.id, name: role.name } : null;
            }).filter(role => role !== null);

            if (rolesWithId.length === 0 || rolesWithId.some(role => role.id === null)) {
                alert('Vui lòng chọn vai trò hợp lệ!');
                return;
            }

            const nameCheckResponse = await axios.get(`/api/users/admins/permissions/check-name/${newPermission.name.toLowerCase()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (nameCheckResponse.data) {
                alert('Tên quyền đã tồn tại! Vui lòng chọn tên khác.');
                return;
            }

            if (editingPermissionId) {
                await axios.put(`/api/users/admins/permissions/update/${editingPermissionId}`, {
                    name: newPermission.name,
                    roles: rolesWithId,
                });
                alert('Quyền hạn đã được cập nhật thành công!');
            } else {
                await axios.post('/api/users/admins/permissions/add', {
                    name: newPermission.name,
                    roles: rolesWithId,
                });
                alert('Quyền hạn đã được thêm thành công!');
            }

            fetchPermissions();
            resetForm();
        } catch (error) {
            console.error('Lỗi khi lưu quyền hạn:', error);
        }
    };

    const resetForm = () => {
        setNewPermission({ name: '', roles: [] });
        setEditingPermissionId(null);
        setShowForm(false);
    };

    const handleEditPermission = (permission) => {
        setEditingPermissionId(permission.id);
        setNewPermission({
            name: permission.name,
            roles: permission.roles.map(role => role.name),
        });
        setShowForm(true);
    };

    const handleDeletePermission = async (permissionId) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa quyền hạn này?');
        if (confirmDelete) {
            try {
                await axios.delete(`/api/users/admins/permissions/delete/${permissionId}`);
                alert('Quyền hạn đã được xóa thành công!');
                fetchPermissions();
            } catch (error) {
                console.error('Lỗi khi xóa quyền hạn:', error);
            }
        }
    };

    useEffect(() => {
        fetchPermissions();
        fetchRoles();
    }, []);

    const handleRoleChange = (event) => {
        const { value, checked } = event.target;
        setNewPermission((prev) => ({
            ...prev,
            roles: checked ? [...prev.roles, value] : prev.roles.filter((role) => role !== value),
        }));
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    // Tính toán các quyền hạn được hiển thị trên trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPermissions = permissions.filter(permission => 
        permission.roles.some(role => role.name === activeTab)
    ).slice(startIndex, startIndex + itemsPerPage);

    // Tính tổng số trang
    const totalPages = Math.ceil(permissions.filter(permission => 
        permission.roles.some(role => role.name === activeTab)
    ).length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar className="w-1/4 bg-gray-200 p-4" />
                <main className="flex-1 p-6">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Quyền Hạn</h1>
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-700 mr-5"
                    >
                        {showForm ? 'Ẩn Form' : 'Thêm Quyền'}
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Làm Mới
                    </button>

                    {showForm && (
                        <form onSubmit={savePermission} className="mb-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold">Tên Quyền Hạn:</label>
                                <input
                                    type="text"
                                    value={newPermission.name}
                                    onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })}
                                    className="w-full border px-3 py-2"
                                    required
                                />
                            </div>

                            <h3 className="text-lg font-semibold mb-2">Chọn Vai Trò:</h3>
                            <div className="flex flex-wrap">
                                {Array.isArray(roles) && roles.length > 0 ? (
                                    roles.map((role) => (
                                        <div key={role.id} className="mr-4 mb-2">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={role.name}
                                                    checked={newPermission.roles.includes(role.name)}
                                                    onChange={handleRoleChange}
                                                    className="mr-2"
                                                />
                                                {role.name}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có vai trò nào.</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                            >
                                {editingPermissionId ? 'Cập Nhật' : 'Lưu Quyền Hạn'}
                            </button>
                        </form>
                    )}

                    {/* Tab Navigation */}
                    <div className="mb-4">
                        <button 
                            onClick={() => setActiveTab('ADMIN')}
                            className={`mr-2 px-4 py-2 rounded ${activeTab === 'ADMIN' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            Admin
                        </button>

                        <button 
                            onClick={() => setActiveTab('MANAGER')}
                            className={`mr-2 px-4 py-2 rounded ${activeTab === 'MANAGER' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            Manager
                        </button>

                        <button 
                            onClick={() => setActiveTab('STAFF')}
                            className={`mr-2 px-4 py-2 rounded ${activeTab === 'STAFF' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            Staff
                        </button>

                        <button 
                            onClick={() => setActiveTab('CUSTOMER')}
                            className={`mr-2 px-4 py-2 rounded ${activeTab === 'CUSTOMER' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            Customer
                        </button>
                    </div>

                    {/* Nội dung của các tab */}
                    {['ADMIN', 'MANAGER', 'STAFF', 'CUSTOMER'].map((roleName) => (
                        activeTab === roleName && (
                            <div key={roleName} className="mb-8">
                                <h2 className="text-xl font-bold mb-4">{roleName}</h2>
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-300 p-2">ID</th>
                                            <th className="border border-gray-300 p-2">Tên Quyền</th>
                                            <th className="border border-gray-300 p-2">Vai Trò</th>
                                            <th className="border border-gray-300 p-2">Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentPermissions.length > 0 ? currentPermissions.map((permission) => (
                                            permission.roles.some(role => role.name === roleName) && (
                                                <tr key={permission.id}>
                                                    <td className="border border-gray-300 p-2 text-center">{permission.id}</td>
                                                    <td className="border border-gray-300 p-2 text-center">{permission.name}</td>
                                                    <td className="border border-gray-300 p-2 text-center">{roleName}</td>
                                                    <td className="border border-gray-300 py-2 px-4 text-center">
                                                        <button
                                                            onClick={() => handleEditPermission(permission)}
                                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePermission(permission.id)}
                                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 ml-2"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="border border-gray-300 p-2 text-center">
                                                    Không có quyền hạn nào cho vai trò này.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Phân trang */}
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
                            </div>
                        )
                    ))}
                </main>
            </div>
        </div>
    );
};

export default PermissionManagement;


