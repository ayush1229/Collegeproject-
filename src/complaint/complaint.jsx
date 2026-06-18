import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Complaint() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('unresolved'); // 'unresolved' | 'resolved'
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Track which items the user has upvoted in this session to prevent spamming
  const [upvotedItems, setUpvotedItems] = useState([]);

  // --- Fetch Student's Complaints ---
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        let token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (token && token.startsWith('"') && token.endsWith('"')) {
          token = token.slice(1, -1);
        }

        if (!token || !userStr) {
          navigate("/");
          return;
        }

        const user = JSON.parse(userStr);

        const response = await fetch('http://localhost:5000/complaint/my-complaints', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'role': user.role || 'student'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch complaints');

        const data = await response.json();
        setComplaints(data.complaints);
      } catch (err) {
        console.error(err);
        setError('Could not load complaints.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate]);

  // --- Handle Upvote ---
  const handleUpvote = async (complaintId) => {
    let token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token && token.startsWith('"') && token.endsWith('"')) token = token.slice(1, -1);
    const user = userStr ? JSON.parse(userStr) : {};

    try {
      // Optimistically update the UI so it feels instant
      setUpvotedItems(prev => [...prev, complaintId]);
      setComplaints(complaints.map(c => 
        c.id === complaintId ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c
      ));

      const response = await fetch('http://localhost:5000/complaint/upvote', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'role': user.role || 'student'
        },
        body: JSON.stringify({ complaint_id: complaintId })
      });

      if (!response.ok) {
        throw new Error('Failed to upvote');
      }
    } catch (err) {
      console.error(err);
      // Revert the optimistic update if the API call fails
      setUpvotedItems(prev => prev.filter(id => id !== complaintId));
      setComplaints(complaints.map(c => 
        c.id === complaintId ? { ...c, upvotes: (c.upvotes || 1) - 1 } : c
      ));
      alert("Failed to register upvote. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Filter complaints based on status
  const unresolvedComplaints = complaints.filter(c => c.status === 'pending');
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved');
  const displayComplaints = activeTab === 'unresolved' ? unresolvedComplaints : resolvedComplaints;

  const getStatusStyle = (status) => {
    return status === 'pending' 
      ? 'bg-orange-100 text-orange-800 border-orange-200' 
      : 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  if (loading) {
    return <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center font-bold text-[#5b0e0e]">Loading Complaints...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      
      {/* 1. Primary Maroon Navbar */}
      <nav className="w-full bg-[#5b0e0e] text-white shadow-md px-6 py-4 flex justify-between items-center z-10 sticky top-0">
         <div className="flex items-center gap-3 justify-center ">
  <img
    src="l.png"
    alt="nithlogo"
    width={60}
    height={60}
    className="object-contain"
  />

  <h1 className="text-2xl font-bold">
    Hostel Management
  </h1>
</div>
        
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

      {/* 2. Secondary Sub-Navbar (Tabs) */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-[72px] z-0">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          
          {/* Tabs */}
          <div className="flex space-x-8">
            <button 
              className={`py-4 text-sm font-bold border-b-4 transition-colors duration-200 flex items-center gap-2 ${
                activeTab === 'unresolved' 
                  ? 'border-[#5b0e0e] text-[#5b0e0e]' 
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('unresolved')}
            >
              Unresolved
              {unresolvedComplaints.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'unresolved' ? 'bg-[#5b0e0e] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {unresolvedComplaints.length}
                </span>
              )}
            </button>
            
            <button 
              className={`py-4 text-sm font-bold border-b-4 transition-colors duration-200 flex items-center gap-2 ${
                activeTab === 'resolved' 
                  ? 'border-[#5b0e0e] text-[#5b0e0e]' 
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('resolved')}
            >
              Resolved
              {resolvedComplaints.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'resolved' ? 'bg-[#5b0e0e] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {resolvedComplaints.length}
                </span>
              )}
            </button>
          </div>

          {/* Raise Complaint Action Button */}
          <button 
            className="bg-[#5b0e0e] hover:bg-[#741616] text-white px-5 py-2 rounded-md font-bold text-sm transition shadow-sm"
            onClick={() => navigate("/complaint-form")}
          >
            + Raise Complaint
          </button>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="flex-1 w-full max-w-4xl mx-auto py-8 px-4 flex flex-col space-y-4">
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-semibold mb-4 border border-red-200">
            {error}
          </div>
        )}

        {displayComplaints.length > 0 ? (
          displayComplaints.map(complaint => (
            <div 
              key={complaint.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{complaint.title || 'Untitled Complaint'}</h3>
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded border ${getStatusStyle(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{complaint.description}</p>
              
              {/* Show Resolution Details if Resolved */}
              {complaint.status === 'resolved' && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-bold text-emerald-800 mb-1">Resolution Update:</h4>
                  <p className="text-sm text-emerald-700">
                    {complaint.resolved_description || "This issue has been marked as resolved by the administration."}
                  </p>
                  {complaint.resolved_at && (
                    <span className="text-xs font-medium text-emerald-600/70 block mt-2">
                      Resolved on: {new Date(complaint.resolved_at).toLocaleString()}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded border border-gray-100">
                    Filed on: {new Date(complaint.date_created).toLocaleDateString()}
                  </span>
                </div>

                {/* UPVOTE BUTTON - Only shows for Pending complaints */}
                {complaint.status === 'pending' && (
                  <button 
                    onClick={() => handleUpvote(complaint.id)}
                    disabled={upvotedItems.includes(complaint.id)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg border transition-colors text-sm font-bold ${
                      upvotedItems.includes(complaint.id)
                        ? 'bg-orange-100 text-orange-800 border-orange-200 cursor-not-allowed opacity-80'
                        : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50 active:bg-orange-100'
                    }`}
                  >
                    <span>👍</span> 
                    {upvotedItems.includes(complaint.id) ? 'Upvoted' : 'Upvote'} ({complaint.upvotes || 0})
                  </button>
                )}

              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="text-5xl mb-4">{activeTab === 'unresolved' ? '🛠️' : '✅'}</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No {activeTab} complaints</h3>
            <p className="text-gray-500">
              {activeTab === 'unresolved' 
                ? "Everything looks good! You don't have any pending issues." 
                : "You don't have any resolved complaints yet."}
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default Complaint;