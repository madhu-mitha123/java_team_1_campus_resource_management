import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import styles from "../styles/booking.module.css";
import "../styles/auth.css"; // Reuse auth styles for inputs

function SplitLogin() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogin = async (e, type) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await api.post("/api/auth/login", { email, password });

            if (response.status === 200) {
                const user = response.data;
                // Basic check to ensure correct side was used (optional, but good UX)
                if (type === 'ADMIN' && user.role !== 'ADMIN') {
                    setError("Access Denied: You are not an Administrator.");
                    return;
                }
                if (type === 'USER' && user.role === 'ADMIN') {
                    // Redirect admin to admin login or just allow?
                    // Let's allow but maybe warn. Or strict separation.
                }

                localStorage.setItem("user", JSON.stringify(user));
                navigate("/dashboard");
            }
        } catch (err) {
            setError("Invalid credentials or server error");
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)'
        }}>

            {/* LEFT COLUMN - ADMIN */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', padding: '2rem' }}>
                <h1 style={{ color: 'white', marginBottom: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Administrator</h1>
                <form
                    onSubmit={(e) => handleLogin(e, 'ADMIN')}
                    className="auth-card" // Reusing
                    style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                    <input name="email" type="email" placeholder="Admin Email" required style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem', borderRadius: '4px', border: 'none' }} />
                    <input name="password" type="password" placeholder="Password" required style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem', borderRadius: '4px', border: 'none' }} />
                    <button type="submit" className="primary-btn" style={{ width: '100%' }}>Admin Login</button>
                </form>
            </div>

            {/* RIGHT COLUMN - STAFF/STUDENT */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                <h1 style={{ color: 'white', marginBottom: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Staff & Student</h1>
                <form
                    onSubmit={(e) => handleLogin(e, 'USER')}
                    className="auth-card"
                    style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                    <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'white' }}>Campus Portal</h3>
                    {/* Inputs need explicit dark text if background is white, or white text if input is transparent. 
                        Let's use the styles from booking.module.css or inline styles to ensure visibility. 
                        Here we use white text on transparent input for that "glass" feel, or white input with dark text. 
                        User complained about "password not showing because of white". 
                        The inputs in auth.css might be white-on-white. 
                        Let's force white background inputs with dark text for readability. */}
                    <input
                        name="email"
                        type="email"
                        placeholder="Campus Email"
                        required
                        style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem', borderRadius: '4px', border: 'none', background: 'white', color: '#333' }}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem', borderRadius: '4px', border: 'none', background: 'white', color: '#333' }}
                    />
                    <button type="submit" className="primary-btn" style={{ width: '100%' }}>Login</button>
                    <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'white' }}>
                        Don't have an account? <span onClick={() => navigate('/')} style={{ color: '#00f260', cursor: 'pointer', fontWeight: 'bold' }}>Create Account</span>
                    </p>
                </form>
            </div>

            {error && (
                <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: '#feb2b2', color: '#c53030', padding: '1rem 2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    {error}
                </div>
            )}

        </div>
    );
}

export default SplitLogin;
