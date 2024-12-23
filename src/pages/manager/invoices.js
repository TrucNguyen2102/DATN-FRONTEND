// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import ManagerHeader from "../../components/Header/ManagerHeader";
// import ManagerSidebar from "../../components/Sidebar/ManagerSidebar";

// const ManagerInvoice = () => {

//     const [paymentStats, setPaymentStats] = useState([]);

//     useEffect(() => {
//         const fetchPaymentStats = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) throw new Error('Chưa đăng nhập hoặc token không tồn tại.');

//                 const response = await axios.get(`/api/invoices/count-by-payment-method`, {
//                     // headers: {
//                     //     'Authorization': `Bearer ${token}`
//                     // }
//                 });
//                 setPaymentStats("Response:", response.data);
//             } catch (error) {
//                 console.error('Error fetching payment stats:', error);
//             }
//         };

//         fetchPaymentStats();
//     }, []);


//     return (
//         <div className="bg-gray-100 min-h-screen flex flex-col">
//             <ManagerHeader/>

//             <div className="flex flex-1">

//                 <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />

//                 <main className="flex-1 p-6">
//     <h2 className="text-xl font-bold">Thống Kê Hóa Đơn Theo Phương Thức Thanh Toán</h2>

//     <div className="grid grid-cols-3 gap-6 mb-6">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-bold">Tiền Mặt</h2>
//             <p className="text-3xl mt-4">{paymentStats["Tiền mặt"] || 0}</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-bold">Chuyển Khoản</h2>
//             <p className="text-3xl mt-4">{paymentStats["Chuyển khoản ngân hàng"] || 0}</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-bold">Ví Điện Tử</h2>
//             <p className="text-3xl mt-4">{paymentStats["Ví điện tử"] || 0}</p>
//         </div>
//     </div>
// </main>

                    
//             </div>

            

//         </div>
//     )

// }
// export default ManagerInvoice;


import { useEffect, useState } from "react";
import axios from "axios";
import ManagerHeader from "../../components/Header/ManagerHeader";
import ManagerSidebar from "../../components/Sidebar/ManagerSidebar";
import { FaSyncAlt} from "react-icons/fa"

const ManagerInvoice = () => {
    const [invoiceMethod, setInvoiceMethod] = useState({
        "Tiền mặt": 0,
        "Chuyển khoản ngân hàng": 0,
        "Ví điện tử": 0,
    });

    const [invoiceMoney, setInvoiceMoney] = useState({
        "Tiền mặt": 0,
        "Chuyển khoản ngân hàng": 0,
        "Ví điện tử": 0,
    });

    useEffect(() => {
        const fetchInvoicesMethod = async () => {
            try {
                const response = await axios.get(`/api/invoices/count-by-payment-method`);
                const data = response.data;

                // Cập nhật trạng thái với dữ liệu từ API
                setInvoiceMethod({
                    "Tiền mặt": data["Tiền mặt"] || 0,
                    "Chuyển khoản ngân hàng": data["Chuyển khoản ngân hàng"] || 0,
                    "Ví điện tử": data["Ví điện tử"] || 0,
                });
            } catch (error) {
                console.error('Error fetching payment stats:', error);
            }
        };

        fetchInvoicesMethod();
    }, []);


    const formatCurrency = (value) => {
        // return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    useEffect(() => {
        const fetchInvoicesMoney = async () => {
            try {
                const response = await axios.get(`/api/invoices/total-by-payment-method`);
                const data = response.data;
    
                // Truy cập trực tiếp các thuộc tính của đối tượng
                setInvoiceMoney({
                    "Tiền mặt": data["Tiền mặt"] || 0,
                    "Chuyển khoản ngân hàng": data["Chuyển khoản ngân hàng"] || 0,
                    "Ví điện tử": data["Ví điện tử"] || 0,
                });
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu thống kê thanh toán:', error);
            }
        };
    
        fetchInvoicesMoney();
    }, []);
    
    

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <ManagerHeader />

            <div className="flex flex-1">
                <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">

                    <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mb-4 flex items-center gap-1">
                            <FaSyncAlt className="text-white" /> Làm Mới
                    </button>

                    <h2 className="text-2xl font-bold text-center mb-4">Thống Kê Hóa Đơn Theo Phương Thức Thanh Toán</h2>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">Tiền Mặt</h2>
                            <p className="text-3xl mt-4">{invoiceMethod["Tiền mặt"]} đơn</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">Chuyển Khoản</h2>
                            <p className="text-3xl mt-4">{invoiceMethod["Chuyển khoản ngân hàng"]} đơn</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">Ví Điện Tử</h2>
                            <p className="text-3xl mt-4">{invoiceMethod["Ví điện tử"]} đơn</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">Tiền Mặt</h2>
                            <p className="text-3xl mt-4">{formatCurrency(invoiceMoney["Tiền mặt"])} VND</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">Chuyển Khoản</h2>
                            <p className="text-3xl mt-4">{formatCurrency(invoiceMoney["Chuyển khoản ngân hàng"])} VND</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">Ví Điện Tử</h2>
                            <p className="text-3xl mt-4">{formatCurrency(invoiceMoney["Ví điện tử"])} VND</p>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default ManagerInvoice;
