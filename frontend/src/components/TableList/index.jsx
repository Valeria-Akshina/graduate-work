import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TableCard } from '../TableCard';
import styles from './index.module.css';

export const TableList = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const zone = queryParams.get('zone');
    const guests = queryParams.get('guests');

    useEffect(() => {
        setLoading(true);
        const url = (zone && guests) 
            ? `http://localhost:5000/api/tables?zone=${zone}&guests=${guests}`
            : 'http://localhost:5000/api/tables';

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setTables(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Ошибка загрузки:", err);
                setLoading(false);
            });
    }, [zone, guests]);

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
                alert("Готово! Столик забронирован на ваше имя.");
            }
        } catch (err) {
            console.error("Ошибка при бронировании:", err);
        }
    };

    if (loading) return <div className={styles.loader}>Ищем лучшие места...</div>;

    return (
        <main className={styles.container}>
            <div className={styles.headerInfo}>
                <h2 className={styles.title.titleMargin}>
                    {zone ? `Зал: ${zone}` : 'Все столики'}
                </h2>
                {guests && <p className={styles.subtitle}>Места на компанию: {guests} чел.</p>}
            </div>

            {tables.length === 0 ? (
                <div className={styles.empty}>
                    <h3>Подходящих столиков не нашлось.</h3>
                    <p>Попробуйте выбрать другую зону или уменьшить количество гостей</p>
                </div>
            ) : (
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
            )}
        </main>
    );
};