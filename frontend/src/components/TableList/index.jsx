import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TableCard } from '../TableCard';
import styles from './index.module.css';

export const TableList = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const zone = queryParams.get('zone');
    const guests = queryParams.get('guests');

    useEffect(() => {
        setLoading(true);
        const url = (zone && guests) 
            ? `http://localhost:5000/api/tables?zone=${encodeURIComponent(zone)}&guests=${guests}`
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

    const handleBookTable = async (tableId, tableNumber) => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            alert(`Чтобы забронировать Стол №${tableNumber} и получить 500 приветственных баллов на скидку, пожалуйста, войдите в аккаунт! 🎁`);
            navigate('/auth', { state: { from: window.location.pathname + window.location.search } });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/tables/${tableId}/book`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            if (response.ok) {
                alert(`🎉 Отлично, ${user.username}! Стол №${tableNumber} успешно забронирован за вами. Вам начислена скидка участника!`);
                
                setTables(prevTables => 
                    prevTables.map(t => t.id === tableId ? { ...t, status: 'занят' } : t)
                );
            } else {
                alert("Ошибка при бронировании стола");
            }
        } catch (err) {
            console.error(err);
            alert("Ошибка сервера");
        }
    };

    if (loading) return <div className={styles.loader}>Ищем лучшие места...</div>;

    return (
        <main className={styles.container}>
            <div className={styles.headerInfo}>
                <h2 className={styles.title}>
                    {zone ? `Зал: ${zone}` : 'Все столики'}
                </h2>
                {guests && <p className={styles.subtitle}>Места на компанию: {guests} чел.</p>}
            </div>

            {tables.length === 0 ? (
                <div className={styles.empty}>
                    <h3>Упс! Подходящих столиков не нашлось.</h3>
                    <p>Попробуйте выбрать другую зону или меньше гостей.</p>
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
                            onBook={() => handleBookTable(table.id, table.table_number)} 
                        />
                    ))}
                </div>
            )}
        </main>
    );
};