import { useState, useEffect } from "react";
import BookingLayout from "../components/booking/BookingLayout";
import styles from "../styles/booking.module.css";
import api from "../api/axiosConfig";

const statusColor = (s) => {
    if (s === "APPROVED") return { bg: "#d1fae5", color: "#065f46" };
    if (s === "REJECTED") return { bg: "#fee2e2", color: "#991b1b" };
    if (s === "PENDING") return { bg: "#fef9c3", color: "#854d0e" };
    return { bg: "#f3f4f6", color: "#6b7280" };
};

const typeIcon = {
    CLASSROOM: "📚", LAB: "🧪", AUDITORIUM: "🏛", EVENT_HALL: "🎪",
    LIBRARY_STATION: "🪑", CANTEEN: "🍽", BOOK: "📖",
};

function MyBookings() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL"); // ALL | PENDING | APPROVED | REJECTED

    useEffect(() => {
        if (user) fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        if (!user?.id) {
            setError("Session expired. Please login again.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        console.log("Fetching bookings for user ID:", user.id);
        try {
            const res = await api.get(`/api/bookings/user/${user.id}`);
            console.log("Bookings received:", res.data);
            setBookings(res.data);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
            const msg = typeof err.response?.data === "string"
                ? err.response.data
                : err.response?.data?.message || "Could not load your bookings. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const filtered = filter === "ALL"
        ? bookings
        : bookings.filter((b) => b.status === filter);

    return (
        <BookingLayout title="📋 My Bookings">
            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: "0.5rem 1.2rem",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            background: filter === f ? "#4c51bf" : "#e2e8f0",
                            color: filter === f ? "white" : "#4a5568",
                            transition: "all 0.2s",
                        }}
                    >
                        {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                        {f !== "ALL" && (
                            <span style={{ marginLeft: "0.4rem", opacity: 0.8 }}>
                                ({bookings.filter((b) => b.status === f).length})
                            </span>
                        )}
                    </button>
                ))}
                <button
                    onClick={fetchMyBookings}
                    style={{
                        padding: "0.5rem 1.2rem", borderRadius: "8px", border: "1px solid #e2e8f0",
                        cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                        background: "white", color: "#4a5568", marginLeft: "auto",
                    }}
                >
                    🔄 Refresh
                </button>
            </div>

            {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

            {loading ? (
                <div className={styles.glassCard}><p>Loading your bookings…</p></div>
            ) : filtered.length === 0 ? (
                <div className={styles.glassCard} style={{ textAlign: "center", padding: "3rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
                    <p style={{ color: "#9ca3af", fontSize: "1.1rem" }}>
                        {filter === "ALL" ? "You have no bookings yet." : `No ${filter.toLowerCase()} bookings.`}
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {filtered.map((b) => {
                        const sc = statusColor(b.status);
                        return (
                            <div key={b.id} className={styles.glassCard} style={{ padding: "1.25rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                                            <span style={{ fontSize: "1.5rem" }}>{typeIcon[b.resource?.type] || "🏢"}</span>
                                            <strong style={{ fontSize: "1.05rem", color: "#1a202c" }}>{b.resource?.name || "—"}</strong>
                                        </div>
                                        <div style={{ fontSize: "0.82rem", color: "#718096", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                                            <span>📅 {b.bookingDate}</span>
                                            <span>⏰ {b.timeSlot ? `${b.timeSlot.startTime} – ${b.timeSlot.endTime}` : "—"}</span>
                                            <span>🏷 {b.resource?.type?.replace("_", " ")}</span>
                                            {b.resource?.department?.name && <span>🏫 {b.resource.department.name}</span>}
                                        </div>
                                        {b.status === "REJECTED" && b.rejectionReason && (
                                            <div style={{
                                                marginTop: "0.8rem",
                                                fontSize: "0.85rem",
                                                color: "#991b1b",
                                                background: "#fee2e2",
                                                padding: "0.75rem 1rem",
                                                borderRadius: "10px",
                                                border: "1px solid #fca5a5",
                                                display: "block",
                                                fontWeight: 500
                                            }}>
                                                <strong style={{ display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>⚠️ Rejection Reason:</strong>
                                                {b.rejectionReason}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                                        <span style={{
                                            padding: "0.3rem 0.9rem", borderRadius: "999px", fontSize: "0.8rem",
                                            fontWeight: 700, background: sc.bg, color: sc.color,
                                        }}>
                                            {b.status}
                                        </span>
                                        <span style={{ fontSize: "0.75rem", color: "#a0aec0" }}>Booking #{b.id}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </BookingLayout>
    );
}

export default MyBookings;
