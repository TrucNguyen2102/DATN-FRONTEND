import React, { useState } from 'react';

const CancelBookingModal = ({ isOpen, onClose, tableIds, onCancelTable }) => {
    const [selectedTable, setSelectedTable] = useState('');

    const handleCancel = () => {
        if (!selectedTable || !tableIds.includes(parseInt(selectedTable))) {
            alert("Bàn không hợp lệ!");
            return;
        }
        onCancelTable(selectedTable); // Gọi hàm xử lý hủy bàn
        onClose(); // Đóng modal sau khi hủy bàn
    };

    return isOpen ? (
        <div className="mt-6 p-4 border border-gray-300 bg-white">
            <h2 className="text-2xl mb-4">Chọn bàn cần hủy</h2>
                {selectedBooking.tableIds.map((tableId) => (
                    <div key={tableId}>
                        <label>
                            <input
                                type="checkbox"
                                value={tableId}
                                checked={selectedTables.includes(tableId)}
                                onChange={() => handleTableSelect(tableId)}
                            />
                            Bàn {tableId}
                        </label>
                    </div>
                ))}
                <div className="modal-actions">
                    <button onClick={handleCancel} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4">Xác Nhận</button>
                    <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mt-4 ml-2">Đóng</button>
                </div>
        </div>
    ) : null;
};

export default CancelBookingModal;
