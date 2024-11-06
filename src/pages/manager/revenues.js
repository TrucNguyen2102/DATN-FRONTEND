// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Bar } from 'react-chartjs-2';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'chart.js/auto'; // Auto import chart.js dependencies
// import ManagerHeader from '../components/Header/ManagerHeader';
// import ManagerSidebar from '../components/Sidebar/ManagerSidebar';

// const StatisticsPage = () => {
//   const [ordersToday, setOrdersToday] = useState(0);
//   const [topTable, setTopTable] = useState('');
//   const [revenueData, setRevenueData] = useState({
//     daily: 0,
//     monthly: 0,
//     yearly: 0
//   });
//   const [chartData, setChartData] = useState({}); // Data for chart
//   const [selectedDate, setSelectedDate] = useState(new Date()); // Trạng thái cho ngày được chọn

//   useEffect(() => {
//     // Giả sử đây là các API gọi dữ liệu thống kê
//     const fetchStatistics = async () => {
//       try {
//          // Định dạng ngày theo yyyy-MM-dd để sử dụng trong API
//          const formattedDate = selectedDate.toISOString().split('T')[0];
        
//          // Số đơn trong 1 ngày dựa trên ngày được chọn
//          const ordersTodayResponse = await axios.get(`/api/bookings/orders/today?date=${formattedDate}`);
//          setOrdersToday(ordersTodayResponse.data.count);

//         // Bàn nào được đặt nhiều nhất
//         const topTableResponse = await axios.get('/api/bookings/booking_table/most-booked-tables');
//         setTopTable(topTableResponse.data.tableNum);

//         // Doanh thu theo ngày, tháng, năm
//         const revenueResponse = await axios.get(`/api/invoices/revenue?date=${formattedDate}`);
//         setRevenueData({
//           daily: revenueResponse.data.daily,
//           monthly: revenueResponse.data.monthly,
//           yearly: revenueResponse.data.yearly
//         });

//         // Dữ liệu cho biểu đồ doanh thu
//         const chartResponse = await axios.get(`/api/invoices/revenue/chart?date=${formattedDate}`);
//         setChartData({
//           labels: chartResponse.data.labels,
//           datasets: [
//             {
//               label: 'Doanh thu',
//               data: chartResponse.data.values,
//               backgroundColor: 'rgba(75, 192, 192, 0.6)',
//               borderColor: 'rgba(75, 192, 192, 1)',
//               borderWidth: 1,
//             },
//           ],
//         });
//       } catch (err) {
//         console.error("Không thể tải dữ liệu thống kê.", err);
//       }
//     };

//     fetchStatistics();
//   }, [selectedDate]); // Gọi lại khi selectedDate thay đổi

//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col">
//       <ManagerHeader />

//       <div className="flex flex-1">

//         <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />

//         <main className="flex-1 p-6">
//             {/* <div className="p-8 bg-gray-100 min-h-screen"> */}
//             <h1 className="text-3xl font-semibold mb-8 text-center">Thống Kê</h1>

//             {/* Phần chọn ngày */}
//           <div className="flex justify-center mb-6">
//             <DatePicker
//               selected={selectedDate}
//               onChange={(date) => setSelectedDate(date)}
//               dateFormat="yyyy-MM-dd"
//               className="border p-2 rounded"
//               placeholderText="Chọn ngày"
//             />
//           </div>

//             {/* Phần thống kê nhanh */}
//             <div className="grid grid-cols-3 gap-4 mb-8">
//                 {/* Số đơn trong 1 ngày */}
//                 <div className="bg-white p-4 rounded shadow-md">
//                 <h2 className="text-lg font-semibold">Số đơn trong hôm nay</h2>
//                 <p className="text-2xl text-blue-600 font-bold">{ordersToday}</p>
//                 </div>

//                 {/* Bàn được đặt nhiều nhất */}
//                 <div className="bg-white p-4 rounded shadow-md">
//                 <h2 className="text-lg font-semibold">Bàn được đặt nhiều nhất</h2>
//                 <p className="text-2xl text-green-600 font-bold">{topTable}</p>
//                 </div>

//                 {/* Doanh thu theo ngày */}
//                 <div className="bg-white p-4 rounded shadow-md">
//                 <h2 className="text-lg font-semibold">Doanh thu trong ngày</h2>
//                 <p className="text-2xl text-red-600 font-bold">{revenueData.daily} VND</p>
//                 </div>

//                 {/* Doanh thu theo tháng */}
//                 <div className="bg-white p-4 rounded shadow-md">
//                 <h2 className="text-lg font-semibold">Doanh thu theo tháng</h2>
//                 <p className="text-2xl text-red-600 font-bold">{revenueData.monthly} VND</p>
//                 </div>

//                 {/* Doanh thu theo năm */}
//                 <div className="bg-white p-4 rounded shadow-md">
//                 <h2 className="text-lg font-semibold">Doanh thu theo năm</h2>
//                 <p className="text-2xl text-red-600 font-bold">{revenueData.yearly} VND</p>
//                 </div>
//             </div>

//             {/* Biểu đồ doanh thu theo ngày */}
//             <div className="bg-white p-6 rounded shadow-md mb-8">
//                 <h2 className="text-lg font-semibold mb-4">Biểu Đồ Doanh Thu (Theo Ngày)</h2>
//                 {chartData.labels ? (
//                 <Bar
//                     data={chartData}
//                     options={{
//                     responsive: true,
//                     scales: {
//                         y: {
//                         beginAtZero: true
//                         }
//                     }
//                     }}
//                 />
//                 ) : (
//                 <p>Đang tải dữ liệu...</p>
//                 )}
//             </div>
//             {/* </div> */}
//             </main>
//       </div>
//     </div>
//   );
// };

// export default StatisticsPage;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'chart.js/auto'; // Auto import chart.js dependencies
import ManagerHeader from '../components/Header/ManagerHeader';
import ManagerSidebar from '../components/Sidebar/ManagerSidebar';

const StatisticsPage = () => {
  const [ordersToday, setOrdersToday] = useState(0);
  const [topTable, setTopTable] = useState('');
  const [revenueData, setRevenueData] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
  });
  const [chartData, setChartData] = useState({}); // Data for chart
  const [selectedDate, setSelectedDate] = useState(new Date()); // Trạng thái cho ngày được chọn

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];

        // Số đơn trong 1 ngày
        const ordersTodayResponse = await axios.get(`/api/bookings/orders/today?date=${formattedDate}`);
        setOrdersToday(ordersTodayResponse.data.count);

        // Bàn nào được đặt nhiều nhất
        const topTableResponse = await axios.get('/api/bookings/booking_table/most-booked-tables');
        if (topTableResponse.data && topTableResponse.data.length > 0) {
            const topTable = topTableResponse.data[0]; // Lấy phần tử đầu tiên
            const tableId = topTable[0]; // Giả sử tableId nằm ở chỉ mục 0
            setTopTable(tableId);
            console.log("Top:", tableId);
        } else {
            console.log("Không có bàn nào được đặt nhiều nhất.");
        }


        // Doanh thu theo ngày, tháng, năm
        const revenueResponse = await axios.get(`/api/invoices/revenue?date=${formattedDate}`);
        setRevenueData({
          daily: revenueResponse.data.daily,
          monthly: revenueResponse.data.monthly,
          yearly: revenueResponse.data.yearly,
        });

        // Dữ liệu cho biểu đồ doanh thu
        const chartResponse = await axios.get(`/api/invoices/revenue?date=${formattedDate}`);
        setChartData({
          labels: chartResponse.data.labels,
          datasets: [
            {
              label: 'Doanh thu',
              data: chartResponse.data.values,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Không thể tải dữ liệu thống kê.", err);
      }
    };

    fetchStatistics();
  }, [selectedDate]); // Gọi lại khi selectedDate thay đổi

  const handleRefresh = () => {
    window.location.reload(); // Tải lại trang
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <ManagerHeader />
      <div className="flex flex-1">
        <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-semibold mb-8 text-center">Thống Kê</h1>

          <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                  Làm Mới
          </button>


          {/* Phần chọn ngày */}
          <div className="flex justify-center mb-6">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded"
              placeholderText="Chọn ngày"
            />
          </div>

          {/* Phần thống kê nhanh */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard title="Số đơn trong hôm nay" value={ordersToday} valueColor="text-blue-600" />
            <StatCard title="Bàn được đặt nhiều nhất" value={topTable} valueColor="text-green-600" />
            <StatCard title="Doanh thu trong ngày" value={`${formatCurrency(revenueData.daily)} VND`} valueColor="text-red-600" />
            <StatCard title="Doanh thu theo tháng" value={`${formatCurrency(revenueData.monthly)} VND`} valueColor="text-red-600" />
            <StatCard title="Doanh thu theo năm" value={`${formatCurrency(revenueData.yearly)} VND`} valueColor="text-red-600" />
          </div>

          {/* Biểu đồ doanh thu theo ngày */}
          <div className="bg-white p-6 rounded shadow-md mb-8">
            <h2 className="text-lg font-semibold mb-4">Biểu Đồ Doanh Thu (Theo Ngày)</h2>
            {chartData.labels ? (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <p>Đang tải dữ liệu...</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Component thống kê
const StatCard = ({ title, value, valueColor }) => (
  <div className="bg-white p-4 rounded shadow-md">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
  </div>
);

export default StatisticsPage;

