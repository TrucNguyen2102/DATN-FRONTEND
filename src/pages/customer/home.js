import CustomerHeader from "../../components/Header/CustomerHeader";
// import Sidebar from "../components/Sidebar";
import Chatbox from "../../components/Chatbox";

import Link from 'next/link';
import Footer from "../../components/Footer";

const CustomerHome = () => {
    // return (
    //     <div className="bg-gray-100 min-h-screen flex flex-col">
    //         <CustomerHeader/>

    //         <div className="flex flex-1">
    //             <Sidebar className="w-1/4 bg-gray-200 p-4" />
    //         </div>
    //     </div>
    // )


    

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
          <CustomerHeader/>
          <div className="container mx-auto mt-10">
            {/* Banner giới thiệu */}
            <div className="relative bg-[url('/images/billiards_banner.jpg')] h-80 bg-cover bg-center rounded-lg shadow-md">
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                <h1 className="text-4xl text-white font-bold">Chào Mừng Đến Với Hệ Thống Giải Trí</h1>
                <p className="text-white mt-2">Billiards</p>
                <Link href="/customer/bookings" className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg text-lg hover:bg-yellow-600 transition">
                Đặt Bàn Ngay
                </Link>
              </div>
            </div>
      
            {/* Chức năng chính */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {/* Đặt bàn */}
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img src="/icons/booking.png" alt="Đặt bàn" className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Đặt Bàn</h2>
                <p>Đặt trước bàn cho hoạt động giải trí của bạn.</p>
                <Link href="/customer/bookings" className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Đặt Bàn
                </Link>
              </div>
      
              {/* Menu */}
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img src="/icons/menu.png" alt="Menu" className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Xem Menu</h2>
                <p>Khám phá các món ăn và đồ uống của chúng tôi.</p>
                <Link href="/customer/menus" className="inline-block mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Xem Menu
                </Link>
              </div>
      
              {/* Lịch sử đặt bàn */}
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img src="/icons/history.png" alt="Lịch sử đặt bàn" className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Lịch sử đặt bàn</h2>
                <p>Xem lại các lần đặt bàn trước đây của bạn.</p>
                <Link href="/customer/history" className="inline-block mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                Xem Lịch sử
                </Link>
              </div>
            </div>
      
            {/* Khuyến mãi hoặc thông tin nổi bật */}
            <div className="mt-10 bg-yellow-100 p-6 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Khuyến mãi đặc biệt!</h2>
              <p>Đặt bàn ngay hôm nay để nhận nhiều ưu đãi hấp dẫn.</p>
              <Link href="/promotions" className="inline-block mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
              Xem khuyến mãi
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <Footer/>
          </div>
          


          {/* Tích hợp Chatbox */}
          <Chatbox />
        </div>
        
      );
}

export default CustomerHome;