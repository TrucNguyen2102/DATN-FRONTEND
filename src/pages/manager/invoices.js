import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ManagerHeader from "../components/Header/ManagerHeader";
import ManagerSidebar from "../components/Sidebar/ManagerSidebar";

const ManagerInvoice = () => {

    const [paymentStats, setPaymentStats] = useState([]);

    useEffect(() => {
        const fetchPaymentStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Chưa đăng nhập hoặc token không tồn tại.');

                const response = await axios.get(`/api/invoices/total-by-payment-method`, {
                    // headers: {
                    //     'Authorization': `Bearer ${token}`
                    // }
                });
                setPaymentStats("Response:", response.data);
            } catch (error) {
                console.error('Error fetching payment stats:', error);
            }
        };

        fetchPaymentStats();
    }, []);


    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <ManagerHeader/>

            <div className="flex flex-1">

                <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold">Thống Kê Hóa Đơn Theo Phương Thức Thanh Toán</h2>
                        <table className="w-full mt-4 border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-200 px-4 py-2">Phương Thức</th>
                                    <th className="border border-gray-200 px-4 py-2">Tổng Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(paymentStats) && paymentStats.length > 0 ? (
                                    paymentStats.map((stat, index) => (
                                        <tr key={index} className="text-center">
                                            <td className="border border-gray-200 px-4 py-2">{stat.methodId}</td>
                                            <td className="border border-gray-200 px-4 py-2">{stat.totalMoney.toLocaleString()} VND</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center text-gray-500">
                                            Không có dữ liệu.
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                </main>
                    
            </div>

            

        </div>
    )

}
export default ManagerInvoice;