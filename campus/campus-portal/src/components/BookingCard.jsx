import React from 'react';
import styles from '../styles/booking.module.css';

const BookingCard = ({ resource, onSelect, isSelected }) => {
  return (
    <div 
      className={`${styles.resourceCard} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(resource)}
    >
      <div className={styles.cardTitle}>{resource.name}</div>
      <div className={styles.cardMeta}>
        <span>Capacity: {resource.capacity}</span>
        {resource.department && <span> • {resource.department}</span>}
      </div>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        {isSelected ? '✅' : '🏢'}
      </div>
    </div>
  );
};

export default BookingCard;
