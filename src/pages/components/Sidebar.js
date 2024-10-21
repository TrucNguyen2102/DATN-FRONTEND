// import Link from 'next/link';
// import { useState, useContext } from 'react';
// import AuthContext from '../contexts/AuthContext';

// const Sidebar = () => {
//     const { user } = useContext(AuthContext);
//     // console.log('User:', user); // Kiểm tra giá trị của user
//     const [selected, setSelected] = useState(); // Mặc định là trang chính

//     const handleSelect = (path) => {
//         setSelected(path); // Cập nhật mục đã chọn
//     };

//     // Nếu user là null hoặc chưa load xong thì không render sidebar
//     if (!user) {
//         return null; // Hoặc hiển thị một loading indicator nếu cần
//     }

//     return (
//         <div className="bg-white w-60 h-full shadow-md">
//             <h2 className="text-lg font-bold p-4">Quản Lý</h2>
//             <ul className="space-y-2">
//                 <li>
//                     <Link 
//                         href={`/${user.role.toLowerCase()}/home`} 
//                         className={`block p-4 ${selected === `/${user.role.toLowerCase()}/home` ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
//                         onClick={() => handleSelect(`/${user.role.toLowerCase()}/home`)}
//                     >
//                         Trang chủ
//                     </Link>
//                 </li>

//                 {/* Liên kết dành riêng cho Admin */}
//                 {user.role === 'ADMIN' && (
//                     <>
//                         <li>
//                             <Link 
//                                 href="/admin/revenue"
//                                 className={`block p-4 ${selected === '/admin/revenue' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
//                                 onClick={() => handleSelect('/admin/revenue')}
//                             >
//                                 Thống Kê
//                             </Link>
//                         </li>
//                         <li>
//                             <Link 
//                                 href="/admin/customers"
//                                 className={`block p-4 ${selected === '/admin/customers' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
//                                 onClick={() => handleSelect('/admin/customers')}
//                             >
//                                 Quản Lý Khách Hàng
//                             </Link>
//                         </li>
//                         <li>
//                             <Link 
//                                 href="/admin/staffs"
//                                 className={`block p-4 ${selected === '/admin/staffs' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
//                                 onClick={() => handleSelect('/admin/staffs')}
//                             >
//                                 Quản Lý Nhân Viên
//                             </Link>
//                         </li>

//                         <li>
//                             <Link 
//                                 href="/admin/prices"
//                                 className={`block p-4 ${selected === '/admin/prices' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
//                                 onClick={() => handleSelect('/admin/prices')}
//                             >
//                                 Quản Lý Giá
//                             </Link>
//                         </li>

//                         <li>
//                             <Link 
//                                 href="/admin/types"
//                                 className={`block p-4 ${selected === '/admin/types' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
//                                 onClick={() => handleSelect('/admin/types')}
//                             >
//                                 Quản Lý Loại Bàn
//                             </Link>
//                         </li>

//                         <li>
//                             <Link 
//                                 href="/admin/tables"
//                                 className={`block p-4 ${selected === '/admin/tables' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
//                                 onClick={() => handleSelect('/admin/tables')}
//                             >
//                                 Quản Lý Bàn
//                             </Link>
//                         </li>

//                         <li>
//                             <Link 
//                                 href="/admin/invoices"
//                                 className={`block p-4 ${selected === '/admin/invoices' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
//                                 onClick={() => handleSelect('/admin/invoices')}
//                             >
//                                 Quản Lý Hóa Đơn
//                             </Link>
//                         </li>
//                     </>
//                 )}

//                 {/* Liên kết dành riêng cho Staff */}
//                 {user.role === 'STAFF' && (
//                     <>
//                         <li>
//                             <Link 
//                                 href="/staff/bookings"
//                                 className={`block p-4 ${selected === '/staff/bookings' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
//                                 onClick={() => handleSelect('/staff/bookings')}
//                             >
//                                 Quản Lý Đặt Bàn
//                             </Link>
//                         </li>
//                         <li>
//                             <Link 
//                                 href="/staff/tables"
//                                 className={`block p-4 ${selected === '/staff/tables' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
//                                 onClick={() => handleSelect('/staff/tables')}
//                             >
//                                 Quản Lý Bàn
//                             </Link>
//                         </li>
//                         <li>
//                             <Link 
//                                 href="/staff/accounts"
//                                 className={`block p-4 ${selected === '/staff/accounts' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
//                                 onClick={() => handleSelect('/staff/accounts')}
//                             >
//                                 Tài Khoản
//                             </Link>
//                         </li>
//                     </>
//                 )}


//                 {/* Liên kết dành riêng cho Customer */}
//                 {user.role === 'CUSTOMER' && (
//                     <>
//                         <li>
//                             <Link 
//                                 href="/user/bookings"
//                                 className={`block p-4 ${selected === '/user/bookings' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
//                                 onClick={() => handleSelect('/user/bookings')}
//                             >
//                                 Lịch Sử Đặt Bàn
//                             </Link>
//                         </li>
//                     </>
//                 )}
//             </ul>
//         </div>
//     );
// };

// export default Sidebar;


import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const currentPath = router.pathname;

    // Nếu user là null hoặc chưa load xong thì không render sidebar
    if (!user) {
        return null; // Hoặc hiển thị một loading indicator nếu cần
    }

    // Menu dành riêng cho Admin (Quản lý hệ thống)
    const adminLinks = [
        { href: "/admin/systems", label: "Tổng Quan Hệ Thống" },
        { href: "/admin/users", label: "Quản Lý Người Dùng" },
        { href: "/admin/permissions", label: "Quản Lý Quyền Hạn" },
        { href: "/admin/apis", label: "Quản Lý API" },
        { href: "/admin/logs", label: "Xem Logs Hệ Thống" }
    ];

    // Menu dành riêng cho Manager (Quản lý nghiệp vụ)
    const managerLinks = [
        
        { href: "/manager/revenues", label: "Thống Kê Doanh Thu" },
        { href: "/manager/customers", label: "Quản Lý Khách Hàng" },
        { href: "/manager/staffs", label: "Quản Lý Nhân Viên" },
        // { href: "/manager/bookings", label: "Quản Lý Đặt Bàn" },
        { href: "/manager/prices", label: "Quản Lý Giá" },
        { href: "/manager/types", label: "Quản Lý Loại Bàn" },
        { href: "/manager/tables", label: "Quản Lý Bàn Chơi" },
        { href: "/manager/menus", label: "Quản Lý Menu" },
        { href: "/manager/accounts", label: "Quản Lý Tài Khoản" }
    ];

    // Menu dành riêng cho Staff
    const staffLinks = [
        { href: "/staff/bookings", label: "Quản Lý Đặt Bàn" },
        { href: "/staff/tables", label: "Quản Lý Bàn" },
        { href: "/staff/accounts", label: "Tài Khoản" }
    ];

    // Menu dành riêng cho Customer
    const customerLinks = [
        { href: "/customer/bookings", label: "Lịch Sử Đặt Bàn" }
    ];

    // Chọn menu theo role của user
    const links = {
        ADMIN: adminLinks,
        MANAGER: managerLinks,
        STAFF: staffLinks,
        CUSTOMER: customerLinks
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
                        Trang chủ
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
    );
};

export default Sidebar;

