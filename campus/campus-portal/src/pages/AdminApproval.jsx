import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/booking.module.css";
import api from "../api/axiosConfig";

const roleClass = { ADMIN: styles.roleADMIN, STAFF: styles.roleSTAFF, STUDENT: styles.roleSTUDENT };

function AdminApproval() {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const [tab, setTab] = useState("pending"); // "pending" | "all"
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [rejectReasons, setRejectReasons] = useState({}); // bookingId -> reason string

    useEffect(() => {
        if (!user || user.role !== "ADMIN") {
            navigate("/dashboard");
            return;
        }
        fetchBookings(tab);
    }, [tab]);

    const fetchBookings = async (type) => {
        setLoading(true);
        setError("");
        try {
            const url = type === "pending" ? "/api/bookings/pending" : "/api/bookings";
            const res = await api.get(url);
            setBookings(res.data);
        } catch (err) {
            setError("Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (bookingId) => {
        setError("");
        setSuccess("");
        try {
            await api.put("/api/bookings/approve", { bookingId, adminId: user.id });
            setSuccess(`Booking #${bookingId} approved.`);
            fetchBookings(tab);
        } catch (err) {
            setError(err.response?.data?.message || "Approval failed.");
        }
    };

    const handleReject = async (bookingId) => {
        setError("");
        setSuccess("");
        const reason = rejectReasons[bookingId] || "";
        if (!reason.trim()) {
            setError("Please enter a rejection reason.");
            return;
        }
        try {
            await api.put("/api/bookings/reject", { bookingId, adminId: user.id, reason });
            setSuccess(`Booking #${bookingId} rejected.`);
            setRejectReasons((prev) => { const n = { ...prev }; delete n[bookingId]; return n; });
            fetchBookings(tab);
        } catch (err) {
            setError(err.response?.data?.message || "Rejection failed.");
        }
    };

    const statusColor = (s) => {
        if (s === "APPROVED") return "#065f46";
        if (s === "REJECTED") return "#991b1b";
        if (s === "PENDING") return "#854d0e";
        return "#4a5568";
    };
    const statusBg = (s) => {
        if (s === "APPROVED") return "#d1fae5";
        if (s === "REJECTED") return "#fee2e2";
        if (s === "PENDING") return "#fef9c3";
        return "#f3f4f6";
    };

    return (
        <div className={styles.bookingContainer}>
            <header className={styles.header}>
                <button onClick={() => navigate("/dashboard")} className={styles.backButton}>← Dashboard</button>
                <h1 className={styles.pageTitle}>🛡 Admin Booking Panel</h1>
                {user && (
                    <div className={styles.userInfo}>
                        <span>{user.name}</span>
                        <span className={`${styles.roleBadge} ${roleClass[user.role] || ""}`}>{user.role}</span>
                    </div>
                )}
            </header>

            <main className={styles.mainContent}>
                {/* Tabs */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                    <button
                        onClick={() => setTab("pending")}
                        style={{
                            padding: "0.6rem 1.5rem", borderRadius: "8px", border: "none", cursor: "pointer",
                            fontWeight: 600, fontSize: "0.9rem",
                            background: tab === "pending" ? "#4c51bf" : "#e2e8f0",
                            color: tab === "pending" ? "white" : "#4a5568",
                        }}
                    >
                        ⏳ Pending Approvals
                    </button>
                    <button
                        onClick={() => setTab("all")}
                        style={{
                            padding: "0.6rem 1.5rem", borderRadius: "8px", border: "none", cursor: "pointer",
                            fontWeight: 600, fontSize: "0.9rem",
                            background: tab === "all" ? "#4c51bf" : "#e2e8f0",
                            color: tab === "all" ? "white" : "#4a5568",
                        }}
                    >
                        📋 All Bookings
                    </button>
                </div>

                {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
                {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

                {loading ? (
                    <div className={styles.glassCard}><p>Loading bookings…</p></div>
                ) : bookings.length === 0 ? (
                    <div className={styles.glassCard}>
                        <p style={{ textAlign: "center", color: "#9ca3af" }}>
                            {tab === "pending" ? "No pending bookings." : "No bookings found."}
                        </p>
                    </div>
                ) : (
                    <div className={styles.glassCard} style={{ overflowX: "auto" }}>
                        <table className={styles.adminTable}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Resource</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Slot</th>
                                    <th>Status</th>
                                    {tab === "pending" && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b.id}>
                                        <td>{b.id}</td>
                                        <td>
                                            <strong>{b.user?.name || "—"}</strong>
                                            <div style={{ fontSize: "0.75rem", color: "#718096" }}>{b.user?.email}</div>
                                        </td>
                                        <td>
                                            <span className={`${styles.roleBadge} ${roleClass[b.user?.role] || ""}`}>
                                                {b.user?.role}
                                            </span>
                                        </td>
                                        <td>{b.resource?.name || "—"}</td>
                                        <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>{b.resource?.type}</td>
                                        <td>{b.bookingDate}</td>
                                        <td style={{ fontSize: "0.82rem" }}>
                                            {b.timeSlot ? `${b.timeSlot.startTime} – ${b.timeSlot.endTime}` : "—"}
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem",
                                                fontWeight: 700, background: statusBg(b.status), color: statusColor(b.status),
                                            }}>
                                                {b.status}
                                            </span>
                                            {b.rejectionReason && (
                                                <div style={{ fontSize: "0.72rem", color: "#991b1b", marginTop: "3px" }}>
                                                    Reason: {b.rejectionReason}
                                                </div>
                                            )}
                                        </td>
                                        {tab === "pending" && (
                                            <td>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                    <button className={styles.approveBtn} onClick={() => handleApprove(b.id)}>
                                                        ✓ Approve
                                                    </button>
                                                    <input
                                                        className={styles.reasonInput}
                                                        placeholder="Rejection reason…"
                                                        value={rejectReasons[b.id] || ""}
                                                        onChange={(e) =>
                                                            setRejectReasons((prev) => ({ ...prev, [b.id]: e.target.value }))
                                                        }
                                                    />
                                                    <button className={styles.rejectBtn} onClick={() => handleReject(b.id)}>
                                                        ✗ Reject
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminApproval;
