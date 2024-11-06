
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useContext } from 'react';
// import AuthContext from '../contexts/AuthContext';

// const Sidebar = () => {
//     const { user } = useContext(AuthContext);
//     const router = useRouter();
//     const currentPath = router.pathname;

//     // Nếu user là null hoặc chưa load xong thì không render sidebar
//     if (!user) {
//         return null; // Hoặc hiển thị một loading indicator nếu cần
//     }

//     // Menu dành riêng cho Admin (Quản lý hệ thống)
//     const adminLinks = [
//         { href: "/admin/systems", label: "Tổng Quan Hệ Thống" },
//         { href: "/admin/users", label: "Quản Lý Người Dùng" },
//         { href: "/admin/permissions", label: "Quản Lý Quyền Hạn" },
//         { href: "/admin/apis", label: "Quản Lý API" },
//         { href: "/admin/logs", label: "Xem Logs Hệ Thống" }
//     ];

//     // Menu dành riêng cho Manager (Quản lý nghiệp vụ)
//     const managerLinks = [
        
//         { href: "/manager/revenues", label: "Thống Kê Doanh Thu" },
//         { href: "/manager/customers", label: "Quản Lý Khách Hàng" },
//         { href: "/manager/staffs", label: "Quản Lý Nhân Viên" },
//         { href: "/manager/prices", label: "Quản Lý Giá" },
//         { href: "/manager/types", label: "Quản Lý Loại Bàn" },
//         { href: "/manager/tables", label: "Quản Lý Bàn Chơi" },
//         { href: "/manager/menus", label: "Quản Lý Menu" },
//         { href: "/manager/invoices", label: "Quản Lý Hóa Đơn" },
//         { href: "/manager/notifications", label: "Quản Lý Thông Báo" },
//         { href: "/manager/accounts", label: "Quản Lý Tài Khoản" }
//     ];

//     // Menu dành riêng cho Staff
//     const staffLinks = [
//         { href: "/staff/tables", label: "Quản Lý Bàn" },
//         { href: "/staff/bookings", label: "Quản Lý Đặt Bàn" },
//         { href: "/staff/accounts", label: "Quản Lý Tài Khoản" }
//     ];

//     // Menu dành riêng cho Customer
//     const customerLinks = [
//         { href: "/customer/bookings", label: "Đặt Bàn" },
//         // { href: "/customer/menus", label: "" },
//         // { href: "/customer/histories", label: "Lịch Sử Đặt Bàn" }
//     ];

//     // Chọn menu theo role của user
//     const links = {
//         ADMIN: adminLinks,
//         MANAGER: managerLinks,
//         STAFF: staffLinks,
//         CUSTOMER: customerLinks
//     };

//     return (
//         <div className="bg-white w-60 h-full shadow-md">
//             <h2 className="text-lg font-bold p-4">Quản Lý</h2>
//             <ul className="space-y-2">
//                 <li>
//                     <Link 
//                         href={`/${user.role.toLowerCase()}/home`} 
//                         className={`block p-4 ${currentPath === `/${user.role.toLowerCase()}/home` ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`}
//                     >
//                         Trang chủ
//                     </Link>
//                 </li>
//                 {links[user.role]?.map((link) => (
//                     <li key={link.href}>
//                         <Link 
//                             href={link.href}
//                             className={`block p-4 ${currentPath === link.href ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`}
//                         >
//                             {link.label}
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default Sidebar;

