import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import CustomerHeader from '../components/Header/CustomerHeader';
import CustomerSidebar from '../components/Sidebar/CustomerSidebar';

const CustomerBookingTable = () => {
  const { user } = useContext(AuthContext);
  // console.log(user);
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingTime, setBookingTime] = useState('');
  const [tableType, setTableType] = useState('');
  const [tableTypes, setTableTypes] = useState([]);

  
  

  const fetchTables = async () => {
    try {
      const response = await axios.get('/api/tables/with-prices');
      const tablesData = response.data;
      const tablesWithPrices = tablesData.map(table => ({
        id: table.id,
        tableNum: table.tableNum,
        tableStatus: table.tableStatus,
        name: table.typeName || 'Không xác định',
        price: table.price || 0,
      }));

      setTables(tablesWithPrices);
      setTableTypes([...new Set(tablesWithPrices.map(table => table.name))]);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);


  const handleSelectTable = (table) => {
    if (table.tableStatus === "Trống") {
      setSelectedTables(prevSelected => {
        const exists = prevSelected.find(selected => selected.id === table.id); // Kiểm tra nếu bàn đã được chọn
        const newSelected = exists 
          ? prevSelected.filter(selected => selected.id !== table.id) 
          : [...prevSelected, table];
  
        console.log('Selected Tables:', newSelected);
        return newSelected;
      });
    } else {
      console.log('Table is not available:', table);
    }
  };
  
  




  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd}T${HH}:${mm}:00`; // Định dạng yyyy-MM-dd'T'HH:mm:ss
  };
  
  

  

  const handleBookingConfirm = async () => {
    if (selectedTables.length === 0) {
      alert('Vui lòng chọn ít nhất một bàn.');
      return;
    }
  
    if (!bookingTime) {
      alert('Vui lòng chọn thời gian đặt bàn.');
      return;
    }
  
    const selectedBookingTime = new Date(bookingTime);
    const currentTime = new Date();
  
    if (selectedBookingTime <= currentTime) {
      alert('Thời gian đặt phải lớn hơn thời gian hiện tại. Vui lòng chọn lại.');
      return;
    }
  
  
    try {
      const bookingResponse = await axios.post('/api/bookings/add', {
        bookingTime: formatDate(selectedBookingTime),
        expiryTime: '',
        status: 'Chờ Xác Nhận',
        userId: user.id,
        tableIds: selectedTables.map(table => table.id) // Gửi danh sách ID bàn
      });
  
      if (bookingResponse.status === 200 || bookingResponse.status === 201) {
        alert('Đặt bàn thành công!');
        setShowConfirmModal(false);
        setSelectedTables([]);
        setBookingTime('');
        fetchTables(); // Làm mới danh sách bàn sau khi đặt
      } else {
        alert('Có lỗi xảy ra trong quá trình đặt bàn.');
      }
    } catch (error) {
      alert('Bàn đã được đặt bởi người khác và đang chờ xác nhận. Vui lòng chọn bàn khác.');
      console.error('Error confirming booking:', error);
      
      // Kiểm tra phản hồi lỗi có chứa thông tin bàn đã được đặt trước
      // const bookedTableIds = error.response?.data?.bookedTables;
      // if (bookedTableIds && Array.isArray(bookedTableIds)) {
      //     // Tìm bàn bị xung đột và tạo chuỗi hiển thị
      //     const conflictingTables = selectedTables
      //         .filter(table => bookedTableIds.includes(table.id))
      //         .map(table => `Bàn ${table.id}`)
      //         .join(', ');

      //     alert(`Bàn sau đã được đặt bởi người khác: ${conflictingTables}. Vui lòng chọn bàn hoặc thời gian khác.`);
      // } else {
      //     alert('Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại.');
      // }
      

    }
  };



  


  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <CustomerHeader />
      <div className="flex flex-1">
        <CustomerSidebar className="w-1/4 bg-gray-200 p-4" />

        <main className="flex-1 p-6">
          <h1 className="text-3xl font-semibold mb-8 text-center">Danh Sách Bàn</h1>

          <div className='mb-4'>
            <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
              Làm Mới
            </button>
          </div>

          <div className="flex mb-4 items-center space-x-4">
            <div className="flex-1 max-w-xs">
              <label htmlFor="tableType" className="block mb-2">Chọn Loại Bàn:</label>
              <select 
                id="tableType" 
                value={tableType} 
                onChange={(e) => setTableType(e.target.value)} 
                className="border rounded px-4 py-2 h-12 w-full"
              >
                <option value="">Tất cả</option>
                {tableTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 max-w-xs">
              <label htmlFor="bookingTime" className="block mb-2">Chọn Thời Gian Đặt:</label>
              <input
                type="datetime-local"
                id="bookingTime"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="border rounded px-4 py-2 h-12 w-full"
              />
            </div>

            <button
              onClick={() => {
                const selectedBookingTime = new Date(bookingTime);
                const currentTime = new Date();

                if (selectedTables.length === 0) {
                  alert('Vui lòng chọn ít nhất một bàn để đặt.');
                } else if (!bookingTime) {
                  alert('Vui lòng chọn thời gian đặt bàn.');
                } else if (selectedBookingTime <= currentTime) {
                  alert('Thời gian đặt phải lớn hơn thời gian hiện tại. Vui lòng chọn lại.');
                } else {
                  setShowConfirmModal(true);
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 h-12 mt-8"
            >
              Đặt Bàn
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables
              .filter(table => !tableType || table.name === tableType)
              .map((table) => (
                <div
                  key={`${table.id}-${table.tableNum}`}
                  className={`p-6 border rounded-lg shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 ${
                    table.tableStatus === "Trống"
                      ? 'bg-green-100 border-green-500'
                      : table.tableStatus === "Đã Đặt"
                      ? 'bg-gray-300 border-gray-400'
                      : 'bg-orange-100 border-orange-400'
                  }`}
                  onClick={() => handleSelectTable(table)}
                >
                  <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Bàn {table.tableNum}</h2>
                    <p className="text-gray-700 mb-1">Trạng thái: {table.tableStatus}</p>
                    <p className="text-gray-700 mb-1">Loại: {table.name}</p>
                    <p className="text-gray-700 font-semibold">Giá: {table.price} VND</p>
                  </div>
                  <div className="text-center mt-4">
                    {table.tableStatus === "Trống" && (
                      <button className={`px-4 py-2 rounded ${selectedTables.includes(table) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} hover:bg-opacity-80 h-12`}>
                        {selectedTables.includes(table) ? 'Bỏ chọn' : 'Chọn'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded p-6 shadow-lg w-96">
                <h2 className="text-xl font-bold">Xác nhận đặt bàn</h2>
                
                {/* Thông tin thời gian đặt */}
                <p><strong>Thời gian đặt:</strong> {new Date(bookingTime).toLocaleString()}</p>

                <p>Bạn có chắc chắn muốn đặt các bàn sau:</p>
                <ul className="list-disc ml-5">
                  {selectedTables.map(table => (
                    <li key={`${table.id}-${table.tableNum}`}>
                      Bàn {table.tableNum} - Loại: {table.name} - Giá: {table.price} VND
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <button onClick={handleBookingConfirm} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 h-12">
                    Xác Nhận
                  </button>
                  <button onClick={() => setShowConfirmModal(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2 h-12">
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default CustomerBookingTable;

