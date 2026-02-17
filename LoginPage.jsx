import React, { useState } from "react";
import "./LoginPage.css";
import { FaKey, FaUser } from "react-icons/fa";
import logo from "./assets/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export default function LoginPage() {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          student_id: studentId,
          password: password
        })
      });

      const data = await response.json();

     if (data.success) {
  const { success, ...studentData } = data; // remove success
  localStorage.setItem("student", JSON.stringify(studentData));
  navigate("/dashboard");
}

else {
        setError(data.message);
      }

    } catch (err) {
      setError("Server not responding");
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <img src={logo} alt="image" />
        <ul>
       <li>
  <FaKey /> <Link to="/">Student Login</Link>
</li>

<li>
  <FaUser /> <Link to="/admin-login">Admin Login</Link>
</li>

        </ul>
      </div>

      <div className="main">
        <div className="login-box">
          <h1>Student Login</h1>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Student ID</label>
              <input
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
