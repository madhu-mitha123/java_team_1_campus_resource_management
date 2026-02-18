import { useNavigate } from "react-router-dom";
import styles from "../../styles/booking.module.css";
import { useEffect, useState } from "react";

const roleClass = { ADMIN: styles.roleADMIN, STAFF: styles.roleSTAFF, STUDENT: styles.roleSTUDENT };

const BookingLayout = ({ title, children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        else navigate("/");
    }, [navigate]);

    return (
        <div className={styles.bookingContainer}>
            <header className={styles.header}>
                <button onClick={() => navigate("/dashboard")} className={styles.backButton}>
                    ← Dashboard
                </button>
                <h1 className={styles.pageTitle}>{title}</h1>
                {user && (
                    <div className={styles.userInfo}>
                        <span>{user.name}</span>
                        <span className={`${styles.roleBadge} ${roleClass[user.role] || ""}`}>{user.role}</span>
                    </div>
                )}
            </header>
            <main className={styles.mainContent}>{children}</main>
        </div>
    );
};

export default BookingLayout;
