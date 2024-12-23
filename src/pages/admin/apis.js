// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import AdminHeader from "../components/Header/AdminHeader";
// // import AdminSidebar from "../components/Sidebar/AdminSidebar";

// // const ApiEndpoints = () => {
// //     const [endpoints, setEndpoints] = useState([]);
    
// //     // Fetch danh sách API từ các service
// //     useEffect(() => {
// //         const fetchEndpoints = async () => {
// //             try {
// //                 // Gọi từng service để lấy danh sách API
// //                 const userServiceResponse = await axios.get(`/api/users/endpoints`);
// //                 // const orderServiceResponse = await axios.get("http://localhost:8082/api/order/endpoints");
// //                 // const productServiceResponse = await axios.get("http://localhost:8083/api/product/endpoints");

// //                 // Ghép dữ liệu API của các service
// //                 const allEndpoints = [
// //                     ...userServiceResponse.data,
// //                     // ...orderServiceResponse.data,
// //                     // ...productServiceResponse.data
// //                 ];

// //                 setEndpoints(allEndpoints);
// //             } catch (error) {
// //                 console.error("Lỗi khi lấy danh sách API:", error);
// //             }
// //         };

// //         fetchEndpoints();
// //     }, []);

// //     return (
// //         <div className="bg-gray-100 min-h-screen flex flex-col">
// //             <AdminHeader/>
// //             <div className="flex flex-1">
// //                 <AdminSidebar className="w-1/4 bg-gray-200 p-4"/>
// //                 <main className="flex-1 p-6">
// //                     <div className="container mx-auto p-4">
// //                         <h1 className="text-3xl font-semibold mb-8 text-center">Danh sách API của các Service</h1>
// //                         <table className="w-full border-collapse border border-gray-300">
// //                             <thead>
// //                                 <tr>
// //                                     <th className="border border-gray-300 px-4 py-2">STT</th>
// //                                     <th className="border border-gray-300 px-4 py-2">Dịch vụ</th>
// //                                     <th className="border border-gray-300 px-4 py-2">Đường dẫn API</th>
// //                                     <th className="border border-gray-300 px-4 py-2">Mô Tả</th>
// //                                     <th className="border border-gray-300 px-4 py-2">Hành động</th>
// //                                 </tr>
// //                             </thead>
// //                             <tbody>
// //                                 {endpoints.map((endpoint, index) => (
// //                                     <tr key={index} className="text-center">
// //                                         <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
// //                                         <td className="border border-gray-300 px-4 py-2">{endpoint.service}</td>
// //                                         <td className="border border-gray-300 px-4 py-2">{endpoint.url}</td>
// //                                         <td className="border border-gray-300 px-4 py-2">{endpoint.description}</td>
// //                                         <td className="border border-gray-300 px-4 py-2">
// //                                             <button
// //                                                 onClick={() => navigator.clipboard.writeText(endpoint.url)}
// //                                                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
// //                                             >
// //                                                 Copy URL
// //                                             </button>
// //                                         </td>
// //                                     </tr>
// //                                 ))}
// //                             </tbody>
// //                         </table>
// //                     </div>
// //                 </main>
// //             </div>
            
// //         </div>
        
// //     );
// // };

// // export default ApiEndpoints;



// // import React from 'react';

// // // Dữ liệu phương thức API
// // const apiMethods = [
// //   { method: 'GET', url: '/api/reservations/{id}', bgColor: 'bg-blue-100', buttonColor: 'bg-blue-500', borderColor: 'border-blue-500' },
// //   { method: 'PUT', url: '/api/reservations/{id}', bgColor: 'bg-orange-100', buttonColor: 'bg-orange-500', borderColor: 'border-orange-500' },
// //   { method: 'DELETE', url: '/api/reservations/{id}', bgColor: 'bg-red-100', buttonColor: 'bg-red-500', borderColor: 'border-red-500' },
// //   { method: 'PATCH', url: '/api/reservations/{id}', bgColor: 'bg-green-100', buttonColor: 'bg-green-500', borderColor: 'border-green-500' }
// // ];

// // const ApiMethods = () => {
// //   return (

// //     <div className="space-y-4">
// //       {/* Duyệt qua danh sách phương thức API */}
// //       {apiMethods.map((api, index) => (
// //         <div key={index} className={`flex items-center p-4 rounded-md ${api.bgColor} border-2 ${api.borderColor}`}>
// //           {/* Button với màu sắc riêng cho mỗi phương thức */}
// //           <button className={`px-4 py-2 rounded-md ${api.buttonColor} text-white`}>
// //             {api.method}
// //           </button>

// //           {/* URL nằm sát với button */}
// //           <span className="ml-4">{api.url}</span>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default ApiMethods;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import AdminHeader from '../../components/Header/AdminHeader';
// import AdminSidebar from '../../components/Sidebar/AdminSidebar';

// const ApiMethods = () => {
//   const [apiMethods, setApiMethods] = useState([]);
//   const [filteredApiMethods, setFilteredApiMethods] = useState([]);
//   const [selectedService, setSelectedService] = useState(''); // Lưu trạng thái service được chọn

//   // Fetch danh sách API từ các service
//   useEffect(() => {
//     const fetchEndpoints = async () => {
//       try {
//         // Gọi từng service để lấy danh sách API
//         const userServiceResponse = await axios.get(`/api/users/endpoints`);
//         const tableServiceResponse = await axios.get(`/api/tables/endpoints`);
//         const bookingServiceResponse = await axios.get(`/api/bookings/endpoints`);
//         const invoiceServiceResponse = await axios.get(`/api/invoices/endpoints`);
//         const menuServiceResponse = await axios.get(`/api/menus/endpoints`);
//         const orderServiceResponse = await axios.get(`/api/orders/endpoints`);
//         const notificationServiceResponse = await axios.get(`/api/notifications/endpoints`);
        

//         // Ghép dữ liệu API của các service
//         const allEndpoints = [
//           ...userServiceResponse.data,
//           ...tableServiceResponse.data,
//           ...bookingServiceResponse.data,
//           ...invoiceServiceResponse.data,
//           ...menuServiceResponse.data,
//           ...orderServiceResponse.data,
//           ...notificationServiceResponse.data
          
//         ];

//         setApiMethods(allEndpoints);
//         setFilteredApiMethods(allEndpoints); // Mặc định là hiển thị tất cả các phương thức API
//       } catch (error) {
//         console.error("Lỗi khi lấy danh sách API:", error);
//       }
//     };

//     fetchEndpoints();
//   }, []);

//   // Hàm xử lý bộ lọc theo service
//   const handleServiceFilter = (service) => {
//     setSelectedService(service);
//     if (service) {
//       setFilteredApiMethods(apiMethods.filter((api) => api.service === service));
//     } else {
//       setFilteredApiMethods(apiMethods); // Nếu không chọn filter, hiển thị tất cả
//     }
//   };

//     const handleRefresh = () => {
//         window.location.reload(); // Tải lại trang
//     };

//   // Tạo danh sách các service để người dùng chọn
//   const services = Array.from(new Set(apiMethods.map((api) => api.service))); 

//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col">
//          <AdminHeader/>

//          <div className="flex flex-1">
//             <AdminSidebar className="w-1/4 bg-gray-200 p-4" />

//             <main className="flex-1 p-6">

//                 <div className='mb-4'>
//                     <button onClick={handleRefresh} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
//                         Làm Mới
//                     </button>
//                 </div>
                    
//                 <div className="space-y-4">
//                     {/* Bộ lọc service */}
//                     <div className="mb-4">
//                         <label htmlFor="serviceFilter" className="mr-2">Chọn Service:</label>
//                         <select 
//                         id="serviceFilter" 
//                         value={selectedService} 
//                         onChange={(e) => handleServiceFilter(e.target.value)} 
//                         className="px-4 py-2 border rounded-md"
//                         >
//                         <option value="">Tất cả</option>
//                         {services.map((service, index) => (
//                             <option key={index} value={service}>{service}</option>
//                         ))}
//                         </select>
//                     </div>

//                     {/* Duyệt qua danh sách phương thức API đã lọc */}
//                     {filteredApiMethods.map((api, index) => (
//                         <div 
//                         key={index} 
//                         className={`flex items-center p-2 rounded-md border-2 ${getBorderColor(api.method)} ${getBackgroundColor(api.method)}`}
//                         >
//                         {/* Button với màu sắc riêng cho mỗi phương thức */}
//                         <button className={`px-4 py-2 rounded-md ${getButtonColor(api.method)} text-white`}>
//                             {api.method}
//                         </button>

//                         {/* URL nằm sát với button */}
//                         <span className="ml-4">{api.url}</span>
//                         </div>
//                     ))}
//                 </div>
//             </main>
            
//          </div>
        
//     </div>
    
//   );
// };

// // Hàm trả về màu nền dựa trên phương thức HTTP
// const getBackgroundColor = (method) => {
//   switch (method) {
//     case 'GET': return 'bg-blue-100';
//     case 'POST': return 'bg-green-100';
//     case 'PUT': return 'bg-purple-100';
//     case 'DELETE': return 'bg-red-100';
//     case 'PATCH': return 'bg-yellow-100';
//     default: return 'bg-gray-100';
//   }
// };

// // Hàm trả về màu button dựa trên phương thức HTTP
// const getButtonColor = (method) => {
//   switch (method) {
//     case 'GET': return 'bg-blue-500';
//     case 'POST': return 'bg-green-500';
//     case 'PUT': return 'bg-purple-500';
//     case 'DELETE': return 'bg-red-500';
//     case 'PATCH': return 'bg-yellow-500';
//     default: return 'bg-gray-500';
//   }
// };

// // Hàm trả về màu border dựa trên phương thức HTTP
// const getBorderColor = (method) => {
//   switch (method) {
//     case 'GET': return 'border-blue-500';
//     case 'POST': return 'border-green-500';
//     case 'PUT': return 'border-purple-500';
//     case 'DELETE': return 'border-red-500';
//     case 'PATCH': return 'border-yellow-500';
//     default: return 'border-gray-500';
//   }
// };

// export default ApiMethods;







