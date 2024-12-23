// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Bar } from 'react-chartjs-2';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'chart.js/auto';
// import ManagerHeader from '../../components/Header/ManagerHeader';
// import ManagerSidebar from '../../components/Sidebar/ManagerSidebar';
// import { FaSyncAlt  } from "react-icons/fa"

// const StatisticsPage = () => {
//   const [ordersToday, setOrdersToday] = useState(0);
//   const [topTable, setTopTable] = useState('');
//   const [revenueData, setRevenueData] = useState({
//     daily: 0,
//     monthly: 0,
//     yearly: 0,
//   });
//   const [chartData, setChartData] = useState({});
//   const [selectedDate, setSelectedDate] = useState(new Date());
  
//   // New states
//   const [tablesBookedToday, setTablesBookedToday] = useState(0);
//   const [totalPlayTime, setTotalPlayTime] = useState(0);
//   const [revenueByTableType, setRevenueByTableType] = useState([]);
//   const [bookingId, setBookingId] = useState(null);
  
 


//   useEffect(() => {
//     const fetchStatistics = async () => {
//       try {
//         const formattedDate = selectedDate.toISOString().split('T')[0];

//         //đếm số đơn trong ngày (tính đúng)
//         const ordersTodayResponse = await axios.get(`/api/bookings/orders/today?date=${formattedDate}`);
//         setOrdersToday(ordersTodayResponse.data.count);

//             // Bàn được đặt nhiều nhất theo ngày
//           const topTableResponse = await axios.get(`/api/bookings/booking_table/most-booked-tables?date=${formattedDate}`);

//           if (topTableResponse.data && topTableResponse.data.length > 0) {
//             const tableIds = topTableResponse.data.map(item => item.tableId); // Lấy danh sách các tableId
//             setTopTable(tableIds.join(', ')); // Lưu danh sách tableId dưới dạng chuỗi
//           } else {
//             setTopTable('Không có dữ liệu');
//           }
          
        


//         const revenueResponse = await axios.get(`/api/invoices/revenue?date=${formattedDate}`);
//         setRevenueData({
//           daily: revenueResponse.data.daily, //tính đúng
//           monthly: revenueResponse.data.monthly, //tính đúng
//           yearly: revenueResponse.data.yearly, //tính đúng
//         });

//         const chartResponse = await axios.get(`/api/invoices/revenue?date=${formattedDate}`);
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

//         //cập nhật số bàn đã đặt trong ngày
//         const tablesBookedTodayResponse = await axios.get(`/api/bookings/orders/count-tables?date=${formattedDate}`);
//         setTablesBookedToday(tablesBookedTodayResponse.data.count);

//         //tổng số giờ chơi 
//         const totalPlayTimeResponse = await axios.get(`/api/invoices/total-playtime?date=${formattedDate}`);
//         setTotalPlayTime(totalPlayTimeResponse.data);

//         // //doanh thu
//         // const revenueByTableTypeResponse = await axios.get(`/api/revenue/table-type?date=${formattedDate}`);
//         // setRevenueByTableType(revenueByTableTypeResponse.data);

//       } catch (err) {
//         console.error("Không thể tải dữ liệu thống kê.", err);
//       }
//     };

//     fetchStatistics();
//   }, [selectedDate, bookingId]);

//   const handleRefresh = () => {
//     window.location.reload();
//   };

//   const formatCurrency = (value) => {
//     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col">
//       <ManagerHeader />
//       <div className="flex flex-1">
//         <ManagerSidebar className="w-1/4 bg-gray-200 p-4" />
//         <main className="flex-1 p-6">
//           <h1 className="text-3xl font-semibold mb-8 text-center">Thống Kê</h1>

//           <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1">
//           <FaSyncAlt className="text-white" /> Làm Mới
//           </button>

//           <div className="flex justify-center mb-6">
//             <h3 className='py-2'>Chọn ngày:</h3>
//             <DatePicker
//               selected={selectedDate}
//               onChange={(date) => setSelectedDate(date)}
//               dateFormat="yyyy-MM-dd"
//               className="border p-2 rounded ml-2"
//               placeholderText="Chọn ngày"
//             />
//           </div>

//           <div className="grid grid-cols-3 gap-4 mb-8">
//             <StatCard title="Tổng số đơn trong ngày" value={ordersToday} valueColor="text-blue-600" />
//             <StatCard title="Bàn được đặt nhiều nhất trong ngày" value={topTable} valueColor="text-green-600" />
//             <StatCard title="Doanh thu trong ngày" value={`${formatCurrency(revenueData.daily)} VND`} valueColor="text-red-600" />
//             <StatCard title="Doanh thu theo tháng" value={`${formatCurrency(revenueData.monthly)} VND`} valueColor="text-red-600" />
//             <StatCard title="Doanh thu theo năm" value={`${formatCurrency(revenueData.yearly)} VND`} valueColor="text-red-600" />
//             <StatCard title="Tổng số bàn được đặt trong ngày" value={tablesBookedToday} valueColor="text-purple-600" />
//             <StatCard title="Tổng số giờ chơi của các bàn trong ngày" value={`${Math.floor(totalPlayTime / 60)} giờ ${totalPlayTime % 60} phút`} valueColor="text-yellow-600" />
//           </div>

//           {/* Biểu đồ doanh thu theo ngày */}
//           <div className="bg-white p-6 rounded shadow-md mb-8">
//             <h2 className="text-lg font-semibold mb-4">Biểu Đồ Doanh Thu (Theo Ngày)</h2>
//             {chartData.labels ? (
//               <Bar
//                 data={chartData}
//                 options={{
//                   responsive: true,
//                   scales: {
//                     y: {
//                       beginAtZero: true,
//                     },
//                   },
//                 }}
//               />
//             ) : (
//               <p>Đang tải dữ liệu...</p>
//             )}
//           </div>

          
//           {/* <div className="bg-white p-6 rounded shadow-md">
//             <h2 className="text-lg font-semibold mb-4">Doanh Thu Theo Loại Bàn</h2>
//             {revenueByTableType.map((type, index) => (
//               <StatCard key={index} title={`Doanh thu từ bàn ${type.name}`} value={`${formatCurrency(type.revenue)} VND`} valueColor="text-blue-500" />
//             ))}
//           </div> */}
//         </main>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, value, valueColor }) => (
//   <div className="bg-white p-4 rounded shadow-md">
//     <h2 className="text-lg font-semibold">{title}</h2>
//     <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
//   </div>
// );

// export default StatisticsPage;


import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'chart.js/auto';
import ManagerHeader from '../../components/Header/ManagerHeader';
import ManagerSidebar from '../../components/Sidebar/ManagerSidebar';
import { FaSyncAlt } from "react-icons/fa";

const StatisticsPage = () => {
  const [ordersToday, setOrdersToday] = useState(0);
  const [topTable, setTopTable] = useState('');
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    daily: 0,
    monthly: 0,
    yearly: 0,
  });
  const [chartData, setChartData] = useState({});
  const [tablesBookedToday, setTablesBookedToday] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const fetchStatistics = async () => {
      try {

        // Reset lại tất cả giá trị trước khi gọi API
        setOrdersToday(0); // Reset tổng số đơn
        setTopTable('Không có dữ liệu'); // Reset bàn được đặt nhiều nhất
        setRevenueData({
          totalRevenue: 0, // Reset tổng doanh thu
          daily: 0,
          monthly: 0,
          yearly: 0,
        });
        setTablesBookedToday(0); // Reset tổng số bàn được đặt
        setTotalPlayTime(0); // Reset tổng số giờ chơi
        setChartData({ labels: [], datasets: [] }); // Reset biểu đồ

        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        // tổng số đơn từ ngày đến ngày
        const ordersResponse = await axios.get(`/api/bookings/orders/range`, {
          params: { startDate: formattedStartDate, endDate: formattedEndDate },
        });
        
        setOrdersToday(ordersResponse.data.count || "Không có dữ liệu");

        //             // Bàn được đặt nhiều nhất theo ngày
        const topTableResponse = await axios.get(`/api/bookings/booking_table/most-booked-tables/range`, {
          params: { startDate: formattedStartDate, endDate: formattedEndDate },
        
        });
           

        if (topTableResponse.data && topTableResponse.data.length > 0) {
          const tableIds = topTableResponse.data.map(item => item.tableId); // Lấy danh sách các tableId
          setTopTable(tableIds.join(', ')); // Lưu danh sách tableId dưới dạng chuỗi
        } else {
          setTopTable('Không có dữ liệu');
        }

        // tổng doanh thu từ ngày đến ngày
        const revenueResponse = await axios.get(`/api/invoices/revenue/range`, {
          params: { startDate: formattedStartDate, endDate: formattedEndDate },
        });

    
        setRevenueData({
          totalRevenue: revenueResponse.data.totalRevenue ||  "Không có dữ liệu", //tổng doanh thu
          // daily: revenueResponse.data.daily || 0,
          // monthly: revenueResponse.data.monthly || 0,
          // yearly: revenueResponse.data.yearly || 0,
        });

        const chartResponse = await axios.get(`/api/invoices/chart-data`, {
          params: { startDate: formattedStartDate, endDate: formattedEndDate },
        });
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

        //tổng số bàn đc đặt
        const tablesResponse = await axios.get(`/api/bookings/orders/count-tables/range`, {
          params: { startDate: formattedStartDate, endDate: formattedEndDate },
        });
        setTablesBookedToday(tablesResponse.data.count || "Không có dữ liệu");

        //tổng số giờ chơi
        const playTimeResponse = await axios.get(`/api/invoices/total-playtime`, {
          params: { startDate: formattedStartDate, endDate: formattedEndDate },
        });
        setTotalPlayTime(playTimeResponse.data.totalMinutes || "Không có dữ liệu");

      } catch (error) {
        console.error("Không thể tải dữ liệu thống kê.", error);
      }
    };

    // Kiểm tra nếu ngày bắt đầu lớn hơn ngày kết thúc
    if (startDate > endDate) {
      alert('Ngày bắt đầu không thể lớn hơn ngày kết thúc!');
    } else {
      // setErrorMessage('');
      fetchStatistics();
    }
  }, [startDate, endDate]);

  

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

          <div className="flex justify-center mb-6 gap-4">
            <div>
              <h3 className='py-2'>Từ ngày:</h3>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border p-2 rounded"
                placeholderText="Chọn ngày bắt đầu"
              />
            </div>
            <div>
              <h3 className='py-2'>Đến ngày:</h3>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border p-2 rounded"
                placeholderText="Chọn ngày kết thúc"
              />
            </div>
          </div>

         

          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard title="Tổng số đơn (trừ đơn bị hủy)" value={ordersToday} valueColor="text-blue-600" />
            <StatCard title="Bàn được đặt nhiều nhất" value={topTable} valueColor="text-green-600" />
            <StatCard title="Tổng doanh thu" value={revenueData.totalRevenue > 0 ? `${formatCurrency(revenueData.totalRevenue)} VND` : 'Không có dữ liệu'} valueColor="text-red-600" />
            <StatCard title="Tổng số bàn được đặt" value={tablesBookedToday > 0 ? tablesBookedToday : 'Không có dữ liệu'} valueColor="text-purple-600" />
            <StatCard title="Tổng số giờ chơi" value={totalPlayTime > 0 ? `${Math.floor(totalPlayTime / 60)} giờ ${totalPlayTime % 60} phút` : 'Không có dữ liệu'} valueColor="text-yellow-600" />
          </div>

          <div className="bg-white p-6 rounded shadow-md mb-8">
  <h2 className="text-lg font-semibold mb-4">Biểu Đồ Doanh Thu (Theo Ngày)</h2> 
  {chartData && chartData.labels && chartData.labels.length > 0 ? (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        scales: {
          y: { 
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString();  // Định dạng số với dấu phẩy
              },
            },
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

const StatCard = ({ title, value, valueColor }) => (
  <div className="bg-white p-4 rounded shadow-md">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
  </div>
);

export default StatisticsPage;

