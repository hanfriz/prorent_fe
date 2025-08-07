// import React, { useState } from "react";
// import {
//   Calendar,
//   MapPin,
//   Users,
//   CreditCard,
//   Mail,
//   Building,
//   Bed,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";

// const HotelReservationForm = () => {
//   const [formData, setFormData] = useState({
//     userId: "",
//     propertyId: "",
//     roomTypeId: "",
//     startDate: "",
//     endDate: "",
//     paymentType: "MANUAL_TRANSFER",
//     payerEmail: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const [authToken, setAuthToken] = useState("");

//   const paymentOptions = [
//     { value: "MANUAL_TRANSFER", label: "Manual Bank Transfer", icon: "🏦" },
//     { value: "CREDIT_CARD", label: "Credit Card", icon: "💳" },
//     { value: "E_WALLET", label: "E-Wallet", icon: "📱" },
//     { value: "CASH", label: "Cash Payment", icon: "💵" },
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const formatDateForAPI = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toISOString();
//   };

//   const calculateNights = () => {
//     if (formData.startDate && formData.endDate) {
//       const start = new Date(formData.startDate);
//       const end = new Date(formData.endDate);
//       const diffTime = Math.abs(end - start);
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       return diffDays;
//     }
//     return 0;
//   };

//   const validateForm = () => {
//     if (!authToken.trim()) {
//       setError("Auth token is required");
//       return false;
//     }
//     if (!formData.userId.trim()) {
//       setError("User ID is required");
//       return false;
//     }
//     if (!formData.propertyId.trim()) {
//       setError("Property ID is required");
//       return false;
//     }
//     if (!formData.roomTypeId.trim()) {
//       setError("Room Type ID is required");
//       return false;
//     }
//     if (!formData.startDate) {
//       setError("Check-in date is required");
//       return false;
//     }
//     if (!formData.endDate) {
//       setError("Check-out date is required");
//       return false;
//     }
//     if (new Date(formData.startDate) >= new Date(formData.endDate)) {
//       setError("Check-out date must be after check-in date");
//       return false;
//     }
//     if (!formData.payerEmail.trim()) {
//       setError("Email is required");
//       return false;
//     }
//     if (!/\S+@\S+\.\S+/.test(formData.payerEmail)) {
//       setError("Please enter a valid email address");
//       return false;
//     }
//     return true;
//   };

//   // Custom fetch function to replace axios
//   const makeReservation = async (payload) => {
//     const response = await fetch("{{vercelURL}}/api/reservation/", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(
//         errorData.message || `HTTP error! status: ${response.status}`
//       );
//     }

//     return response.json();
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess(false);

//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       const payload = {
//         ...formData,
//         startDate: formatDateForAPI(formData.startDate),
//         endDate: formatDateForAPI(formData.endDate),
//       };

//       await makeReservation(payload);

//       setSuccess(true);
//       setFormData({
//         userId: "",
//         propertyId: "",
//         roomTypeId: "",
//         startDate: "",
//         endDate: "",
//         paymentType: "MANUAL_TRANSFER",
//         payerEmail: "",
//       });
//     } catch (err: any) {
//       setError(
//         err.message || "Failed to create reservation. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
//           <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Reservation Successful!
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Your booking has been confirmed. You'll receive a confirmation email
//             shortly.
//           </p>
//           <button
//             onClick={() => setSuccess(false)}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Make Another Reservation
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">
//             Hotel Reservation
//           </h1>
//           <p className="text-gray-600">Book your perfect stay with us</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           {/* Form Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
//             <h2 className="text-2xl font-semibold flex items-center gap-2">
//               <Building className="w-6 h-6" />
//               Booking Details
//             </h2>
//           </div>

//           <div className="p-8">
//             {error && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
//                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
//                 <span>{error}</span>
//               </div>
//             )}

//             {/* Auth Token */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Auth Token *
//               </label>
//               <input
//                 type="password"
//                 value={authToken}
//                 onChange={(e) => setAuthToken(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter your authentication token"
//                 required
//               />
//             </div>

//             {/* User & Property Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <Users className="w-4 h-4 inline mr-1" />
//                   User ID *
//                 </label>
//                 <input
//                   type="text"
//                   name="userId"
//                   value={formData.userId}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="e.g. GTrOzXbTNxts"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <Building className="w-4 h-4 inline mr-1" />
//                   Property ID *
//                 </label>
//                 <input
//                   type="text"
//                   name="propertyId"
//                   value={formData.propertyId}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="e.g. 48312158"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Room Type */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <Bed className="w-4 h-4 inline mr-1" />
//                 Room Type ID *
//               </label>
//               <input
//                 type="text"
//                 name="roomTypeId"
//                 value={formData.roomTypeId}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="e.g. 541253415"
//                 required
//               />
//             </div>

//             {/* Dates */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <Calendar className="w-4 h-4 inline mr-1" />
//                   Check-in Date *
//                 </label>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleInputChange}
//                   min={new Date().toISOString().split("T")[0]}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <Calendar className="w-4 h-4 inline mr-1" />
//                   Check-out Date *
//                 </label>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleInputChange}
//                   min={
//                     formData.startDate || new Date().toISOString().split("T")[0]
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Stay Duration */}
//             {calculateNights() > 0 && (
//               <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//                 <p className="text-blue-700 font-medium">
//                   Duration: {calculateNights()} night
//                   {calculateNights() !== 1 ? "s" : ""}
//                 </p>
//               </div>
//             )}

//             {/* Email */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <Mail className="w-4 h-4 inline mr-1" />
//                 Email Address *
//               </label>
//               <input
//                 type="email"
//                 name="payerEmail"
//                 value={formData.payerEmail}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="your.email@example.com"
//                 required
//               />
//             </div>

//             {/* Payment Method */}
//             <div className="mb-8">
//               <label className="block text-sm font-medium text-gray-700 mb-4">
//                 <CreditCard className="w-4 h-4 inline mr-1" />
//                 Payment Method *
//               </label>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {paymentOptions.map((option) => (
//                   <label
//                     key={option.value}
//                     className={`cursor-pointer p-4 border rounded-lg transition-all ${
//                       formData.paymentType === option.value
//                         ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="paymentType"
//                       value={option.value}
//                       checked={formData.paymentType === option.value}
//                       onChange={handleInputChange}
//                       className="sr-only"
//                     />
//                     <div className="flex items-center gap-3">
//                       <span className="text-2xl">{option.icon}</span>
//                       <span className="font-medium text-gray-700">
//                         {option.label}
//                       </span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
//                 loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
//               } text-white`}
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Processing...
//                 </div>
//               ) : (
//                 "Complete Reservation"
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-8 text-gray-600">
//           <p>© 2024 Hotel Booking System. All rights reserved.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HotelReservationForm;
