import React from 'react';
import styles from './index.module.css';

export const TableCard = ({ id, tableNumber, capacity, status, onBook }) => {
    const currentStatus = status?.toLowerCase();
    const isAvailable = currentStatus === 'свободен';

    return (
        <div className={`${styles.card} ${!isAvailable ? styles.cardBusy : ''}`}>
            <div className={styles.header}>
                <span className={styles.number}>Стол №{tableNumber}</span>
                <div className={`${styles.badge} ${isAvailable ? styles.free : styles.busy}`}>
                    {currentStatus}
                </div>
            </div>
            
            <div className={styles.info}>
                <span>Вместимость:</span>
                <span className={styles.value}>👤 {capacity} чел.</span>
            </div>

            <button 
                className={styles.button} 
                disabled={!isAvailable}
                onClick={onBook}
            >
                {isAvailable ? 'Забронировать' : 'Мест нет'}
            </button>
        </div>
    );
};