import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';

const AdminSidebar = () => {

    const { user } = useContext(AuthContext);
    const router = useRouter();
    const currentPath = router.pathname;

    // Nếu user là null hoặc chưa load xong thì không render sidebar
    if (!user) {
        return null; // Hoặc hiển thị một loading indicator nếu cần
    }

    const adminLinks = [
        { href: "/admin/systems", label: "Tổng Quan Hệ Thống" },
        { href: "/admin/users", label: "Quản Lý Người Dùng" },
        // { href: "/admin/permissions", label: "Quản Lý Quyền Hạn" },
        //{ href: "/admin/apis", label: "Quản Lý API" },
        // { href: "/admin/logs", label: "Xem Logs Hệ Thống" }
    ];

    const links = {
        ADMIN: adminLinks
    };



    return (
        <div className="bg-white w-60 h-full shadow-md">
            <h2 className="text-lg font-bold p-4">Quản Lý</h2>
                <ul className="space-y-2">
                    <li>
                        <Link 
                            href={`/${user.role.toLowerCase()}/home`} 
                            className={`block p-4 ${currentPath === `/${user.role.toLowerCase()}/home` ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`}
                        >
                            Trang Chủ
                        </Link>
                    </li>
                    {links[user.role]?.map((link) => (
                        <li key={link.href}>
                            <Link 
                                href={link.href}
                                className={`block p-4 ${currentPath === link.href ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
        </div>
    )
}
export default AdminSidebar;