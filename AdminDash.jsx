import React, { useState, useMemo, useEffect } from "react";
import { FaHome, FaFileAlt, FaUsers, FaUser} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import "./AdminDash.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL");
  const [requests, setRequests] = useState([]);

  // Fetch from localStorage
 useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("requests")) || [];
setRequests(stored.filter(r => !r.hiddenForAdmin));
  }, []);

  // Filter logic
  const filteredRequests = useMemo(() => {
    if (filter === "ALL") return requests;
    return requests.filter((req) => req.status === filter);
  }, [filter, requests]);

  // Counts
  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const approvedCount = requests.filter(r => r.status === "Approved").length;
  const rejectedCount = requests.filter(r => r.status === "Rejected").length;

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <img src={logo} alt="image" />
        <ul className="sidebar-menu">
          <li><FaHome /> Dashboard</li>

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

      {/* Main */}
      <div className="admin-main">
        <div className="admin-content-wrapper">

          {/* Header */}
          <div className="admin-header">
            <div>
              <h1>Hello, Admin</h1>
              <p>College Documents Automation Portal</p>
            </div>

            <button 
              className="logout-btn" 
              onClick={() => navigate("/")}
            >
              Logout
            </button>
          </div>

          {/* Stats Section */}
          <div className="stats-grid">

            <div 
              className="stat-card pending-card" 
              onClick={() => setFilter("Pending")}
            >
              <h3>Pending Requests</h3>
              <h2>{pendingCount}</h2>
            </div>

            <div 
              className="stat-card approved-card" 
              onClick={() => setFilter("Approved")}
            >
              <h3>Approved</h3>
              <h2>{approvedCount}</h2>
            </div>

            <div 
              className="stat-card rejected-card" 
              onClick={() => setFilter("Rejected")}
            >
              <h3>Rejected</h3>
              <h2>{rejectedCount}</h2>
            </div>

            <div 
              className="stat-card total-card" 
              onClick={() => setFilter("ALL")}
            >
              <h3>Total Requests</h3>
              <h2>{requests.length}</h2>
            </div>

          </div>

          {/* Recent Requests Table */}
          <div className="table-wrapper">
            <h2>Recent Requests</h2>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Student ID</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
  {filteredRequests.map((req, index) => (
    <tr
      key={req.id}
      onClick={() => {
  navigate(`/request/${req.id}`);
}}

      style={{ cursor: "pointer" }}
    >
      <td>{req.type}</td>
      <td>{req.studentId}</td>
      <td>{req.date}</td>
      <td
        className={
          req.status === "Pending"
            ? "status-pending"
            : req.status === "Approved"
            ? "status-approved"
            : "status-rejected"
        }
      >
        {req.status}
      </td>
    </tr>
  ))}
</tbody>


            </table>
          </div>

        </div>
      </div>

    </div>
  );
}
