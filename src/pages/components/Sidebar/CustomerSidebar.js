import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import AuthContext from '@/pages/contexts/AuthContext';

const CustomerSidebar = () => {

    const { user } = useContext(AuthContext);
    const router = useRouter();
    const currentPath = router.pathname;

    // Nếu user là null hoặc chưa load xong thì không render sidebar
    if (!user) {
        return null; // Hoặc hiển thị một loading indicator nếu cần
    }

    const customerLinks = [
        { href: "/customer/bookings", label: "Đặt Bàn" },
        // { href: "/customer/menus", label: "" },
        { href: "/customer/history", label: "Lịch Sử Đặt Bàn" },
        { href: "/customer/accounts", label: "Quản Lý Tài Khoản" },
        // { href: "/customer/notifications", label: "Thông Báo" }
    ];

    const links = {
        CUSTOMER: customerLinks
    };



    return (
        <div className="bg-white w-60 h-full shadow-md">
            {/* <h2 className="text-lg font-bold p-4">Quản Lý</h2> */}
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
export default CustomerSidebar;