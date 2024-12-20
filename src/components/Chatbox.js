

// import { useState, useContext, useEffect } from "react";
// import axios from "axios";
// import AuthContext from "../contexts/AuthContext";

// const Chatbox = () => {
//     const { user } = useContext(AuthContext);
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState("");
//     const [isChatboxVisible, setIsChatboxVisible] = useState(false);
//     const [isListening, setIsListening] = useState(false);
//     const [state, setState] = useState({
//         step: 0,
//         name: "",
//         bookingTime: "",
//         tableType: "",
//         tablePrice: 0,
//         selectedTables: [],
//         phoneNumber: "",
//     });

//     useEffect(() => {
//         const script = document.createElement("script");
//         script.src = "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.1.0-beta.0/libs/oversea/index.js";
//         script.async = true;
//         script.onload = () => {
//             const chatClient = new CozeWebSDK.WebChatClient({
//                 config: {
//                     bot_id: "7447759855026503687", // ID Bot
//                 },
//                 componentProps: {
//                     title: "Chatbot hỗ trợ đặt bàn", // Tiêu đề chatbot
//                 },
//             });

//             // // Assuming there's a method to listen for messages directly
//             chatClient.onMessage = (userInput) => {
//                 // const userInput = message.text;
//                 handleBotResponse(userInput); // Adjust based on SDK's actual message format
//             };
            

//             const handleBotResponse = async (userInput) => {
//                 const newState = { ...state };
        
//                 switch (state.step) {
//                     case 0:
//                         addMessage("Xin chào! Bạn vui lòng cho tôi biết tên của bạn ạ.");
//                         newState.step = 1;
//                         break;
        
//                     case 1:
//                         newState.name = userInput;
//                         addMessage(
//                             `Chào ${newState.name}! Bạn muốn đặt bàn hay cần hỗ trợ gì khác?`,
//                             "bot"
//                         );
//                         newState.step = 2;
//                         break;
        
//                     case 2:
//                         if (userInput.toLowerCase().includes("đặt bàn")) {
//                             addMessage("Bạn muốn đặt bàn vào lúc mấy giờ (chỉ trong hôm nay)?");
//                             newState.step = 3;
//                         } else {
//                             addMessage("Xin lỗi, tôi chỉ hỗ trợ đặt bàn vào lúc này.", "bot");
//                         }
//                         break;
        
//                     // case 3:
//                     //     newState.bookingTime = userInput;
//                     //     addMessage("Quý khách muốn đặt bàn loại nào? (Bàn Bi Lỗ, Bàn Băng)", "bot");
//                     //     newState.step = 4;
//                     //     break;
        
//                     case 3:
//                         // Lấy ngày hiện tại
//                         const today = new Date();
//                         const currentDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
        
//                         // Ghép ngày hiện tại với giờ mà khách hàng cung cấp
//                         const parsedDate = new Date(`${currentDate}T${userInput}:00`); // Định dạng đầy đủ
        
//                         if (isNaN(parsedDate.getTime())) {
//                             addMessage("Vui lòng nhập thời gian hợp lệ (định dạng: HH:mm).", "bot");
//                         } else if (parsedDate < new Date()) {
//                             addMessage("Thời gian đặt bàn phải lớn hơn thời gian hiện tại.", "bot");
//                         } else {
//                             // Lưu thời gian đặt bàn vào trạng thái
//                             newState.bookingTime = `${currentDate} ${userInput}:00`;
//                             addMessage("Bạn muốn đặt bàn loại nào? (Bàn Bi Lỗ, Bàn Băng)", "bot");
//                             newState.step = 4; // Chuyển sang bước 4
//                         }
//                     break;
        
        
//                     case 4:
//                         try {
//                             // Gọi API để lấy các loại bàn và giá từ CSDL
//                             const response = await axios.get("/api/tables/types/all");
//                             const tableTypes = response.data; // Giả sử API trả về danh sách các loại bàn
//                             console.log("TableTypes:", tableTypes);
        
//                             // Kiểm tra loại bàn người dùng nhập
//                             const selectedTableType = tableTypes.find(type => type.name.toLowerCase() === userInput.toLowerCase());
        
//                             if (selectedTableType) {
//                                 newState.tableType = selectedTableType.name;
        
//                                 // Lấy giá bàn từ priceIds (giả sử priceIds chứa ID của bảng giá)
//                                 const tablePrice = await getTablePrice(selectedTableType.priceIds[0]); // Lấy giá từ ID bảng giá đầu tiên
//                                 newState.tablePrice = tablePrice;
        
//                                 addMessage(
//                                     `Giá bàn của loại ${newState.tableType} là ${newState.tablePrice.toLocaleString()} VND/giờ.`,
//                                     "bot"
//                                 );
        
//                                 // Gọi API để lấy các bàn trống
//                                 const tableResponse = await axios.get("/api/tables/available");
//                                 const availableTables = tableResponse.data;
        
//                                 console.log("Available Tables:", availableTables); // Kiểm tra dữ liệu trả về
        
//                                 // Lọc các bàn trống theo loại bàn người dùng đã chọn
//                                 const filteredTables = availableTables.filter((table) => {
//                                     return table.type && table.type.name.toLowerCase() === newState.tableType.toLowerCase();
//                                 });
        
//                                 if (filteredTables.length > 0) {
//                                     // Hiển thị danh sách các bàn trống
//                                     const tableList = filteredTables
//                                         .map(
//                                             (table) =>
//                                                 `Bàn số ${table.tableNum} - trạng thái: ${table.tableStatus}`
//                                         )
//                                         .join("\n");
        
//                                     addMessage(
//                                         `Bạn có thể chọn một trong các bàn sau:\n${tableList}`,
//                                         "bot"
//                                     );
//                                     newState.step = 5;
//                                 } else {
//                                     addMessage("Hiện tại không còn bàn trống phù hợp.", "bot");
//                                     newState.step = 0;
//                                 }
//                             } else {
//                                 addMessage("Vui lòng chọn loại bàn hợp lệ.", "bot");
//                             }
//                         } catch (error) {
//                             addMessage("Có lỗi xảy ra khi lấy thông tin loại bàn hoặc kiểm tra bàn trống từ hệ thống.", "bot");
//                             console.error(error); // Ghi log lỗi để tiện debug
//                         }
//                         break;
        
//                      case 5:
//                         const selectedTablesInput = userInput.split(",").map(table => parseInt(table.trim(), 10)).filter(table => !isNaN(table));
        
//                             if (selectedTablesInput.length > 0) {
//                                 // Lọc các bàn hợp lệ chưa được chọn
//                                 selectedTablesInput.forEach(table => {
//                                     if (!newState.selectedTables.includes(table)) {
//                                         newState.selectedTables.push(table);  // Thêm bàn vào danh sách
//                                     }
//                                 });
        
//                                 // Hiển thị các bàn đã chọn
//                                 const selectedTablesList = newState.selectedTables.join(", ");
//                                 addMessage(`Bạn đã chọn các bàn: ${selectedTablesList}. Vui lòng nhập số điện thoại để tiếp tục đặt bàn.`, "bot");
        
//                                 // Tiến hành yêu cầu nhập số điện thoại
//                                 newState.step = 6; // Chuyển sang bước yêu cầu số điện thoại
//                             } else {
//                                 addMessage("Vui lòng chọn số bàn hợp lệ (ví dụ: 7, 8).", "bot");
//                             }
//                         break;
        
        
        
//                         case 6:
//                             newState.phoneNumber = userInput;
//                             addMessage(
//                                 `Xác nhận lại thông tin:\n
//                                 - Tên: ${newState.name}\n
//                                 - Thời gian: ${newState.bookingTime}\n
//                                 - Loại bàn: ${newState.tableType}\n
//                                 - Số điện thoại: ${newState.phoneNumber}\n
//                                 - Số bàn: ${newState.selectedTables.join(", ")}\n
//                                 - Giá: ${newState.tablePrice.toLocaleString()} VND/giờ.\n
//                                 Bạn có muốn xác nhận không?`,
//                                 "bot"
//                             );
//                             newState.step = 7;
//                             break;
                        
        
//                     case 7:
//                             if (userInput.toLowerCase().includes("xác nhận")) {
        
//                                 // Kiểm tra giá trị của state.bookingTime
//                                 console.log("Booking Time:", state.bookingTime);
//                                 if (!state.bookingTime) {
//                                     console.error("Thời gian đặt bàn không hợp lệ!");
//                                     addMessage("Thời gian đặt bàn không hợp lệ. Vui lòng thử lại.", "bot");
//                                     return; // Kết thúc xử lý nếu bookingTime không hợp lệ
//                                 }
        
//                                 // Định dạng bookingTime theo chuẩn ISO 8601
//                                 const formattedBookingTime = formatDate((state.bookingTime))
//                                 console.log("Format:", formattedBookingTime);
                                
//                                 const bookingData = {
//                                     bookingTime: formattedBookingTime, // Định dạng thời gian
//                                     expiryTime: "", // Để trống vì không cần
//                                     status: "Chờ Xác Nhận",
//                                     userId: user.id,
//                                     // tableIds: [state.selectedTable], // Gửi danh sách ID bàn
//                                     tableIds: state.selectedTables,  // Gửi mảng các ID bàn
//                                 };
                               
//                                 console.log("Booking Data:", bookingData);
                                
                        
//                                 try {
//                                     // Gọi API để ghi nhận đặt bàn
//                                     const response = await axios.post(`/api/bookings/add`, bookingData);
                        
//                                     if (response.status === 200 || response.status === 201) {
//                                         addMessage("Cảm ơn quý khách! Đặt bàn đã được ghi nhận.", "bot");
                                        
//                                     } else {
//                                         addMessage("Có lỗi xảy ra khi ghi nhận đặt bàn. Vui lòng thử lại.", "bot");
//                                     }
//                                 } catch (error) {
//                                     console.error("Lỗi khi gọi API đặt bàn:", error);
//                                     addMessage("Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.", "bot");
//                                 }
                        
//                                 setState((prev) => ({ ...prev, step: 0 })); // Reset trạng thái
//                             } else {
//                                 addMessage("Đặt bàn đã bị hủy. Quý khách cần hỗ trợ thêm gì không?", "bot");
//                                 setState((prev) => ({ ...prev, step: 0 }));
//                             }
//                         break;
                        
        
//                     default:
//                         addMessage("Xin lỗi, tôi chưa hiểu yêu cầu của bạn.", "bot");
//                         newState.step = 0;
//                         break;
//                 }
//                 setState(newState);
//             };

            
            

//         };
//         document.body.appendChild(script);
//     }, []);

    



    
// };

// export default Chatbox;

const Chatbox = () => {

        return (
            <div>
                <chat-bot platform_id="b8064211-dc23-4e1e-a544-fcc286f2826f" user_id="03c0276b-1f0e-4e60-b24a-7ebd70265402" chatbot_id="2df04c40-6aa5-486e-86fb-a49dac7bd541" ><a href="https://www.chatsimple.ai/?utm_source=widget&utm_medium=referral">chatsimple</a></chat-bot><script src="https://cdn.chatsimple.ai/chat-bot-loader.js" defer></script>
            </div>
        )
}
export default Chatbox;






