import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import "./AdminDash.css";
import { FaHome, FaFileAlt, FaUsers, FaUser } from "react-icons/fa";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);

  const [showRejectBox, setShowRejectBox] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("requests")) || [];
    const found = stored.find((r) => r.id === Number(id));
    setRequest(found);
  }, [id]);

  /* =========================
     NORMAL APPROVE / REJECT
  ========================= */
  const updateStatus = (newStatus) => {
    const stored = JSON.parse(localStorage.getItem("requests")) || [];

    const updated = stored.map((r) => {
      if (r.id === Number(id)) {

        if (r.status !== "Pending") {
          alert("This request is already processed.");
          return r;
        }

        if (newStatus === "Rejected") {
          if (!selectedReason) {
            alert("Please select rejection reason.");
            return r;
          }

          return {
            ...r,
            status: "Rejected",
            rejectionReason:
              selectedReason === "Other" ? otherReason : selectedReason
          };
        }

        return {
          ...r,
          status: "Approved"
        };
      }

      return r;
    });

    localStorage.setItem("requests", JSON.stringify(updated));
    setRequest((prev) => ({ ...prev, status: newStatus }));

    alert(`Request ${newStatus} Successfully!`);
    navigate("/all-requests");
  };

  /* =========================
     AI GENERATION
  ========================= */
  const generateWithAI = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/generate-document",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: request.type,
          name: request.name,
          studentId: request.studentId,
          classname: request.classname,
          rollNo: request.roll_no
        })
      }
    );

    const data = await response.json();

    if (data.success) {
      updateRequestWithGeneratedPdf(data.pdf);
    } else {
      alert("PDF generation failed");
    }

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};



  const updateRequestWithGeneratedPdf = (pdfData) => {
  const stored = JSON.parse(localStorage.getItem("requests")) || [];
  const today = new Date().toLocaleDateString("en-GB");

  const updated = stored.map((r) =>
    r.id === request.id
      ? {
          ...r,
          status: "Approved",
          generatedPdf: pdfData,
          approvedDate: today
        }
      : r
  );

  localStorage.setItem("requests", JSON.stringify(updated));

  setRequest((prev) => ({
    ...prev,
    status: "Approved",
    generatedPdf: pdfData,
    approvedDate: today
  }));

  alert("Document Generated & Approved Successfully!");
  navigate("/all-requests");
};







  if (!request)
    return <h3 style={{ padding: "30px" }}>Loading...</h3>;

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <img src={logo} alt="logo" />
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/admin")}>
            <FaHome /> Dashboard
          </li>
          <li onClick={() => navigate("/all-requests")}>
            <FaFileAlt /> All Requests
          </li>
          <li onClick={() => navigate("/students")}>
            <FaUsers /> Students
          </li>
          <li onClick={() => navigate("/adminprofile")}>
            <FaUser /> Profile
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-content-wrapper">

          <div className="admin-header">
            <h1>Request Details</h1>
            <div>
              <button
                className="back-btn"
                onClick={() => navigate("/all-requests")}
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

          <div className="details-card">

            <p><strong>Document:</strong> {request.type}</p>
            <p><strong>Student ID:</strong> {request.studentId}</p>
            <p><strong>Name:</strong> {request.name}</p>
            <p><strong>Date:</strong> {request.date}</p>
            <p><strong>Class:</strong> {request.className}</p>
            <p><strong>Roll No:</strong> {request.roll_no}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    request.status === "Approved"
                      ? "green"
                      : request.status === "Rejected"
                      ? "red"
                      : "orange",
                  fontWeight: "600"
                }}
              >
                {request.status}
              </span>
            </p>

            {/* Action Buttons */}
            <div style={{ marginTop: "30px" }}>
              {(request.type === "Bonafide" ||
                request.type === "Leaving Certificate") ? (
                <button
                  className="accept-btn"
                  onClick={generateWithAI}
                  disabled={request.status !== "Pending"}
                >
                  Generate & Approve
                </button>
              ) : (
                <button
                  className="accept-btn"
                  onClick={() => updateStatus("Approved")}
                  disabled={request.status !== "Pending"}
                >
                  Approve
                </button>
              )}

              <button
                className="reject-btn"
                onClick={() => setShowRejectBox(true)}
                style={{ marginLeft: "15px" }}
                disabled={request.status !== "Pending"}
              >
                Reject
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
