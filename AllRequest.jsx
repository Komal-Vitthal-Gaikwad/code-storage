import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaFileAlt, FaUsers, FaUser } from "react-icons/fa";
import logo from "./assets/logo.jpeg";
import "./AdminDash.css";
import { FaTrash } from "react-icons/fa";

export default function AllRequests() {

  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("requests")) || [];
setRequests(stored.filter(r => !r.hiddenForAdmin));
  }, []);
 const handleDelete = (id) => {
  const confirmDelete = window.confirm("Are you sure?");
  if (!confirmDelete) return;

  const stored = JSON.parse(localStorage.getItem("requests")) || [];

  const updated = stored.map(r => {
    if (r.id === id) {
      return { ...r, hiddenForAdmin: true };
    }
    return r;
  });

  localStorage.setItem("requests", JSON.stringify(updated));
  setRequests(updated.filter(r => !r.hiddenForAdmin));
};




  return (
    <div className="dashboard-container">

      {/* ✅ FULL SIDEBAR (same structure) */}
      <div className="sidebar">
        <img src={logo} alt="image" />
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

      {/* Main */}
      <div className="admin-main">
        <div className="admin-content-wrapper">

          {/* ✅ Header with Back + Logout */}
          <div className="admin-header">
            <div>
              <h1>All Requests</h1>
            </div>

            <div>
              <button
                className="back-btn"
                onClick={() => navigate("/admin")}
              >
                Back
              </button>

              <button
                className="logout-btn"
                onClick={() => navigate("/")}
                style={{ marginLeft: "10px" }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
  <tr>
    <th>Document</th>
    <th>Student ID</th>
    <th>Date</th>
    <th>Status</th>
    <th>Action</th>
  </tr>
</thead>


                          <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => navigate(`/request/${req.id}`)}   // ✅ FIXED
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

                    <td
                      onClick={(e) => {
                        e.stopPropagation();

                        if (req.status === "Approved" || req.status === "Rejected") {
                          handleDelete(req.id);   // ✅ pass id not index
                        }
                      }}
                      style={{ textAlign: "center" }}
                    >
                      <FaTrash
                        style={{
                          color:
                            req.status === "Approved" || req.status === "Rejected"
                              ? "red"
                              : "#ccc",
                          cursor:
                            req.status === "Approved" || req.status === "Rejected"
                              ? "pointer"
                              : "not-allowed",
                        }}
                      />
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
