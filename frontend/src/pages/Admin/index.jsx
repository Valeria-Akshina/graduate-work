import React, { useState, useEffect } from 'react';
import styles from './index.module.css';

export const Admin = () => {
    const [tables, setTables] = useState([]);
    const [newTable, setNewTable] = useState({ number: '', capacity: 2, zone: 'Общий зал' });

    const fetchAllTables = () => {
        fetch('http://localhost:5000/api/tables')
            .then(res => res.json())
            .then(data => setTables(data))
            .catch(err => console.error("Ошибка загрузки:", err));
    };

    useEffect(() => {
        fetchAllTables();
    }, []);

    const handleRelease = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tables/${id}/release`, {
                method: 'PATCH',
            });
            if (response.ok) {
                setTables(tables.map(t => t.id === id ? { ...t, status: 'свободен' } : t));
            }
        } catch (err) {
            alert("Ошибка при обновлении статуса");
        }
    };

    const handleAddTable = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/tables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table_number: newTable.number,
                    capacity: newTable.capacity,
                    zone: newTable.zone
                })
            });
            
            if (response.ok) {
                const addedTable = await response.json();
                setTables([...tables, addedTable]); // Обновляем список на лету
                setNewTable({ number: '', capacity: 2, zone: 'Общий зал' }); // Очищаем форму
                alert("Стол успешно добавлен!");
            } else {
                alert("Ошибка: Возможно, такой номер стола уже существует.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Управление залом</h1>

            <div className={styles.addTableForm}>
                <h3>Добавить новый столик</h3>
                <form onSubmit={handleAddTable} className={styles.inlineForm}>
                    <input 
                        type="number" 
                        placeholder="№ стола" 
                        value={newTable.number}
                        onChange={e => setNewTable({...newTable, number: e.target.value})}
                        required 
                    />
                    <input 
                        type="number" 
                        placeholder="Мест" 
                        value={newTable.capacity}
                        onChange={e => setNewTable({...newTable, capacity: e.target.value})}
                        required 
                    />
                    <select 
                        value={newTable.zone}
                        onChange={e => setNewTable({...newTable, zone: e.target.value})}
                    >
                        <option>Общий зал</option>
                        <option>VIP</option>
                        <option>Терраса</option>
                        <option>У окна</option>
                    </select>
                    <button type="submit" className={styles.addBtn}>Создать</button>
                </form>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>№ Стола</th>
                            <th>Зона</th>
                            <th>Мест</th>
                            <th>Статус</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tables.map((table) => (
                            <tr key={table.id} className={table.status === 'занят' ? styles.rowBusy : ''}>
                                <td>{table.table_number}</td>
                                <td>{table.zone}</td>
                                <td>{table.capacity}</td>
                                <td>
                                    <span className={`${styles.status} ${table.status === 'свободен' ? styles.free : styles.busy}`}>
                                        {table.status}
                                    </span>
                                </td>
                                <td>
                                    {table.status === 'занят' ? (
                                        <button 
                                            className={styles.releaseBtn}
                                            onClick={() => handleRelease(table.id)}
                                        >
                                            Освободить
                                        </button>
                                    ) : (
                                        <span className={styles.ready}>Готов к приему</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};