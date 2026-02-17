import React, { useEffect, useState } from "react";
import { FaHome, FaFileAlt, FaDownload, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import "./Dashboard.css";

export default function LeavingCertificate() {

  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  const [formData, setFormData] = useState({
    className: "",
    division: "",
    rollNo: "",
    reason: ""
  });

  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("student"));
    if (!storedStudent) {
      navigate("/");
    } else {
      setStudent(storedStudent);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRequest = {
      id: Date.now(),
      type: "Leaving Certificate",
      studentId: student.student_id,
      name: student.name,
      phone: student.phone,
      className: formData.className,
      division: formData.division,
      rollNo: formData.rollNo,
      reason: formData.reason,
      status: "Pending",
      date: new Date().toLocaleDateString()
    };

    const existing = JSON.parse(localStorage.getItem("requests")) || [];
    existing.push(newRequest);
    localStorage.setItem("requests", JSON.stringify(existing));

    alert("Leaving Certificate Request Submitted ✅");

    navigate("/requested-documents");
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

          <li onClick={() => navigate("/downloads")}><FaDownload /> Downloaded Documents</li>

          <li onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}><FaUser /> Profile</li>

        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">

        <div className="header">
  <div>
    <h1>Leaving Certificate Request</h1>
    <p>Fill details to apply</p>
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


        {student && (
          <form onSubmit={handleSubmit} style={{maxWidth:"500px"}}>

            <input value={student.student_id} disabled />
            <input value={student.name} disabled />
            <input value={student.phone} disabled />

            <input
              type="text"
              name="className"
              placeholder="Class"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="division"
              placeholder="Division"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="rollNo"
              placeholder="Roll No"
              onChange={handleChange}
              required
            />

            <textarea
              name="reason"
              placeholder="Reason for Leaving"
              onChange={handleChange}
              required
              style={{padding:"10px", borderRadius:"6px"}}
            />

            <button type="submit" className="apply-btn">
              Request
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
