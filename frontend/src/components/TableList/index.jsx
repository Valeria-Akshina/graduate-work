import React, { useState, useEffect } from 'react';
import { TableCard } from '../TableCard';
import styles from './index.module.css';

export const TableList = () => {
    const [tables, setTables] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/tables')
            .then(res => res.json())
            .then(data => setTables(data))
            .catch(err => console.error("Ошибка загрузки:", err));
    }, []);

    const handleBookTable = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tables/${id}/book`, {
                method: 'PATCH',
            });

            if (response.ok) {
                setTables(prevTables => 
                    prevTables.map(table => 
                        table.id === id ? { ...table, status: 'занят' } : table
                    )
                );
                alert("Стол успешно забронирован!");
            }
        } catch (err) {
            console.error("Ошибка при бронировании:", err);
        }
    };

    return (
        <main className={styles.container}>
            <h2 className={styles.title}>Выберите столик</h2>
            <div className={styles.grid}>
                {tables.map(table => (
                    <TableCard 
                        key={table.id}
                        id={table.id}
                        tableNumber={table.table_number}
                        capacity={table.capacity}
                        status={table.status}
                        onBook={() => handleBookTable(table.id)}
                    />
                ))}
            </div>
        </main>
    );
};