// import { useState, useEffect } from "react";

// const Chatbox = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState("");
//     const [isListening, setIsListening] = useState(false);
//     const [isSupported, setIsSupported] = useState(false);

//     useEffect(() => {
//         if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
//             setIsSupported(true); // Kiểm tra nếu trình duyệt hỗ trợ SpeechRecognition
//         }
//     }, []);

//     const addMessage = (content, sender) => {
//         setMessages((prev) => [...prev, { content, sender }]);
//     };

//     const handleSend = () => {
//         if (!input.trim()) return;

//         addMessage(input, "user");
//         handleBotResponse(input);
//         setInput("");
//     };

//     const handleBotResponse = (userMessage) => {
//         if (userMessage.includes("bàn")) {
//             const suggestedTable = "Gợi ý bàn: Billiards bàn số 3, 6 chỗ, còn trống.";
//             addMessage(suggestedTable, "bot");
//         } else {
//             addMessage("Xin lỗi, tôi chưa hiểu yêu cầu của bạn.", "bot");
//         }
//     };

//     const handleVoiceInput = () => {
//         if (!isSupported) {
//             alert("Trình duyệt của bạn không hỗ trợ chuyển giọng nói thành văn bản.");
//             return;
//         }

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         const recognition = new SpeechRecognition();

//         recognition.continuous = false;
//         recognition.interimResults = false;
//         recognition.lang = "vi-VN";

//         recognition.onstart = () => setIsListening(true);
//         recognition.onend = () => setIsListening(false);
//         recognition.onresult = (event) => {
//             const voiceInput = event.results[0][0].transcript;
//             setInput(voiceInput);
//             addMessage(voiceInput, "user");
//             handleBotResponse(voiceInput);
//         };

//         recognition.start();
//     };

//     return (
//         <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
//             <h2 className="text-lg font-semibold mb-2">Hỗ trợ khách hàng</h2>
//             <div className="h-64 overflow-y-auto border p-2 rounded-lg mb-2">
//                 {messages.map((msg, index) => (
//                     <div
//                         key={index}
//                         className={`mb-2 ${
//                             msg.sender === "user" ? "text-right text-blue-500" : "text-left text-gray-600"
//                         }`}
//                     >
//                         <p className="bg-gray-100 inline-block px-3 py-1 rounded-lg">{msg.content}</p>
//                     </div>
//                 ))}
//             </div>
//             <div className="flex items-center">
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Nhập tin nhắn..."
//                     className="flex-1 border rounded-lg p-2"
//                 />
//                 <button
//                     onClick={handleSend}
//                     className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                 >
//                     Gửi
//                 </button>
//                 <button
//                     onClick={handleVoiceInput}
//                     className={`ml-2 px-4 py-2 ${isListening ? "bg-red-500" : "bg-green-500"} text-white rounded-lg`}
//                 >
//                     {isListening ? "Đang nghe..." : "🎙"}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Chatbox;


// import { useState, useEffect } from "react";

// const Chatbox = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState("");
//     const [isListening, setIsListening] = useState(false);
//     const [isSupported, setIsSupported] = useState(false);
//     const [isChatboxVisible, setIsChatboxVisible] = useState(false); // Quản lý trạng thái ẩn/hiện chatbox

//     useEffect(() => {
//         if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
//             setIsSupported(true); // Kiểm tra nếu trình duyệt hỗ trợ SpeechRecognition
//         }
//     }, []);

//     const addMessage = (content, sender) => {
//         setMessages((prev) => [...prev, { content, sender }]);
//     };

//     const handleSend = () => {
//         if (!input.trim()) return;

//         addMessage(input, "user");
//         handleBotResponse(input);
//         setInput("");
//     };

//     const handleBotResponse = (userMessage) => {
//         if (userMessage.includes("bàn")) {
//             const suggestedTable = "Gợi ý bàn: Billiards bàn số 3, 6 chỗ, còn trống.";
//             addMessage(suggestedTable, "bot");
//         } else {
//             addMessage("Xin lỗi, tôi chưa hiểu yêu cầu của bạn.", "bot");
//         }
//     };

//     const handleVoiceInput = () => {
//         if (!isSupported) {
//             alert("Trình duyệt của bạn không hỗ trợ chuyển giọng nói thành văn bản.");
//             return;
//         }

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         const recognition = new SpeechRecognition();

//         recognition.continuous = false;
//         recognition.interimResults = false;
//         recognition.lang = "vi-VN";

//         recognition.onstart = () => setIsListening(true);
//         recognition.onend = () => setIsListening(false);
//         recognition.onresult = (event) => {
//             const voiceInput = event.results[0][0].transcript;
//             setInput(voiceInput);
//             addMessage(voiceInput, "user");
//             handleBotResponse(voiceInput);
//         };

//         recognition.start();
//     };

//     return (
//         <div>
//             {/* Nút mở/đóng chatbox */}
//             <button
//                 onClick={() => setIsChatboxVisible((prev) => !prev)}
//                 className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
//             >
//                 {isChatboxVisible ? "Đóng Chatbox" : "Mở Chatbox"}
//             </button>

//             {/* Chatbox chỉ hiển thị khi isChatboxVisible === true */}
//             {isChatboxVisible && (
//                 <div className="fixed bottom-16 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
//                     <h2 className="text-lg font-semibold mb-2">Hỗ trợ khách hàng</h2>
//                     <div className="h-64 overflow-y-auto border p-2 rounded-lg mb-2">
//                         {messages.map((msg, index) => (
//                             <div
//                                 key={index}
//                                 className={`mb-2 ${
//                                     msg.sender === "user" ? "text-right text-blue-500" : "text-left text-gray-600"
//                                 }`}
//                             >
//                                 <p className="bg-gray-100 inline-block px-3 py-1 rounded-lg">{msg.content}</p>
//                             </div>
//                         ))}
//                     </div>
//                     <div className="flex items-center">
//                         <input
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             placeholder="Nhập tin nhắn..."
//                             className="flex-1 border rounded-lg p-2"
//                         />
//                         <button
//                             onClick={handleSend}
//                             className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                         >
//                             Gửi
//                         </button>
//                         <button
//                             onClick={handleVoiceInput}
//                             className={`ml-2 px-4 py-2 ${isListening ? "bg-red-500" : "bg-green-500"} text-white rounded-lg`}
//                         >
//                             {isListening ? "Đang nghe..." : "🎙"}
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Chatbox;

import { useState, useEffect } from "react";

const Chatbox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [isChatboxVisible, setIsChatboxVisible] = useState(false); // Trạng thái hiển thị chatbox

    useEffect(() => {
        if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
            setIsSupported(true); // Kiểm tra nếu trình duyệt hỗ trợ SpeechRecognition
        }
    }, []);

    const addMessage = (content, sender) => {
        setMessages((prev) => [...prev, { content, sender }]);
    };

    const handleSend = () => {
        if (!input.trim()) return;

        addMessage(input, "user");
        handleBotResponse(input);
        setInput("");
    };



    const handleBotResponse = async (userMessage) => {
        if (userMessage.includes("bàn")) {
            try {
                // Gọi API kiểm tra bàn trống
                const response = await axios.get(`/api/tables/available`);
                const availableTables = response.data;

                if (availableTables.length > 0) {
                    const suggestedTable = availableTables
                        .map(
                            (table) =>
                                `Bàn số ${table.tableNum}, trạng thái: ${table.tableStaus}.`
                        )
                        .join("\n");
                    addMessage(`Gợi ý bàn trống:\n${suggestedTable}`, "bot");
                } else {
                    addMessage("Hiện tại không còn bàn trống.", "bot");
                }
            } catch (error) {
                addMessage("Xin lỗi, có lỗi xảy ra khi kiểm tra bàn trống.", "bot");
            }
        } else {
            addMessage("Xin lỗi, tôi chưa hiểu yêu cầu của bạn.", "bot");
        }
    };


    const handleVoiceInput = () => {
        if (!isSupported) {
            alert("Trình duyệt của bạn không hỗ trợ chuyển giọng nói thành văn bản.");
            return;
        }
    
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
    
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "vi-VN";
    
        recognition.onstart = () => setIsListening(true); // Bắt đầu ghi âm
        recognition.onend = () => setIsListening(false); // Kết thúc ghi âm
        recognition.onresult = (event) => {
            const voiceInput = event.results[0][0].transcript;
            setInput(""); // Reset lại khung nhập tin nhắn
            addMessage(voiceInput, "user"); // Thêm tin nhắn người dùng vào giao diện
            handleBotResponse(voiceInput); // Xử lý phản hồi bot
        };
    
        recognition.start();
    };
    

    return (
        <div>
            {/* Nút mở/đóng chatbox */}
            <button
                onClick={() => setIsChatboxVisible((prev) => !prev)}
                className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
            >
                {isChatboxVisible ? "Đóng Chatbox" : "Mở Chatbox"}
            </button>

            {/* Chatbox */}
            {isChatboxVisible && (
                <div className="fixed bottom-16 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-2">Hỗ trợ khách hàng</h2>
                    <div className="h-64 overflow-y-auto border p-2 rounded-lg mb-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-2 ${
                                    msg.sender === "user" ? "text-right text-blue-500" : "text-left text-gray-600"
                                }`}
                            >
                                <p className="bg-gray-100 inline-block px-3 py-1 rounded-lg">{msg.content}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center flex-1 border rounded-lg p-2 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 outline-none"
                            />
                            <button
                                onClick={handleVoiceInput}
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-white rounded-full ${
                                    isListening ? "bg-red-500" : "bg-green-500"
                                }`}
                                style={{ width: "24px", height: "24px", fontSize: "12px" }}
                                title="Nhập giọng nói"
                            >
                                🎙
                            </button>
                        </div>
                        <button
                            onClick={handleSend}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbox;


