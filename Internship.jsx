import React, { useState, useEffect } from "react";
import { FaHome, FaFileAlt, FaDownload, FaUser, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import "./Dashboard.css";

export default function InternshipLetter() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    course: "",
    companyName: "",
    duration: "",
    email: "",
    file: null,
    fileBase64: ""
  });

  useEffect(() => {
    const loggedStudent = JSON.parse(localStorage.getItem("student"));

    if (loggedStudent) {
      setFormData((prev) => ({
        ...prev,
        studentId: loggedStudent.student_id
      }));
    }
  }, []);

  const handleChange = (e) => {

    if (e.target.name === "file") {
      const file = e.target.files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          file: file,
          fileBase64: reader.result   // ✅ convert to base64
        }));
      };

      reader.readAsDataURL(file);

    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const loggedStudent = JSON.parse(localStorage.getItem("student"));

    if (!loggedStudent) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    if (!formData.fileBase64) {
      alert("Please upload supporting file");
      return;
    }

    const today = new Date().toLocaleDateString();

    const newRequest = {
      id: Date.now(),
      type: "Internship Letter",
      studentId: loggedStudent.student_id,
      name: formData.fullName,
      course: formData.course,
      companyName: formData.companyName,
      duration: formData.duration,
      email: formData.email,
      reason: `Internship at ${formData.companyName} for ${formData.duration}`,
      pdfFile: formData.fileBase64,   // ✅ important
      status: "Pending",
      date: today
    };

    const existing = JSON.parse(localStorage.getItem("requests")) || [];
    existing.push(newRequest);
    localStorage.setItem("requests", JSON.stringify(existing));

    alert("Request Submitted Successfully ✅");

    navigate("/submitted-documents");
  };

  return (
    <div className="dashboard-container">

      <div className="sidebar">
        <img src={logo} alt="image" />

       <ul className="sidebar-menu">

  <li
    onClick={() => navigate("/dashboard")}
    style={{ cursor: "pointer" }}
  >
    <FaHome /> Dashboard
  </li>

  <li
    onClick={() => navigate("/submitted-documents")}
    style={{ cursor: "pointer" }}
  >
    <FaFileAlt /> Submitted Documents
  </li>

  <li
    onClick={() => navigate("/requested-documents")}
    style={{ cursor: "pointer" }}
  >
    <FaFileAlt /> Requested Documents
  </li>

  <li onClick={() => navigate("/downloads")}><FaDownload /> Downloaded Documents</li>

  <li onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}><FaUser /> Profile</li>

</ul>
      </div>

      <div className="main-content">
        <div className="header">

          <div>
            <h1>Request Internship Letter</h1>
            <p>Fill details & upload supporting file</p>
          </div>

          <div>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "6px 12px",
                marginRight: "10px",
                borderRadius: "6px",
                backgroundColor: "#555",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              <FaArrowLeft /> Back
            </button>

            <button
              onClick={() => navigate("/")}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                backgroundColor: "#2f66c7",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>

        </div>

        <div style={{ marginTop: "30px", maxWidth: "500px" }}>
          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              readOnly
              style={{ backgroundColor: "#f1f1f1" }}
            />

            <input
              type="text"
              name="course"
              placeholder="Course"
              value={formData.course}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="duration"
              placeholder="Internship Duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label style={{ marginTop: "10px", display: "block" }}>
              Upload Supporting File (PDF/DOC)
            </label>

            <input
              type="file"
              name="file"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                borderRadius: "6px",
                backgroundColor: "#2f66c7",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Submit Request
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
