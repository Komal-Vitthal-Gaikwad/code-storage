import React, { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaDownload, FaUser} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import "./Dashboard.css";
import { FaTrash } from "react-icons/fa";


export default function RequestedDocuments() {

  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
useEffect(() => {
  const loggedStudent = JSON.parse(localStorage.getItem("student"));

  if (!loggedStudent) {
    navigate("/");
    return;
  }

  const stored = JSON.parse(localStorage.getItem("requests")) || [];

  const requestedOnly = stored.filter(
    (req) =>
      req.studentId === loggedStudent.student_id &&
      (req.type === "Bonafide" ||
        req.type === "Leaving Certificate") &&
      !req.hiddenForStudent
  );

  setRequests(requestedOnly);
}, [navigate]);


const handleDelete = (id) => {
  const confirmDelete = window.confirm("Remove from your list?");
  if (!confirmDelete) return;

  const stored = JSON.parse(localStorage.getItem("requests")) || [];

  const updated = stored.map(r => {
    if (r.id === id) {
      return { ...r, hiddenForStudent: true };
    }
    return r;
  });

  localStorage.setItem("requests", JSON.stringify(updated));

  setRequests(prev => prev.filter(r => r.id !== id));
};


  return (
    <div className="dashboard-container">

      {/* FULL SIDEBAR */}
      <div className="sidebar">
        <img src={logo} alt="logo" />

        <ul className="sidebar-menu">

          <li onClick={() => navigate("/dashboard")} style={{cursor:"pointer"}}>
            <FaHome /> Dashboard
          </li>

          <li onClick={() => navigate("/submitted-documents")} style={{cursor:"pointer"}}>
            <FaFileAlt /> Submitted Document
          </li>

          <li style={{backgroundColor:"rgba(255,255,255,0.2)"}}>
            <FaFileAlt /> Requested Documents
          </li>

          <li onClick={() => navigate("/downloads")}><FaDownload /> Downloaded Documents</li>

          <li onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}><FaUser /> Profile</li>


        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        <div className="header">
          <h1>Requested Documents</h1>
 <div>
    <button
      className="back-btn"
      onClick={() => navigate("/dashboard")}
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

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Division</th>
                <th>Roll No</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

           <tbody>
  {requests.map((req) => (
    <tr
      key={req.id}
      onClick={() =>
        req.status === "Rejected" &&
        navigate(`/resubmit/${req.id}`)
      }
      style={{
        cursor: req.status === "Rejected" ? "pointer" : "default"
      }}
    >
      <td>{req.type}</td>
      <td>{req.studentId}</td>
      <td>{req.name}</td>
      <td>{req.className}</td>
      <td>{req.division}</td>
      <td>{req.rollNo}</td>

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

      {/* Delete Icon */}
      <td
        onClick={(e) => {
          e.stopPropagation(); // prevent row click
          if (req.status === "Approved") {
            handleDelete(req.id);
          }
        }}
        style={{ textAlign: "center" }}
      >
        <FaTrash
          style={{
            color: req.status === "Approved" ? "red" : "#ccc",
            cursor:
              req.status === "Approved"
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
  );
}
