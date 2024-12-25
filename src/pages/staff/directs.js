import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffHeader from '../../components/Header/StaffHeader';
import StaffSidebar from '../../components/Sidebar/StaffSidebar';
import { FaSyncAlt  } from "react-icons/fa"

const DirectBookingForm = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  

  useEffect(() => {
    // Hàm bất đồng bộ để gọi API
    const fetchTableAvailable = async () => {
      try {
        const response = await axios.get('/api/tables/available');
        console.log("Response:", response.data);
        setAvailableTables(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bàn trống:', error);
      }
    };

    // Gọi hàm bất đồng bộ
    fetchTableAvailable();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phone)) {
      alert('Số điện thoại không đúng định dạng!');
        return;
    }

    if (!fullName || !phone || !selectedTables.length) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const bookingData = {
      fullName,
      phone,
      tableIds: selectedTables,
      // Lấy thời gian hiện tại làm bookingTime
      bookingTime: new Date().toISOString()
    };

    // Gửi API lưu booking
    axios.post('/api/bookings/direct', bookingData)
      .then(response => {
        alert('Đặt bàn thành công!');
        // Reset form sau khi đặt bàn thành công
        setFullName('');
        setPhone('');
        setSelectedTables([]);
      })
      .catch(error => {
        // setErrorMessage('Lỗi khi đặt bàn. Vui lòng thử lại!');
        // console.error('Lỗi khi đặt bàn:', error);
        if (error.response && error.response.data) {
          // Lấy thông báo lỗi từ API
          alert(error.response.data);
        } else {
          alert('Lỗi khi đặt bàn. Vui lòng thử lại!');
        }
        console.error('Lỗi khi đặt bàn:', error);
      });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <StaffHeader />

      <div className="flex flex-1">
        <StaffSidebar className="w-1/4 bg-gray-200 p-4" />

        <main className="flex-1 p-6 flex justify-center items-center">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-full max-w-4xl">
            <h2 className="text-3xl font-semibold mb-8 text-center">Đặt Bàn</h2>

            {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

            <div className="mb-4 text-center">
              <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1">
              <FaSyncAlt className="text-white" /> Làm Mới
              </button>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Tên Khách Hàng</label>
              <input
                className="border rounded px-4 py-2 h-12 w-full"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Số Điện Thoại</label>
              <input
                className="border rounded px-4 py-2 h-12 w-full"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
                <label className="block mb-2">Chọn Bàn</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableTables.map((table) => (
                    <div key={table.id} className="flex items-center">
                        <input
                        type="checkbox"
                        id={`table-${table.id}`}
                        value={table.id}
                        checked={selectedTables.includes(table.id)}
                        onChange={(e) => {
                            const tableId = parseInt(e.target.value);
                            if (e.target.checked) {
                              if (selectedTables.length >= 3) {
                                alert('Bạn chỉ có thể chọn tối đa 3 bàn!');
                                return;
                              }
                              setSelectedTables([...selectedTables, tableId]);
                            } else {
                            setSelectedTables(selectedTables.filter((id) => id !== tableId));
                            }
                        }}
                        className="mr-2"
                        />
                        <label htmlFor={`table-${table.id}`}>
                        Bàn {table.tableNum} - {table.type.name} - {table.tableStatus}
                        </label>
                    </div>
                    ))}
                </div>
            </div>


            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 w-full">
              Đặt Bàn
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default DirectBookingForm;
