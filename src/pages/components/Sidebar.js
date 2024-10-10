import Link from 'next/link';
import { useState } from 'react';

const Sidebar = () => {
    const [selected, setSelected] = useState(); // Mặc định là trang chính

    const handleSelect = (path) => {
        setSelected(path); // Cập nhật mục đã chọn
    };

    return (
        <div className="bg-white w-64 h-full shadow-md">
            <h2 className="text-lg font-bold p-4">Quản Lý</h2>
            <ul className="space-y-2">
                <li>
                    <Link 
                        href="/admin/home" 
                        className={`block p-4 ${selected === '/admin/home' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
                        onClick={() => handleSelect('/admin/home')}
                    >
                        Trang chủ
                    </Link>
                </li>

                <li>
                    <Link 
                        href="/admin/revenue" 
                        className={`block p-4 ${selected === '/admin/revenue' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
                        onClick={() => handleSelect('/admin/revenue')}
                    >
                        Thống Kê
                    </Link>
                </li>

                <li>
                    <Link 
                        href="/admin/customers" 
                        className={`block p-4 ${selected === '/admin/customers' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
                        onClick={() => handleSelect('/admin/customers')}
                    >
                        Quản Lý Khách Hàng
                    </Link>
                </li>

                <li>
                    <Link 
                        href="/admin/staffs" 
                        className={`block p-4 ${selected === '/admin/staffs' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
                        onClick={() => handleSelect('/admin/staffs')}
                    >
                        Quản Lý Nhân Viên
                    </Link>
                </li>

                <li>
                    <Link 
                        href="/admin/prices" 
                        className={`block p-4 ${selected === '/admin/prices' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
                        onClick={() => handleSelect('/admin/prices')}
                    >
                        Quản Lý Giá
                    </Link>
                </li>

                <li>
                    <Link 
                        href="/admin/types" 
                        className={`block p-4 ${selected === '/admin/types' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
                        onClick={() => handleSelect('/admin/types')}
                    >
                        Quản Lý Loại Bàn
                    </Link>
                </li>

                <li>
                    <Link 
                        href="/admin/tables" 
                        className={`block p-4 ${selected === '/admin/tables' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
                        onClick={() => handleSelect('/admin/tables')}
                    >
                        Quản Lý Bàn
                    </Link>
                </li>

                <li>
                    <Link 
                        href="/admin/invoices" 
                        className={`block p-4 ${selected === '/admin/invoices' ? 'bg-blue-300' : 'hover:bg-blue-200'} focus:outline-none`} 
                        onClick={() => handleSelect('/admin/invoices')}
                    >
                        Quản Lý Hóa Đơn
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
