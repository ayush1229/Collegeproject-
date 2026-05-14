import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
// import ComplaintForm from './ComplaintForm'; // Assuming you have this component

function Complaint() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: 'Water issue in room',
      description: 'No hot water in the bathroom',
      date: '2024-05-10',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Electricity problem',
      description: 'Light bulb not working',
      date: '2024-05-08',
      status: 'resolved',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Dirty corridor',
      description: 'Corridor needs cleaning',
      date: '2024-05-12',
      status: 'pending',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Wifi not working',
      description: 'Internet connection is down',
      date: '2024-05-05',
      status: 'resolved',
      priority: 'high'
    }
  ]);

  const pendingComplaints = complaints.filter(c => c.status === 'pending');
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved');
  const displayComplaints = activeTab === 'pending' ? pendingComplaints : resolvedComplaints;

  const handleAddComplaint = (newComplaint) => {
    setComplaints([...complaints, newComplaint]);
    setShowComplaintForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Helper functions for Tailwind badge colors
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
            onClick={() => navigate("/outpass")}
            className="hover:bg-[#741616] text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Outpass
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
              Pending Complaints
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'pending' ? 'bg-[#5b0e0e] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {pendingComplaints.length}
              </span>
            </button>
            
            <button 
              className={`py-4 text-sm font-semibold border-b-4 transition-colors duration-200 flex items-center gap-2 ${
                activeTab === 'resolved' 
                  ? 'border-[#5b0e0e] text-[#5b0e0e]' 
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('resolved')}
            >
              Resolved Complaints
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'resolved' ? 'bg-[#5b0e0e] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {resolvedComplaints.length}
              </span>
            </button>
          </div>

          {/* Raise Complaint Action Button */}
          <button 
            className="bg-[#5b0e0e] hover:bg-[#741616] text-white px-5 py-2 rounded-md font-medium text-sm transition shadow-sm"
            onClick={() => setShowComplaintForm(!showComplaintForm)}
          >
            + Raise Complaint
          </button>
        </div>
      </div>

      {/* Modal PlaceHolder (Uncomment when you add ComplaintForm component back) */}
      {/* {showComplaintForm && (
        <ComplaintForm 
          onClose={() => setShowComplaintForm(false)}
          onSubmit={handleAddComplaint}
        />
      )} */}

      {/* 3. Main Content Area (Column Layout) */}
      <div className="flex-1 w-full max-w-4xl mx-auto py-8 px-4 flex flex-col space-y-4">
        
        {displayComplaints.length > 0 ? (
          displayComplaints.map(complaint => (
            <div 
              key={complaint.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{complaint.title}</h3>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(complaint.status)}`}>
                  {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{complaint.description}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-md border ${getPriorityStyle(complaint.priority)}`}>
                    {complaint.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    Date: {complaint.date}
                  </span>
                </div>
                
                <button className="text-[#5b0e0e] font-semibold text-sm hover:underline">
                  View Details &rarr;
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No {activeTab} complaints</h3>
            <p className="text-gray-500">Everything looks good! There are no complaints in this section at the moment.</p>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default Complaint;