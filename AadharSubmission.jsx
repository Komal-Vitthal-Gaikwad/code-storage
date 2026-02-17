import React, { useState, useEffect } from "react";
import { FaHome, FaFileAlt, FaDownload, FaUser, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import "./Dashboard.css";

export default function AadharSubmission() {

  const navigate = useNavigate();
const loggedStudent = JSON.parse(localStorage.getItem("student"));

  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    phone: "",
    aadhar: "",
    file: null,
    fileBase64: ""
  });

  useEffect(() => {
    if (!loggedStudent) {
  navigate("/");
} else {
  setFormData(prev => ({
    ...prev,
    studentId: loggedStudent.student_id
  }));
}

  }, []);

  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "file") {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        file: file,
        fileBase64: reader.result
      }));
    };

    reader.readAsDataURL(file);
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date().toLocaleDateString();

   const newRequest = {
  id: Date.now(),
  type: "Aadhar Card Submission",
  studentId: loggedStudent.student_id,
  name: formData.fullName,
  phone: formData.phone,
  email: formData.email,
  reason: `Aadhar Update - ${formData.aadhar}`,
  pdfFile: formData.fileBase64,
  status: "Pending",
  date: today
};


    const existing = JSON.parse(localStorage.getItem("requests")) || [];
    existing.push(newRequest);
    localStorage.setItem("requests", JSON.stringify(existing));

    alert("Aadhar Submitted Successfully ✅");

    navigate("/submitted-documents");
  };

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="main-content">
        <div className="header">

          <div>
            <h1>Aadhar Card Submission</h1>
            <p>Fill details & upload your Aadhar card</p>
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

        {/* Form */}
        <div style={{ marginTop: "40px", maxWidth: "500px" }}>
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
              style={{ backgroundColor: "#eee" }}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Phone Number */}
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              pattern="[0-9]{10}"
              maxLength="10"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            {/* Aadhar Number */}
            <input
              type="text"
              name="aadhar"
              placeholder="Aadhar Number (12 digits)"
              pattern="[0-9]{12}"
              maxLength="12"
              value={formData.aadhar}
              onChange={handleChange}
              required
            />

            <label style={{ marginTop: "10px", display: "block" }}>
              Upload Aadhar Card (PDF)
            </label>

            <input
              type="file"
              name="file"
              accept=".pdf,.jpg,.jpeg,.png"
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
              Submit Aadhar
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
