import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaFileAlt, FaDownload, FaUser, FaTrash } from "react-icons/fa";
import logo from "./assets/logo.jpeg";
import "./Dashboard.css";   // use same student dashboard css

export default function SubmittedDocuments() {

  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

useEffect(() => {
  const loggedStudent = JSON.parse(localStorage.getItem("student"));

  if (!loggedStudent) {
    navigate("/");
    return;
  }

  const stored = JSON.parse(localStorage.getItem("requests")) || [];

  const submittedOnly = stored.filter(
    (req) =>
      !req.hiddenForStudent &&
      req.studentId === loggedStudent.student_id &&
      (
        req.type === "Exam Form" ||
        req.type === "Internship Letter" ||
        req.type === "Aadhar Card Submission" ||
        req.type === "NOC" ||
        req.type === "Other"
      )
  );

  setRequests(submittedOnly);
}, [navigate]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Remove from your list?");
    if (!confirmDelete) return;

    const stored = JSON.parse(localStorage.getItem("requests")) || [];

    const updated = stored.map((r) => {
      if (r.id === id) {
        return { ...r, hiddenForStudent: true };
      }
      return r;
    });

    localStorage.setItem("requests", JSON.stringify(updated));

    setRequests((prev) => prev.filter((r) => r.id !== id));
  };




  return (
    <div className="dashboard-container">

      {/* ✅ Sidebar */}
      <div className="sidebar">
        <img src={logo} alt="logo" />

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/dashboard")} style={{cursor:"pointer"}}>
            <FaHome /> Dashboard
          </li>

          <li>
            <FaFileAlt /> Submitted Documents
          </li>

          <li onClick={() => navigate("/requested-documents")} style={{cursor:"pointer"}}>
            <FaFileAlt /> Requested Documents
          </li>

          <li onClick={() => navigate("/downloads")}><FaDownload /> Downloaded Documents</li>

          <li onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}><FaUser /> Profile</li>

        </ul>
      </div>

      {/* ✅ Main Content */}
      <div className="main-content">

        <div className="header">
          <div>
            <h1>Submitted Documents</h1>
            <p>All your submitted document requests</p>
          </div>

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
          {requests.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              No documents submitted yet.
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Document Type</th>
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
                    <td>{req.date || new Date().toLocaleDateString()}</td>

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
          )}
        </div>

      </div>
    </div>
  );
}
