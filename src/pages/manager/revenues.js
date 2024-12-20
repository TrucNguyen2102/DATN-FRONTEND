import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'chart.js/auto';
import ManagerHeader from '../../components/Header/ManagerHeader';
import ManagerSidebar from '../../components/Sidebar/ManagerSidebar';
import { FaSyncAlt  } from "react-icons/fa"

const StatisticsPage = () => {
  const [ordersToday, setOrdersToday] = useState(0);
  const [topTable, setTopTable] = useState('');
  const [revenueData, setRevenueData] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
  });
  const [chartData, setChartData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // New states
  const [tablesBookedToday, setTablesBookedToday] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [revenueByTableType, setRevenueByTableType] = useState([]);
  const [bookingId, setBookingId] = useState(null);
 


  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];

        //đếm số đơn trong ngày (tính đúng)
        const ordersTodayResponse = await axios.get(`/api/bookings/orders/today?date=${formattedDate}`);
        setOrdersToday(ordersTodayResponse.data.count);

            // Bàn được đặt nhiều nhất theo ngày
          const topTableResponse = await axios.get(`/api/bookings/booking_table/most-booked-tables?date=${formattedDate}`);

          if (topTableResponse.data && topTableResponse.data.length > 0) {
            const tableIds = topTableResponse.data.map(item => item.tableId); // Lấy danh sách các tableId
            setTopTable(tableIds.join(', ')); // Lưu danh sách tableId dưới dạng chuỗi
          } else {
            setTopTable('Không có dữ liệu');
          }
          
        


        const revenueResponse = await axios.get(`/api/invoices/revenue?date=${formattedDate}`);
        setRevenueData({
          daily: revenueResponse.data.daily, //tính đúng
          monthly: revenueResponse.data.monthly, //tính đúng
          yearly: revenueResponse.data.yearly, //tính đúng
        });

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

        //cập nhật số bàn đã đặt trong ngày
        const tablesBookedTodayResponse = await axios.get(`/api/bookings/orders/count-tables?date=${formattedDate}`);
        setTablesBookedToday(tablesBookedTodayResponse.data.count);

        //tổng số giờ chơi 
        const totalPlayTimeResponse = await axios.get(`/api/invoices/total-playtime?date=${formattedDate}`);
        setTotalPlayTime(totalPlayTimeResponse.data);

        // //doanh thu
        // const revenueByTableTypeResponse = await axios.get(`/api/revenue/table-type?date=${formattedDate}`);
        // setRevenueByTableType(revenueByTableTypeResponse.data);

      } catch (err) {
        console.error("Không thể tải dữ liệu thống kê.", err);
      }
    };

    fetchStatistics();
  }, [selectedDate, bookingId]);

  const handleRefresh = () => {
    window.location.reload();
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

          <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1">
          <FaSyncAlt className="text-white" /> Làm Mới
          </button>

          <div className="flex justify-center mb-6">
            <h3 className='py-2'>Chọn ngày:</h3>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded ml-2"
              placeholderText="Chọn ngày"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard title="Tổng số đơn trong ngày" value={ordersToday} valueColor="text-blue-600" />
            <StatCard title="Bàn được đặt nhiều nhất trong ngày" value={topTable} valueColor="text-green-600" />
            <StatCard title="Doanh thu trong ngày" value={`${formatCurrency(revenueData.daily)} VND`} valueColor="text-red-600" />
            <StatCard title="Doanh thu theo tháng" value={`${formatCurrency(revenueData.monthly)} VND`} valueColor="text-red-600" />
            <StatCard title="Doanh thu theo năm" value={`${formatCurrency(revenueData.yearly)} VND`} valueColor="text-red-600" />
            <StatCard title="Tổng số bàn được đặt trong ngày" value={tablesBookedToday} valueColor="text-purple-600" />
            <StatCard title="Tổng số giờ chơi của các bàn trong ngày" value={`${Math.floor(totalPlayTime / 60)} giờ ${totalPlayTime % 60} phút`} valueColor="text-yellow-600" />
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

          
          {/* <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Doanh Thu Theo Loại Bàn</h2>
            {revenueByTableType.map((type, index) => (
              <StatCard key={index} title={`Doanh thu từ bàn ${type.name}`} value={`${formatCurrency(type.revenue)} VND`} valueColor="text-blue-500" />
            ))}
          </div> */}
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
