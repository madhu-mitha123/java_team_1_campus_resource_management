import styles from "../../styles/booking.module.css";

const ICONS = {
    CLASSROOM: "📚", LAB: "🧪", AUDITORIUM: "🏛", EVENT_HALL: "🎪",
    LIBRARY_STATION: "🪑", CANTEEN: "🍽", BOOK: "📖", default: "🏢"
};

const ResourceSelect = ({ resources, selectedResource, onSelect }) => {
    if (!resources || resources.length === 0) {
        return <p className={styles.noSlots}>No resources available for your account.</p>;
    }
    return (
        <div className={styles.resourceGrid}>
            {resources.map((r) => (
                <div
                    key={r.id}
                    className={`${styles.resourceCard} ${selectedResource?.id === r.id ? styles.selected : ""}`}
                    onClick={() => onSelect(r)}
                >
                    <div className={styles.cardIcon}>{ICONS[r.type] || ICONS.default}</div>
                    <div className={styles.cardTitle}>{r.name}</div>
                    <div className={styles.cardMeta}>
                        <span>Capacity: {r.capacity}</span>
                        {r.department?.name && <span>• {r.department.name}</span>}
                    </div>
                    <span className={`${styles.statusBadge} ${styles[r.status] || ""}`}>{r.status}</span>
                </div>
            ))}
        </div>
    );
};

export default ResourceSelect;
