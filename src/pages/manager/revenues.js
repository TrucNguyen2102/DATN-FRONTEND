import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Auto import chart.js dependencies
import Header from '../components/Header'; // Import Header
import Sidebar from '../components/Sidebar'; // Import Sidebar

const StatisticsPage = () => {
  const [ordersToday, setOrdersToday] = useState(0);
  const [topTable, setTopTable] = useState('');
  const [revenueData, setRevenueData] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0
  });
  const [chartData, setChartData] = useState({}); // Data for chart

  useEffect(() => {
    // Giả sử đây là các API gọi dữ liệu thống kê
    const fetchStatistics = async () => {
      try {
        // Số đơn trong 1 ngày
        const ordersTodayResponse = await axios.get('/api/orders/today');
        setOrdersToday(ordersTodayResponse.data.count);

        // Bàn nào được đặt nhiều nhất
        const topTableResponse = await axios.get('/api/tables/top');
        setTopTable(topTableResponse.data.tableNum);

        // Doanh thu theo ngày, tháng, năm
        const revenueResponse = await axios.get('/api/revenue');
        setRevenueData({
          daily: revenueResponse.data.daily,
          monthly: revenueResponse.data.monthly,
          yearly: revenueResponse.data.yearly
        });

        // Dữ liệu cho biểu đồ doanh thu
        const chartResponse = await axios.get('/api/revenue/chart');
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
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">

        <Sidebar className="w-1/4 bg-gray-200 p-4" />

        <main className="flex-1 p-6">
            {/* <div className="p-8 bg-gray-100 min-h-screen"> */}
            <h1 className="text-3xl font-semibold mb-8 text-center">Thống Kê</h1>

            {/* Phần thống kê nhanh */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {/* Số đơn trong 1 ngày */}
                <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-semibold">Số đơn trong hôm nay</h2>
                <p className="text-2xl text-blue-600 font-bold">{ordersToday}</p>
                </div>

                {/* Bàn được đặt nhiều nhất */}
                <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-semibold">Bàn được đặt nhiều nhất</h2>
                <p className="text-2xl text-green-600 font-bold">{topTable}</p>
                </div>

                {/* Doanh thu theo ngày */}
                <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-semibold">Doanh thu trong ngày</h2>
                <p className="text-2xl text-red-600 font-bold">{revenueData.daily} VND</p>
                </div>

                {/* Doanh thu theo tháng */}
                <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-semibold">Doanh thu theo tháng</h2>
                <p className="text-2xl text-red-600 font-bold">{revenueData.monthly} VND</p>
                </div>

                {/* Doanh thu theo năm */}
                <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-semibold">Doanh thu theo năm</h2>
                <p className="text-2xl text-red-600 font-bold">{revenueData.yearly} VND</p>
                </div>
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
                        beginAtZero: true
                        }
                    }
                    }}
                />
                ) : (
                <p>Đang tải dữ liệu...</p>
                )}
            </div>
            {/* </div> */}
            </main>
      </div>
    </div>
  );
};

export default StatisticsPage;
