import React, { useState } from "react";
import "./LoginPage.css";
import { FaKey, FaUser } from "react-icons/fa";
import logo from "./assets/logo.jpeg";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        admin_id: adminId.trim(),
        password: password.trim()
      })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("admin_id", data.admin_id);
      navigate("/admin");
    } else {
      setError(data.message || "Invalid credentials");
    }

  } catch (err) {
    console.error(err);
    setError("Server not responding");
  }
};



  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <img src={logo} alt="image" />

        <ul>
          <li>
            <FaKey />
            <Link 
              to="/" 
              style={{ textDecoration: "none", color: "inherit", marginLeft: "8px" }}
            >
              Student Login
            </Link>
          </li>

          <li>
            <FaUser />
            <Link 
              to="/admin-login" 
              style={{ textDecoration: "none", color: "inherit", marginLeft: "8px" }}
            >
              Admin Login
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Section */}
      <div className="main">
        <div className="login-box">
          <h1>Admin Login</h1>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Admin ID</label>
              <input
                type="text"
                placeholder="Enter Admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
