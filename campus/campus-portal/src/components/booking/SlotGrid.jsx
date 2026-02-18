import styles from "../../styles/booking.module.css";

const SlotGrid = ({ slots, selectedSlot, onSelect }) => {
    if (!slots || slots.length === 0) {
        return <p className={styles.noSlots}>No time slots available for this date.</p>;
    }

    const getClass = (slot) => {
        if (selectedSlot?.id === slot.id) return `${styles.timeSlot} ${styles.selected}`;
        switch (slot.status) {
            case "AVAILABLE": return `${styles.timeSlot} ${styles.available}`;
            case "PENDING": return `${styles.timeSlot} ${styles.pending}`;
            case "BOOKED": return `${styles.timeSlot} ${styles.booked}`;
            default: return `${styles.timeSlot} ${styles.disabled}`;
        }
    };

    return (
        <>
            <div className={styles.legend}>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: "#6ee7b7" }} />Available</span>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: "#fde047" }} />Pending</span>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: "#fca5a5" }} />Booked</span>
            </div>
            <div className={styles.slotGrid}>
                {slots.map((slot) => (
                    <div
                        key={slot.id}
                        className={getClass(slot)}
                        onClick={() => slot.status === "AVAILABLE" && onSelect(slot)}
                    >
                        <div>{slot.startTime} – {slot.endTime}</div>
                        {slot.status !== "AVAILABLE" && (
                            <div style={{ fontSize: "0.7em", marginTop: "3px", opacity: 0.8 }}>{slot.status}</div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default SlotGrid;
