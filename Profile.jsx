import React, { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaDownload, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import "./Dashboard.css";

export default function Profile() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  const [submittedCount, setSubmittedCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("student"));
    const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];

    if (!storedStudent) {
      navigate("/");
    } else {
      setStudent(storedStudent);

      const studentRequests = storedRequests.filter(
        (req) => req.studentId === storedStudent.student_id
      );

      setSubmittedCount(studentRequests.length);
      setApprovedCount(
        studentRequests.filter((r) => r.status === "Approved").length
      );
      setRejectedCount(
        studentRequests.filter((r) => r.status === "Rejected").length
      );
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <img src={logo} alt="logo" />

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
            <FaHome /> Dashboard
          </li>

          <li onClick={() => navigate("/submitted-documents")} style={{ cursor: "pointer" }}>
            <FaFileAlt /> Submitted Documents
          </li>

          <li onClick={() => navigate("/requested-documents")} style={{ cursor: "pointer" }}>
            <FaFileAlt /> Requested Documents
          </li>

          <li onClick={() => navigate("/downloads")}><FaDownload /> Downloaded Documents</li>

          <li style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            <FaUser /> Profile
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {student && (
          <div className="profile-wrapper">

            {/* Profile Card */}
            <div className="profile-card-modern">
              <div className="profile-avatar-modern">
                {student?.name?.charAt(0)}
              </div>

              <h2>{student.name}</h2>

              <div className="profile-divider"></div>

              <div className="profile-details-modern">
                <p><strong>Student ID:</strong> {student.student_id}</p>
                <p><strong>Phone:</strong> {student.phone}</p>
              </div>

              <div className="profile-stats-modern">
                <div>
                  <h3>{submittedCount}</h3>
                  <span>Submitted</span>
                </div>
                <div>
                  <h3>{approvedCount}</h3>
                  <span>Approved</span>
                </div>
                <div>
                  <h3>{rejectedCount}</h3>
                  <span>Rejected</span>
                </div>
              </div>
            </div>

            {/* Academic Details Card */}
            <div className="profile-card-modern extra-details-card">
              <div className="details-header">
                <h3>Academic Details</h3>
              </div>

              <div className="profile-divider"></div>

              <div className="profile-details-modern">
                <p><strong>Class:</strong> {student.className || "BE"}</p>
                <p><strong>Division:</strong> {student.division || "A"}</p>
                <p><strong>Roll No:</strong> {student.roll_no || "21"}</p>
                <p><strong>Email:</strong> {student.email || "student@email.com"}</p>
                <p><strong>Temporary Address:</strong> {student.temp_address || "Nandura, Buldhana"}</p>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
