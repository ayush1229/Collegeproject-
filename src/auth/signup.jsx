import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const getRedirectPath = (role) => {
    switch (role) {
      case "admin":
        return "/admin";
      case "warden":
        return "/guard";
      case "guard":
        return "/guard";
      case "chief-warden":
        return "/warden";
      case "attendant":
        return "/admin";
      case "student":
      default:
        return "/student";
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    hostel: "",
    room: "",
    department: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const isStudent = formData.role === "student";
  const showHostelField =
    formData.role === "student" || formData.role === "attendant";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (isStudent) {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.phone ||
        !formData.hostel ||
        !formData.room ||
        !formData.department
      ) {
        setError("Please fill all fields");
        return;
      }

      if (!formData.email.endsWith("@nith.ac.in")) {
        setError("Use your college email");
        return;
      }
    } else {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please fill all fields");
        return;
      }

      if (showHostelField && !formData.hostel) {
        setError("Please select a hostel");
        return;
      }

      if (!formData.email.endsWith("@nith.ac.in")) {
        setError("Use your college email");
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      let payload;

      if (formData.role === "student") {
        payload = {
          role: "student",
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          hostel: formData.hostel,
          room: formData.room,
          department: formData.department,
        };
      } else if (formData.role === "attendant") {
        payload = {
          role: "attendant",
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          hostel: formData.hostel,
        };
      } else {
        payload = {
          role: "guard",
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        };
      }

      const response = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // This automatically grabs the "User already exists" message from the backend
        setError(data.message || "Signup failed");
        return;
      }

      const savedUser = {
        ...(data.user || {}),
        role: payload.role,
        token: data.token,
      };

      localStorage.setItem("token", data.token || "");
      localStorage.setItem("user", JSON.stringify(savedUser));

      setError("");
      alert("Account Created Successfully!");
      navigate(getRedirectPath(savedUser.role));
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Could not connect to server");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f5f5f5]">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-[#5b0e0e] text-white items-center justify-center p-16">
        <div>
          <h1 className="text-5xl font-bold mb-5">Create Account</h1>

          <p className="text-lg text-gray-200 leading-8">
            Register to access hostel services, outpass requests and complaint
            management.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">
        <form
          onSubmit={handleSignup}
          className="bg-white w-full max-w-md rounded-xl shadow-sm border border-gray-200 p-10 max-h-[100vh] overflow-y-auto"
        >
          <h2 className="text-3xl font-semibold text-[#5b0e0e] mb-8 text-center">
            Signup
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {isStudent ? (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md mb-4 outline-none focus:border-[#5b0e0e]"
              />

              <input
                type="email"
                name="email"
                placeholder="College Email (name@nith.ac.in)"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md mb-4 outline-none focus:border-[#5b0e0e]"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (10 digits)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md mb-4 outline-none focus:border-[#5b0e0e]"
              />

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md mb-4 outline-none focus:border-[#5b0e0e]"
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science & Engineering</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
                <option value="EE">Electrical Engineering</option>
                <option value="Arch">Architecture</option>
              </select>

              <select
                name="hostel"
                value={formData.hostel}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md mb-4 outline-none focus:border-[#5b0e0e]"
              >
                <option value="">Select Hostel</option>
                <option value="Hostel A">Hostel A</option>
                <option value="Hostel B">Hostel B</option>
                <option value="Hostel C">Hostel C</option>
                <option value="Hostel D">Hostel D</option>
                <option value="Hostel E">Hostel E</option>
              </select>

              <input
                type="text"
                name="room"
                placeholder="Room Number"
                value={formData.room}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md mb-4 outline-none focus:border-[#5b0e0e]"
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md mb-4 outline-none focus:border-[#5b0e0e]"
              />

              <input
                type="email"
                name="email"
                placeholder="College Mail"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md mb-4 outline-none focus:border-[#5b0e0e]"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (10 digits)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-md mb-4 outline-none focus:border-[#5b0e0e]"
              />

              {showHostelField && (
                <select
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-md mb-4 outline-none focus:border-[#5b0e0e]"
                >
                  <option value="">Select Hostel</option>
                  <option value="Hostel A">Hostel A</option>
                  <option value="Hostel B">Hostel B</option>
                  <option value="Hostel C">Hostel C</option>
                  <option value="Hostel D">Hostel D</option>
                  <option value="Hostel E">Hostel E</option>
                </select>
              )}
            </>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md mb-4 outline-none focus:border-[#5b0e0e]"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md mb-5 outline-none focus:border-[#5b0e0e]"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md mb-6 outline-none focus:border-[#5b0e0e]"
          >
            <option value="student">Student</option>
            <option value="attendant">Attendant</option>
            <option value="guard">Security Guard</option>
          </select>

          <button
            type="submit"
            className="w-full bg-[#5b0e0e] hover:bg-[#741616] transition text-white py-3 rounded-md"
          >
            Create Account
          </button>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-[#5b0e0e] font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;