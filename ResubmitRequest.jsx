import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHome, FaFileAlt, FaDownload, FaUser } from "react-icons/fa";
import logo from "./assets/logo.jpeg";
import "./Dashboard.css";

export default function ResubmitRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [newFile, setNewFile] = useState("");

  useEffect(() => {
    const loggedStudent = JSON.parse(localStorage.getItem("student"));

if (!loggedStudent) {
  navigate("/");
  return;
}

const stored = JSON.parse(localStorage.getItem("requests")) || [];
const found = stored.find(
  r => r.id === Number(id) &&
       r.studentId === loggedStudent.student_id
);

if (!found) {
  navigate("/submitted-documents");
  return;
}

setRequest(found);

  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewFile(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleResubmit = () => {
    if (!newFile) {
      alert("Please upload corrected file.");
      return;
    }

    const stored = JSON.parse(localStorage.getItem("requests")) || [];

    const updated = stored.map(r => {
      if (r.id === Number(id)) {
        return {
          ...r,
          pdfFile: newFile,
          status: "Pending",
          rejectionReason: null,
          hiddenForAdmin: false,
          date: new Date().toLocaleDateString()
        };
      }
      return r;
    });

    localStorage.setItem("requests", JSON.stringify(updated));

    alert("Request Re-submitted Successfully ✅");
    navigate("/submitted-documents");
  };

  if (!request) return <h3 style={{ padding: "30px" }}>Loading...</h3>;

  return (
    <div className="dashboard-container">

      {/* ✅ FULL SIDEBAR */}
      <div className="sidebar">
        <img src={logo} alt="logo" />

        <ul className="sidebar-menu">

          <li onClick={() => navigate("/dashboard")} style={{cursor:"pointer"}}>
            <FaHome /> Dashboard
          </li>

          <li onClick={() => navigate("/submitted-documents")} style={{cursor:"pointer"}}>
            <FaFileAlt /> Submitted Documents
          </li>

          <li onClick={() => navigate("/requested-documents")} style={{cursor:"pointer"}}>
            <FaFileAlt /> Requested Documents
          </li>

          <li onClick={() => navigate("/downloads")}><FaDownload /> Downloaded Documents</li>

          <li onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}><FaUser /> Profile</li>

        </ul>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="main-content">

        <div className="header">
          <h1>Re-upload Document</h1>

          <button
            className="logout-btn"
            onClick={() => navigate("/submitted-documents")}
          >
            Back
          </button>
        </div>

        <div className="details-card">

          <p><strong>Document:</strong> {request.type}</p>
          <p><strong>Status:</strong> <span style={{color:"red"}}>Rejected</span></p>

          <p style={{ marginTop: "10px", color: "red" }}>
            <strong>Rejection Reason:</strong> {request.rejectionReason}
          </p>

          <div style={{ marginTop: "20px" }}>
            <label>Upload Corrected File</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>

          <button
            onClick={handleResubmit}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              borderRadius: "6px",
              backgroundColor: "#2f66c7",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            Re-submit Request
          </button>

        </div>
      </div>
    </div>
  );
}
