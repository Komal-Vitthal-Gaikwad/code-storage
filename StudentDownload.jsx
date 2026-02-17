import React, { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaDownload, FaUser, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import "./Dashboard.css";

export default function StudentDownload() {

  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));
    const stored = JSON.parse(localStorage.getItem("requests")) || [];

   const approvedDocs = stored.filter(
  r =>
    r.studentId === student?.student_id &&
    r.status === "Approved" &&
    r.generatedPdf
);



    setDocuments(approvedDocs);
  }, []);

  // ✅ Download using server file path
  const handleDownload = (pdfData, fileName) => {
  const link = document.createElement("a");
  link.href = pdfData;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};




  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <img src={logo} alt="logo" />

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/dashboard")} style={{cursor:"pointer"}}>
            <FaHome /> Dashboard
          </li>

          <li onClick={() => navigate("/submitted-documents")} style={{cursor:"pointer"}}>
            <FaFileAlt /> Submitted Document
          </li>

          <li onClick={() => navigate("/requested-documents")} style={{cursor:"pointer"}}>
            <FaFileAlt /> Requested Documents
          </li>

          <li onClick={() => navigate("/downloads")} style={{cursor:"pointer"}}>
            <FaDownload /> Downloaded Documents
          </li>

          <li onClick={() => navigate("/profile")} style={{cursor:"pointer"}}>
            <FaUser /> Profile
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">

        <div className="header">
          <h1>Downloaded Documents</h1>

          <button 
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        <div className="table-wrapper">

          {documents.length === 0 ? (
            <p>No approved documents yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Approved Date</th>
                  <th>Download</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.type}</td>
                    <td>{doc.approvedDate}</td>
                    <td>
                      <FaDownload
                        style={{ cursor: "pointer", color: "#1e64c8" }}
                        onClick={() =>
                          handleDownload(
                            doc.generatedPdf,
                            `${doc.type}_${doc.studentId}.pdf`
                          )
                        }
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
