import React from 'react';
import styles from '../styles/booking.module.css';

const SlotSelector = ({ slots, selectedSlot, onSelectSlot }) => {
    if (!slots || slots.length === 0) {
        return <div style={{ textAlign: 'center', color: '#718096', marginTop: '1rem' }}>No slots available for this date.</div>;
    }

    return (
        <div className={styles.slotGrid}>
            {slots.map((slot) => {
                let statusClass = styles.available;
                if (slot.status === 'BOOKED') statusClass = styles.booked;
                if (slot.status === 'PENDING') statusClass = styles.pending;
                if (selectedSlot?.id === slot.id) statusClass = styles.selected;

                const isDisabled = slot.status === 'BOOKED' || slot.status === 'PENDING';

                return (
                    <div
                        key={slot.id}
                        className={`${styles.timeSlot} ${statusClass}`}
                        onClick={() => !isDisabled && onSelectSlot(slot)}
                    >
                        {slot.startTime} - {slot.endTime}
                        {slot.status !== 'AVAILABLE' && <div style={{ fontSize: '0.7em', marginTop: '4px' }}>{slot.status}</div>}
                    </div>
                );
            })}
        </div>
    );
};

export default SlotSelector;
