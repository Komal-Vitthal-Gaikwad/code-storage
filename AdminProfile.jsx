import React, { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaUsers, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import "./Dashboard.css";

export default function AdminProfile() {

  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {

    const adminId = localStorage.getItem("admin_id");

    if (!adminId) {
      navigate("/");
      return;
    }

    const fetchAdmin = async () => {
      try {
       const res = await fetch(
  `http://localhost:5000/admin/${adminId}`
);

        if (!res.ok) {
          navigate("/");
          return;
        }

        const data = await res.json();
        setAdmin(data);

      } catch (error) {
        console.error("Error fetching admin:", error);
        navigate("/");
      }
    };

    fetchAdmin();

  }, [navigate]);

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <img src={logo} alt="logo" />

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/admin")} 
            style={{ cursor: "pointer" }}> <FaHome /> Dashboard</li>

          <li 
            onClick={() => navigate("/all-requests")} 
            style={{ cursor: "pointer" }}
          >
            <FaFileAlt /> All Requests
          </li>

          <li 
            onClick={() => navigate("/students")} 
            style={{ cursor: "pointer" }}
          >
            <FaUsers /> Students
          </li>

          <li onClick={() => navigate("/adminprofile")} 
            style={{ cursor: "pointer" }}><FaUser /> Profile</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {admin && (
          <div className="profile-wrapper">

            {/* Profile Card */}
            <div className="profile-card-modern">
              <div className="profile-avatar-modern">
                {admin.name?.charAt(0)}
              </div>

              <h2>{admin.name}</h2>

              <div className="profile-divider"></div>

              <div className="profile-details-modern">
                <p><strong>Admin ID:</strong> {admin.admin_id}</p>
                <p><strong>Contact:</strong> {admin.contact}</p>
              </div>
            </div>

            {/* Professional Details Card */}
            <div className="profile-card-modern extra-details-card">
              <div className="details-header">
                <h3>Professional Details</h3>
              </div>

              <div className="profile-divider"></div>

              <div className="profile-details-modern">
                <p><strong>Email:</strong> {admin.email}</p>
                <p><strong>Address:</strong> {admin.address}</p>
                <p><strong>Role:</strong> Document Administrator</p>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
