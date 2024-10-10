import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const CustomersPage = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header/>

            <div className="flex flex-1">
                <Sidebar className="w-1/4 bg-gray-200 p-4" />

                <main className="flex-1 p-6">

                    <h1 className="text-3xl font-semibold mb-8 text-center">Quản Lý Khách Hàng</h1>
                </main>
            </div>
        </div>

        
    )
};

export default CustomersPage;