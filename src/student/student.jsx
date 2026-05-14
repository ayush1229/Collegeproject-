import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Student() {
  const navigate = useNavigate();

  // Dummy data representing the logged-in student
  const [studentData] = useState({
    name: "Ayush Bhatt",
    rollNo: "22BXX001",
    photoUrl: "https://ui-avatars.com/api/?name=Ayush+Bhatt&background=f5f5f5&color=5b0e0e&size=150",
    roomNo: "B-214",
    roomType: "Double Occupancy",
    fatherName: "Mr. Ramesh Bhatt",
    mobileNumber: "+91 9876543210",
    parentNumber: "+91 9123456780",
    category: "General",
    bloodGroup: "O+",
    state: "Himachal Pradesh",
    address: "123, Pine Grove, Shimla, Himachal Pradesh - 171001",
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleOutpass = () => {
    // navigate("/outpass");
    alert("Redirecting to Outpass Portal");
  };

  const handleComplaint = () => {
    // navigate("/complaint");
    alert("Redirecting to Complaint Portal");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      
      {/* Full-Width Maroon Navbar */}
      <nav className="w-full bg-[#5b0e0e] text-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">
          Hostel Management
        </h1>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={handleComplaint}
            className="hover:bg-[#741616] text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Complaint
          </button>
          
          <button
            onClick={handleOutpass}
            className="hover:bg-[#741616] text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Outpass
          </button>

          {/* Logout button styled distinctly to stand out */}
          <button
            onClick={handleLogout}
            className="bg-white text-[#5b0e0e] hover:bg-gray-100 px-5 py-2 rounded-md font-semibold shadow-sm transition-colors duration-200 ml-2"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex justify-center py-10 px-4">
        
        {/* Profile Card */}
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
          
          {/* Banner Section */}
          <div className="bg-gray-100 border-b border-gray-200 h-32 relative"></div>

          {/* Profile Info Header */}
          <div className="px-8 pb-8 relative">
            {/* Photograph */}
            <div className="absolute -top-16 border-4 border-white rounded-full bg-white shadow-md">
              <img
                src={studentData.photoUrl}
                alt="Student Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>

            {/* Name & Roll No */}
            <div className="ml-40 pt-4">
              <h2 className="text-3xl font-bold text-gray-800">
                {studentData.name}
              </h2>
              <p className="text-[#5b0e0e] font-medium text-lg mt-1">
                Roll No: {studentData.rollNo}
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Details Grid Section */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-[#5b0e0e] mb-6 border-b-2 border-[#5b0e0e] inline-block pb-1">
              Student Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
              {/* Room Info */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">Room No</span>
                <span className="text-gray-800 font-semibold">{studentData.roomNo}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">Type of Room</span>
                <span className="text-gray-800 font-semibold">{studentData.roomType}</span>
              </div>

              {/* Personal Info */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">Father's Name</span>
                <span className="text-gray-800 font-semibold">{studentData.fatherName}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">Mobile Number</span>
                <span className="text-gray-800 font-semibold">{studentData.mobileNumber}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">Parent's Number</span>
                <span className="text-gray-800 font-semibold">{studentData.parentNumber}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">Blood Group</span>
                <span className="text-gray-800 font-semibold">{studentData.bloodGroup}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">Category</span>
                <span className="text-gray-800 font-semibold">{studentData.category}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">State</span>
                <span className="text-gray-800 font-semibold">{studentData.state}</span>
              </div>

              {/* Address */}
              <div className="flex flex-col md:col-span-2 lg:col-span-3 mt-2">
                <span className="text-sm text-gray-500 font-medium">Permanent Address</span>
                <span className="text-gray-800 font-semibold bg-gray-50 p-3 rounded-md border border-gray-100 mt-1">
                  {studentData.address}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;