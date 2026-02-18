import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("role");
    if (roleParam) {
      setRole(roleParam);
    }
  }, [location]);

  const handleSubmit = async () => {
    setError("");

    if (isRegister) {
      if (!name || !email || !phone || !password) {
        setError("Please fill all fields");
        return;
      }
      if (phone.length !== 10) {
        setError("Phone number must be 10 digits");
        return;
      }
      if (role === "STUDENT" && !department) {
        setError("Please select department");
        return;
      }
    } else {
      if (!email || !password) {
        setError("Please enter email and password");
        return;
      }
    }

    try {
      if (isRegister) {
        await api.post("/api/auth/register", {
          name, email, phone, password, role,
          departmentName: role === "STUDENT" ? department : null
        });
        alert("Account created successfully! Please login.");
        setIsRegister(false);
        return;
      }

      const response = await api.post("/api/auth/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || (typeof err.response?.data === "string" ? err.response.data : "Something went wrong");
      setError(message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <button onClick={() => navigate('/')} className="back-btn" style={{ position: 'absolute', top: '10px', left: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
        <h2 style={{ marginTop: '1rem' }}>Campus Portal</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Continue as <strong>{role}</strong></p>

        <div className="toggle">
          {role !== "ADMIN" ? (
            <>
              <button type="button" className={!isRegister ? "active" : ""} onClick={() => setIsRegister(false)}>Login</button>
              <button type="button" className={isRegister ? "active" : ""} onClick={() => setIsRegister(true)}>Register</button>
            </>
          ) : (
            <div style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', fontWeight: 600, borderRadius: '14px' }}>Administrative Access</div>
          )}
        </div>

        {isRegister && role !== "ADMIN" && (
          <>
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </>
        )}

        <input type="email" placeholder="Campus Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {isRegister && role === "STUDENT" && (
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="IT">IT</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
            <option value="AUTO">AUTO</option>
          </select>
        )}

        {error && <p className="error-text">{error}</p>}
        <button className="primary-btn" onClick={handleSubmit}>{isRegister ? "Create Account" : "Login"}</button>
      </div>
    </div>
  );
}

export default Login;
