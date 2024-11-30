// chỉ text

// import { useState, useContext } from "react";
// import axios from "axios";
// import AuthContext from "../contexts/AuthContext";
// import { format } from "date-fns";

// const Chatbox = () => {
//     const { user } = useContext(AuthContext);
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState("");
//     const [isChatboxVisible, setIsChatboxVisible] = useState(false);
//     const [state, setState] = useState({
//         step: 0,
//         name: "",
//         bookingTime: "",
//         tableType: "",
//         tablePrice: 0,
//         numberOfPeople: 0,
//         // selectedTable: null,
//         selectedTables: [],
//         phoneNumber: "",
//     });

//      // Hàm thêm tin nhắn
//     const addMessage = (content, sender) => {
//         setMessages((prev) => [...prev, { content, sender }]);
//     };

//     const handleSend = () => {
//         if (!input.trim()) return;

//         addMessage(input, "user");
//         handleBotResponse(input.trim());
//         setInput("");
//     };

//     // Hàm để lấy giá từ priceIds
//     async function getTablePrice(priceId) {
//         try {
//             // Giả sử bạn có một API khác để lấy thông tin giá từ priceId
//             const response = await axios.get(`/api/tables/prices/${priceId}`);
//             return response.data.price;  // Trả về giá bàn từ API
//         } catch (error) {
//             console.error("Lỗi khi lấy giá bàn:", error);
//             return 0;  // Trả về giá mặc định nếu gặp lỗi
//         }
//     }

//     const formatDate = (date) => {
//         const d = new Date(date); // Đảm bảo chuyển đổi sang đối tượng Date
//         const yyyy = d.getFullYear();
//         const MM = String(d.getMonth() + 1).padStart(2, '0');
//         const dd = String(d.getDate()).padStart(2, '0');
//         const HH = String(d.getHours()).padStart(2, '0');
//         const mm = String(d.getMinutes()).padStart(2, '0');
//         return `${yyyy}-${MM}-${dd}T${HH}:${mm}:00`; // Định dạng yyyy-MM-dd'T'HH:mm:ss
//     };
    
    
    


//     const handleBotResponse = async (userInput) => {
//         const newState = { ...state };

//         switch (state.step) {
//             case 0:
//                 addMessage("Xin chào! Quý khách vui lòng cho tôi biết tên của mình ạ.", "bot");
//                 newState.step = 1;
//                 break;

//             case 1:
//                 newState.name = userInput;
//                 addMessage(
//                     `Chào ${newState.name}! Quý khách muốn đặt bàn hay cần hỗ trợ gì khác?`,
//                     "bot"
//                 );
//                 newState.step = 2;
//                 break;

//             case 2:
//                 if (userInput.toLowerCase().includes("đặt bàn")) {
//                     addMessage("Quý khách muốn đặt bàn vào lúc mấy giờ (chỉ trong hôm nay)?", "bot");
//                     newState.step = 3;
//                 } else {
//                     addMessage("Xin lỗi, tôi chỉ hỗ trợ đặt bàn vào lúc này.", "bot");
//                 }
//                 break;

//             // case 3:
//             //     newState.bookingTime = userInput;
//             //     addMessage("Quý khách muốn đặt bàn loại nào? (Bàn Bi Lỗ, Bàn Băng)", "bot");
//             //     newState.step = 4;
//             //     break;

//             case 3:
//                 // Lấy ngày hiện tại
//                 const today = new Date();
//                 const currentDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

//                 // Ghép ngày hiện tại với giờ mà khách hàng cung cấp
//                 const parsedDate = new Date(`${currentDate}T${userInput}:00`); // Định dạng đầy đủ

//                 if (isNaN(parsedDate.getTime())) {
//                     addMessage("Vui lòng nhập thời gian hợp lệ (định dạng: HH:mm).", "bot");
//                 } else if (parsedDate < new Date()) {
//                     addMessage("Thời gian đặt bàn phải lớn hơn thời gian hiện tại.", "bot");
//                 } else {
//                     // Lưu thời gian đặt bàn vào trạng thái
//                     newState.bookingTime = `${currentDate} ${userInput}:00`;
//                     addMessage("Quý khách muốn đặt bàn loại nào? (Bàn Bi Lỗ, Bàn Băng)", "bot");
//                     newState.step = 4; // Chuyển sang bước 4
//                 }
//             break;


//             case 4:
//                 try {
//                     // Gọi API để lấy các loại bàn và giá từ CSDL
//                     const response = await axios.get("/api/tables/types/all");
//                     const tableTypes = response.data; // Giả sử API trả về danh sách các loại bàn
//                     console.log("TableTypes:", tableTypes);

//                     // Kiểm tra loại bàn người dùng nhập
//                     const selectedTableType = tableTypes.find(type => type.name.toLowerCase() === userInput.toLowerCase());

//                     if (selectedTableType) {
//                         newState.tableType = selectedTableType.name;

//                         // Lấy giá bàn từ priceIds (giả sử priceIds chứa ID của bảng giá)
//                         const tablePrice = await getTablePrice(selectedTableType.priceIds[0]); // Lấy giá từ ID bảng giá đầu tiên
//                         newState.tablePrice = tablePrice;

//                         addMessage(
//                             `Giá bàn ${newState.tableType} là ${newState.tablePrice.toLocaleString()} VND/giờ.`,
//                             "bot"
//                         );

//                         // Gọi API để lấy các bàn trống
//                         const tableResponse = await axios.get("/api/tables/available");
//                         const availableTables = tableResponse.data;

//                         console.log("Available Tables:", availableTables); // Kiểm tra dữ liệu trả về

//                         // Lọc các bàn trống theo loại bàn người dùng đã chọn
//                         const filteredTables = availableTables.filter((table) => {
//                             return table.type && table.type.name.toLowerCase() === newState.tableType.toLowerCase();
//                         });

//                         if (filteredTables.length > 0) {
//                             // Hiển thị danh sách các bàn trống
//                             const tableList = filteredTables
//                                 .map(
//                                     (table) =>
//                                         `Bàn số ${table.tableNum} - trạng thái: ${table.tableStatus}.`
//                                 )
//                                 .join("\n");

//                             addMessage(
//                                 `Quý khách có thể chọn một trong các bàn sau:\n${tableList}`,
//                                 "bot"
//                             );
//                             newState.step = 5;
//                         } else {
//                             addMessage("Hiện tại không còn bàn trống phù hợp.", "bot");
//                             newState.step = 0;
//                         }
//                     } else {
//                         addMessage("Vui lòng chọn loại bàn hợp lệ.", "bot");
//                     }
//                 } catch (error) {
//                     addMessage("Có lỗi xảy ra khi lấy thông tin loại bàn hoặc kiểm tra bàn trống từ hệ thống.", "bot");
//                     console.error(error); // Ghi log lỗi để tiện debug
//                 }
//                 break;

//              case 5:
//                 const selectedTablesInput = userInput.split(",").map(table => parseInt(table.trim(), 10)).filter(table => !isNaN(table));

//                     if (selectedTablesInput.length > 0) {
//                         // Lọc các bàn hợp lệ chưa được chọn
//                         selectedTablesInput.forEach(table => {
//                             if (!newState.selectedTables.includes(table)) {
//                                 newState.selectedTables.push(table);  // Thêm bàn vào danh sách
//                             }
//                         });

//                         // Hiển thị các bàn đã chọn
//                         const selectedTablesList = newState.selectedTables.join(", ");
//                         addMessage(`Quý khách đã chọn các bàn: ${selectedTablesList}. Vui lòng nhập số điện thoại để tiếp tục đặt bàn.`, "bot");

//                         // Tiến hành yêu cầu nhập số điện thoại
//                         newState.step = 6; // Chuyển sang bước yêu cầu số điện thoại
//                     } else {
//                         addMessage("Vui lòng chọn số bàn hợp lệ (ví dụ: 7, 8).", "bot");
//                     }
//                 break;



//                 case 6:
//                     newState.phoneNumber = userInput;
//                     addMessage(
//                         `Xác nhận lại thông tin:\n
//                         - Tên: ${newState.name}\n
//                         - Thời gian: ${newState.bookingTime}\n
//                         - Loại bàn: ${newState.tableType}\n
//                         - Số điện thoại: ${newState.phoneNumber}\n
//                         - Số bàn: ${newState.selectedTables.join(", ")}\n
//                         - Giá: ${newState.tablePrice.toLocaleString()} VND/giờ.\n
//                         Quý khách có muốn xác nhận không?`,
//                         "bot"
//                     );
//                     newState.step = 7;
//                     break;
                

//             case 7:
//                     if (userInput.toLowerCase().includes("xác nhận")) {

//                         // Kiểm tra giá trị của state.bookingTime
//                         console.log("Booking Time:", state.bookingTime);
//                         if (!state.bookingTime) {
//                             console.error("Thời gian đặt bàn không hợp lệ!");
//                             addMessage("Thời gian đặt bàn không hợp lệ. Vui lòng thử lại.", "bot");
//                             return; // Kết thúc xử lý nếu bookingTime không hợp lệ
//                         }

//                         // Định dạng bookingTime theo chuẩn ISO 8601
//                         const formattedBookingTime = formatDate((state.bookingTime))
//                         console.log("Format:", formattedBookingTime);
                        
//                         const bookingData = {
//                             bookingTime: formattedBookingTime, // Định dạng thời gian
//                             expiryTime: "", // Để trống vì không cần
//                             status: "Chờ Xác Nhận",
//                             userId: user.id,
//                             // tableIds: [state.selectedTable], // Gửi danh sách ID bàn
//                             tableIds: state.selectedTables,  // Gửi mảng các ID bàn
//                         };
                       
//                         console.log("Booking Data:", bookingData);
                        
                
//                         try {
//                             // Gọi API để ghi nhận đặt bàn
//                             const response = await axios.post(`/api/bookings/add`, bookingData);
                
//                             if (response.status === 200 || response.status === 201) {
//                                 addMessage("Cảm ơn quý khách! Đặt bàn đã được ghi nhận.", "bot");
                                
//                             } else {
//                                 addMessage("Có lỗi xảy ra khi ghi nhận đặt bàn. Vui lòng thử lại.", "bot");
//                             }
//                         } catch (error) {
//                             console.error("Lỗi khi gọi API đặt bàn:", error);
//                             addMessage("Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.", "bot");
//                         }
                
//                         setState((prev) => ({ ...prev, step: 0 })); // Reset trạng thái
//                     } else {
//                         addMessage("Đặt bàn đã bị hủy. Quý khách cần hỗ trợ thêm gì không?", "bot");
//                         setState((prev) => ({ ...prev, step: 0 }));
//                     }
//                 break;
                

//             default:
//                 addMessage("Xin lỗi, tôi chưa hiểu yêu cầu của bạn.", "bot");
//                 newState.step = 0;
//                 break;
//         }

//         setState(newState);
//     };

//     return (
//         <div>
//             <button
//                 onClick={() => setIsChatboxVisible((prev) => !prev)}
//                 className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
//             >
//                 {isChatboxVisible ? "Đóng Chatbox" : "Mở Chatbox"}
//             </button>
//             {isChatboxVisible && (
//                 <div className="fixed bottom-16 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
//                     <h2 className="text-lg font-semibold mb-2">Hỗ trợ khách hàng</h2>
//                     <div className="h-64 overflow-y-auto border p-2 rounded-lg mb-2">
//                         {messages.map((msg, index) => (
//                             <div
//                                 key={index}
//                                 className={`mb-2 ${
//                                     msg.sender === "user"
//                                         ? "text-right text-blue-500"
//                                         : "text-left text-gray-600"
//                                 }`}
//                             >
//                                 <p className="bg-gray-100 inline-block px-3 py-1 rounded-lg">
//                                     {msg.content}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>
//                     <div className="flex items-center space-x-2">
//                         <input
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             placeholder="Nhập tin nhắn..."
//                             className="flex-1 border rounded-lg p-2"
//                         />
//                         <button
//                             onClick={handleSend}
//                             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                         >
//                             Gửi
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Chatbox;

// text and voice

import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";

const Chatbox = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isChatboxVisible, setIsChatboxVisible] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [state, setState] = useState({
        step: 0,
        name: "",
        bookingTime: "",
        tableType: "",
        tablePrice: 0,
        selectedTables: [],
        phoneNumber: "",
    });

    // Hàm thêm tin nhắn
    const addMessage = (content, sender) => {
        setMessages((prev) => [...prev, { content, sender }]);
    };

    // Xử lý nhận diện giọng nói
    const startListening = () => {
        if ("webkitSpeechRecognition" in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.lang = "vi-VN"; // Ngôn ngữ tiếng Việt
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => setIsListening(true);

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript); // Ghi nhận văn bản vào input
                handleSend(transcript); // Gửi xử lý luôn
            };

            recognition.onerror = (event) => {
                console.error("Lỗi nhận diện giọng nói:", event.error);
                addMessage("Lỗi khi nhận diện giọng nói. Vui lòng thử lại.", "bot");
            };

            recognition.onend = () => setIsListening(false);

            recognition.start();
        } else {
            alert("Trình duyệt không hỗ trợ nhận diện giọng nói.");
        }
    };

    const handleSend = (inputValue = input) => {
        if (!inputValue.trim()) return;

        addMessage(inputValue, "user");
        handleBotResponse(inputValue.trim());
        setInput(""); // Xóa trường nhập sau khi gửi
    };

     // Hàm để lấy giá từ priceIds
    async function getTablePrice(priceId) {
        try {
            // Giả sử bạn có một API khác để lấy thông tin giá từ priceId
            const response = await axios.get(`/api/tables/prices/${priceId}`);
            return response.data.price;  // Trả về giá bàn từ API
        } catch (error) {
            console.error("Lỗi khi lấy giá bàn:", error);
            return 0;  // Trả về giá mặc định nếu gặp lỗi
        }
    }

    const formatDate = (date) => {
        const d = new Date(date); // Đảm bảo chuyển đổi sang đối tượng Date
        const yyyy = d.getFullYear();
        const MM = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const HH = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${yyyy}-${MM}-${dd}T${HH}:${mm}:00`; // Định dạng yyyy-MM-dd'T'HH:mm:ss
    };
    
    const handleBotResponse = async (userInput) => {
        const newState = { ...state };

        switch (state.step) {
            case 0:
                addMessage("Xin chào! Bạn vui lòng cho tôi biết tên của bạn ạ.", "bot");
                newState.step = 1;
                break;

            case 1:
                newState.name = userInput;
                addMessage(
                    `Chào ${newState.name}! Bạn muốn đặt bàn hay cần hỗ trợ gì khác?`,
                    "bot"
                );
                newState.step = 2;
                break;

            case 2:
                if (userInput.toLowerCase().includes("đặt bàn")) {
                    addMessage("Bạn muốn đặt bàn vào lúc mấy giờ (chỉ trong hôm nay)?", "bot");
                    newState.step = 3;
                } else {
                    addMessage("Xin lỗi, tôi chỉ hỗ trợ đặt bàn vào lúc này.", "bot");
                }
                break;

            // case 3:
            //     newState.bookingTime = userInput;
            //     addMessage("Quý khách muốn đặt bàn loại nào? (Bàn Bi Lỗ, Bàn Băng)", "bot");
            //     newState.step = 4;
            //     break;

            case 3:
                // Lấy ngày hiện tại
                const today = new Date();
                const currentDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

                // Ghép ngày hiện tại với giờ mà khách hàng cung cấp
                const parsedDate = new Date(`${currentDate}T${userInput}:00`); // Định dạng đầy đủ

                if (isNaN(parsedDate.getTime())) {
                    addMessage("Vui lòng nhập thời gian hợp lệ (định dạng: HH:mm).", "bot");
                } else if (parsedDate < new Date()) {
                    addMessage("Thời gian đặt bàn phải lớn hơn thời gian hiện tại.", "bot");
                } else {
                    // Lưu thời gian đặt bàn vào trạng thái
                    newState.bookingTime = `${currentDate} ${userInput}:00`;
                    addMessage("Bạn muốn đặt bàn loại nào? (Bàn Bi Lỗ, Bàn Băng)", "bot");
                    newState.step = 4; // Chuyển sang bước 4
                }
            break;


            case 4:
                try {
                    // Gọi API để lấy các loại bàn và giá từ CSDL
                    const response = await axios.get("/api/tables/types/all");
                    const tableTypes = response.data; // Giả sử API trả về danh sách các loại bàn
                    console.log("TableTypes:", tableTypes);

                    // Kiểm tra loại bàn người dùng nhập
                    const selectedTableType = tableTypes.find(type => type.name.toLowerCase() === userInput.toLowerCase());

                    if (selectedTableType) {
                        newState.tableType = selectedTableType.name;

                        // Lấy giá bàn từ priceIds (giả sử priceIds chứa ID của bảng giá)
                        const tablePrice = await getTablePrice(selectedTableType.priceIds[0]); // Lấy giá từ ID bảng giá đầu tiên
                        newState.tablePrice = tablePrice;

                        addMessage(
                            `Giá bàn ${newState.tableType} là ${newState.tablePrice.toLocaleString()} VND/giờ.`,
                            "bot"
                        );

                        // Gọi API để lấy các bàn trống
                        const tableResponse = await axios.get("/api/tables/available");
                        const availableTables = tableResponse.data;

                        console.log("Available Tables:", availableTables); // Kiểm tra dữ liệu trả về

                        // Lọc các bàn trống theo loại bàn người dùng đã chọn
                        const filteredTables = availableTables.filter((table) => {
                            return table.type && table.type.name.toLowerCase() === newState.tableType.toLowerCase();
                        });

                        if (filteredTables.length > 0) {
                            // Hiển thị danh sách các bàn trống
                            const tableList = filteredTables
                                .map(
                                    (table) =>
                                        `Bàn số ${table.tableNum} - trạng thái: ${table.tableStatus}.`
                                )
                                .join("\n");

                            addMessage(
                                `Bạn có thể chọn một trong các bàn sau:\n${tableList}`,
                                "bot"
                            );
                            newState.step = 5;
                        } else {
                            addMessage("Hiện tại không còn bàn trống phù hợp.", "bot");
                            newState.step = 0;
                        }
                    } else {
                        addMessage("Vui lòng chọn loại bàn hợp lệ.", "bot");
                    }
                } catch (error) {
                    addMessage("Có lỗi xảy ra khi lấy thông tin loại bàn hoặc kiểm tra bàn trống từ hệ thống.", "bot");
                    console.error(error); // Ghi log lỗi để tiện debug
                }
                break;

             case 5:
                const selectedTablesInput = userInput.split(",").map(table => parseInt(table.trim(), 10)).filter(table => !isNaN(table));

                    if (selectedTablesInput.length > 0) {
                        // Lọc các bàn hợp lệ chưa được chọn
                        selectedTablesInput.forEach(table => {
                            if (!newState.selectedTables.includes(table)) {
                                newState.selectedTables.push(table);  // Thêm bàn vào danh sách
                            }
                        });

                        // Hiển thị các bàn đã chọn
                        const selectedTablesList = newState.selectedTables.join(", ");
                        addMessage(`Bạn đã chọn các bàn: ${selectedTablesList}. Vui lòng nhập số điện thoại để tiếp tục đặt bàn.`, "bot");

                        // Tiến hành yêu cầu nhập số điện thoại
                        newState.step = 6; // Chuyển sang bước yêu cầu số điện thoại
                    } else {
                        addMessage("Vui lòng chọn số bàn hợp lệ (ví dụ: 7, 8).", "bot");
                    }
                break;



                case 6:
                    newState.phoneNumber = userInput;
                    addMessage(
                        `Xác nhận lại thông tin:\n
                        - Tên: ${newState.name}\n
                        - Thời gian: ${newState.bookingTime}\n
                        - Loại bàn: ${newState.tableType}\n
                        - Số điện thoại: ${newState.phoneNumber}\n
                        - Số bàn: ${newState.selectedTables.join(", ")}\n
                        - Giá: ${newState.tablePrice.toLocaleString()} VND/giờ.\n
                        Bạn có muốn xác nhận không?`,
                        "bot"
                    );
                    newState.step = 7;
                    break;
                

            case 7:
                    if (userInput.toLowerCase().includes("xác nhận")) {

                        // Kiểm tra giá trị của state.bookingTime
                        console.log("Booking Time:", state.bookingTime);
                        if (!state.bookingTime) {
                            console.error("Thời gian đặt bàn không hợp lệ!");
                            addMessage("Thời gian đặt bàn không hợp lệ. Vui lòng thử lại.", "bot");
                            return; // Kết thúc xử lý nếu bookingTime không hợp lệ
                        }

                        // Định dạng bookingTime theo chuẩn ISO 8601
                        const formattedBookingTime = formatDate((state.bookingTime))
                        console.log("Format:", formattedBookingTime);
                        
                        const bookingData = {
                            bookingTime: formattedBookingTime, // Định dạng thời gian
                            expiryTime: "", // Để trống vì không cần
                            status: "Chờ Xác Nhận",
                            userId: user.id,
                            // tableIds: [state.selectedTable], // Gửi danh sách ID bàn
                            tableIds: state.selectedTables,  // Gửi mảng các ID bàn
                        };
                       
                        console.log("Booking Data:", bookingData);
                        
                
                        try {
                            // Gọi API để ghi nhận đặt bàn
                            const response = await axios.post(`/api/bookings/add`, bookingData);
                
                            if (response.status === 200 || response.status === 201) {
                                addMessage("Cảm ơn quý khách! Đặt bàn đã được ghi nhận.", "bot");
                                
                            } else {
                                addMessage("Có lỗi xảy ra khi ghi nhận đặt bàn. Vui lòng thử lại.", "bot");
                            }
                        } catch (error) {
                            console.error("Lỗi khi gọi API đặt bàn:", error);
                            addMessage("Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.", "bot");
                        }
                
                        setState((prev) => ({ ...prev, step: 0 })); // Reset trạng thái
                    } else {
                        addMessage("Đặt bàn đã bị hủy. Quý khách cần hỗ trợ thêm gì không?", "bot");
                        setState((prev) => ({ ...prev, step: 0 }));
                    }
                break;
                

            default:
                addMessage("Xin lỗi, tôi chưa hiểu yêu cầu của bạn.", "bot");
                newState.step = 0;
                break;
        }
        setState(newState);
    };

    return (
        <div>
            <button
                onClick={() => setIsChatboxVisible((prev) => !prev)}
                className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
            >
                {isChatboxVisible ? "Đóng Chatbox" : "Mở Chatbox"}
            </button>
            {isChatboxVisible && (
                <div className="fixed bottom-16 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-2">Hỗ trợ khách hàng</h2>
                    <div className="h-64 overflow-y-auto border p-2 rounded-lg mb-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-2 ${
                                    msg.sender === "user"
                                        ? "text-right text-blue-500"
                                        : "text-left text-gray-600"
                                }`}
                            >
                                <p className="bg-gray-100 inline-block px-3 py-1 rounded-lg">
                                    {msg.content}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 border rounded-lg p-2"
                        />
                        <button
                            onClick={() => handleSend()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Gửi
                        </button>
                        <button
                            onClick={startListening}
                            className={`px-4 py-2 ${
                                isListening ? "bg-red-500" : "bg-green-500"
                            } text-white rounded-lg`}
                        >
                            {isListening ? "Đang ghi âm..." : "Ghi âm"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbox;
