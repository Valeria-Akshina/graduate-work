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

    return (
        <main className={styles.container}>
            <h2 className={styles.title}>Выберите столик</h2>
            <div className={styles.grid}>
                {tables.map(table => (
                    <TableCard 
                        key={table.id}
                        tableNumber={table.table_number}
                        capacity={table.capacity}
                        status={table.status}
                    />
                ))}
            </div>
        </main>
    );
};