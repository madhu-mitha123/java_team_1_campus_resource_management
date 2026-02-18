import { useRef, useEffect } from "react";
import BookingLayout from "../components/booking/BookingLayout";
import ResourceSelect from "../components/booking/ResourceSelect";
import SlotGrid from "../components/booking/SlotGrid";
import styles from "../styles/booking.module.css";
import useBooking from "../hooks/useBooking";

function LibraryStationBooking() {
    const {
        resources, selectedResource, selectedDate, timeSlots,
        selectedSlot, loading, slotsLoading, error, success,
        setSelectedSlot, handleResourceSelect, handleDateChange, handleConfirm,
    } = useBooking("LIBRARY_STATION");

    const slotRef = useRef(null);
    useEffect(() => {
        if (selectedResource && selectedDate && slotRef.current) {
            slotRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [timeSlots]);

    return (
        <BookingLayout title="🪑 Library Station Booking">
            <div className={styles.glassCard}>
                <p className={styles.sectionTitle}>Step 1 — Select Date</p>
                <input type="date" className={styles.dateInput} value={selectedDate} onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]} />
            </div>

            {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
            {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

            <div className={styles.glassCard}>
                <p className={styles.sectionTitle}>Step 2 — Select Library Station</p>
                {loading ? <p>Loading stations…</p> : (
                    <ResourceSelect resources={resources} selectedResource={selectedResource} onSelect={handleResourceSelect} />
                )}
            </div>

            {selectedResource && selectedDate && (
                <div ref={slotRef} className={styles.glassCard}>
                    <p className={styles.sectionTitle}>Step 3 — Select Time Slot for <strong>{selectedResource.name}</strong></p>
                    {slotsLoading ? <p>Loading slots…</p> : (
                        <SlotGrid slots={timeSlots} selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
                    )}
                    <button className={styles.actionButton} onClick={handleConfirm} disabled={!selectedSlot}>
                        Confirm Booking
                    </button>
                </div>
            )}
        </BookingLayout>
    );
}

export default LibraryStationBooking;
