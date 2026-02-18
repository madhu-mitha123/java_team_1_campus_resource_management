import { useNavigate } from "react-router-dom";
import styles from "../styles/booking.module.css";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
            padding: '2rem',
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        }}>
            <div style={{
                textAlign: 'center',
                marginBottom: '3rem',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                    Campus Portal
                </h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.9, fontWeight: 500 }}>
                    Select your identity to continue to login
                </p>
            </div>

            <div style={{
                display: 'flex',
                gap: '2.5rem',
                maxWidth: '1000px',
                width: '100%',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>

                {/* LEFT: STUDENT & STAFF */}
                <div
                    style={{
                        flex: '1 1 400px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                    }}
                >
                    <h2 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>Students & Staff</h2>

                    <div
                        onClick={() => navigate('/auth?role=STUDENT')}
                        className={styles.glassCard}
                        style={{ cursor: 'pointer', margin: 0, padding: '1.5rem', transition: 'all 0.2s', background: 'rgba(255, 255, 255, 0.9)' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2.5rem' }}>🎓</span>
                            <div>
                                <h3 style={{ margin: 0, color: '#2d3748' }}>Student Login</h3>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#718096' }}>Book classrooms, labs & library resources</p>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate('/auth?role=STAFF')}
                        className={styles.glassCard}
                        style={{ cursor: 'pointer', margin: 0, padding: '1.5rem', transition: 'all 0.2s', background: 'rgba(255, 255, 255, 0.9)' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2.5rem' }}>💼</span>
                            <div>
                                <h3 style={{ margin: 0, color: '#2d3748' }}>Staff Login</h3>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#718096' }}>Priority resource access for faculty</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: ADMIN */}
                <div
                    style={{
                        flex: '1 1 350px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                    }}
                >
                    <h2 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>Administrator</h2>

                    <div
                        onClick={() => navigate('/auth?role=ADMIN')}
                        className={styles.glassCard}
                        style={{
                            cursor: 'pointer', margin: 0, padding: '2.5rem 1.5rem', textAlign: 'center',
                            transition: 'all 0.2s', background: '#2d3748', color: 'white'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛡️</div>
                        <h3 style={{ margin: 0 }}>System Admin</h3>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', opacity: 0.8 }}>Manage resources & approvals</p>
                    </div>
                </div>
            </div>

            <footer style={{ marginTop: '4rem', color: 'white', opacity: 0.7, fontSize: '0.9rem' }}>
                © 2026 Campus Resource Management System
            </footer>
        </div>
    );
}

export default LandingPage;
