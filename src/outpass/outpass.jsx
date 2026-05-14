import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Outpass() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [showApplyForm, setShowApplyForm] = useState(false);
  
  // Dummy data for outpass requests
  const [outpasses, setOutpasses] = useState([
    {
      id: 1,
      destination: 'Shimla, Himachal Pradesh',
      reason: 'Attending cousin\'s wedding',
      departureDate: '2024-05-20, 10:00 AM',
      returnDate: '2024-05-25, 05:00 PM',
      appliedOn: '2024-05-12',
      status: 'pending'
    },
    {
      id: 2,
      destination: 'Home (Chandigarh)',
      reason: 'Diwali Break',
      departureDate: '2023-11-10, 08:00 AM',
      returnDate: '2023-11-16, 08:00 PM',
      appliedOn: '2023-11-01',
      status: 'approved'
    },
    {
      id: 3,
      destination: 'Local Market',
      reason: 'Purchasing project supplies',
      departureDate: '2024-04-15, 02:00 PM',
      returnDate: '2024-04-15, 08:00 PM',
      appliedOn: '2024-04-14',
      status: 'approved'
    }
  ]);

  const pendingRequests = outpasses.filter(o => o.status === 'pending');
  const approvedRequests = outpasses.filter(o => o.status === 'approved');
  const displayRequests = activeTab === 'pending' ? pendingRequests : approvedRequests;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Helper functions for Tailwind badge colors
  const getStatusStyle = (status) => {
    return status === 'pending' 
      ? 'bg-orange-100 text-orange-800 border-orange-200' 
      : 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      
      {/* 1. Primary Maroon Navbar */}
      <nav className="w-full bg-[#5b0e0e] text-white shadow-md px-6 py-4 flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold tracking-wide">
          Hostel Management
        </h1>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={() => navigate("/student")}
            className="hover:bg-[#741616] text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Dashboard
          </button>
          
          <button
            onClick={() => navigate("/complaint")}
            className="hover:bg-[#741616] text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Complaint
          </button>

          <button
            onClick={handleLogout}
            className="bg-white text-[#5b0e0e] hover:bg-gray-100 px-5 py-2 rounded-md font-semibold shadow-sm transition-colors duration-200 ml-2"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 2. Secondary Sub-Navbar (Joined to Primary Nav) */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-0">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          
          {/* Tabs */}
          <div className="flex space-x-8">
            <button 
              className={`py-4 text-sm font-semibold border-b-4 transition-colors duration-200 flex items-center gap-2 ${
                activeTab === 'pending' 
                  ? 'border-[#5b0e0e] text-[#5b0e0e]' 
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Requests
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'pending' ? 'bg-[#5b0e0e] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {pendingRequests.length}
              </span>
            </button>
            
            <button 
              className={`py-4 text-sm font-semibold border-b-4 transition-colors duration-200 flex items-center gap-2 ${
                activeTab === 'approved' 
                  ? 'border-[#5b0e0e] text-[#5b0e0e]' 
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('approved')}
            >
              Approved Requests
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'approved' ? 'bg-[#5b0e0e] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {approvedRequests.length}
              </span>
            </button>
          </div>

          {/* Apply Action Button */}
          <button 
            className="bg-[#5b0e0e] hover:bg-[#741616] text-white px-5 py-2 rounded-md font-medium text-sm transition shadow-sm"
            onClick={() => setShowApplyForm(!showApplyForm)}
          >
            + Apply for Outpass
          </button>
        </div>
      </div>

      {/* Modal PlaceHolder for Application Form */}
      {/* {showApplyForm && (
        <OutpassForm 
          onClose={() => setShowApplyForm(false)}
          onSubmit={handleApplyOutpass}
        />
      )} */}

      {/* 3. Main Content Area (Column Layout) */}
      <div className="flex-1 w-full max-w-4xl mx-auto py-8 px-4 flex flex-col space-y-4">
        
        {displayRequests.length > 0 ? (
          displayRequests.map(request => (
            <div 
              key={request.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{request.destination}</h3>
                  <p className="text-gray-600 mt-1">{request.reason}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              
              {/* Dates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Departure</span>
                  <span className="text-gray-800 font-medium">{request.departureDate}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Return</span>
                  <span className="text-gray-800 font-medium">{request.returnDate}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500 font-medium">
                  Applied on: {request.appliedOn}
                </span>
                
                <button className="text-[#5b0e0e] font-semibold text-sm hover:underline">
                  View Pass &rarr;
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No {activeTab} requests</h3>
            <p className="text-gray-500">You don't have any {activeTab} outpass requests at the moment.</p>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default Outpass;