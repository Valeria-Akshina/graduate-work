import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

export const Home = () => {
    const [guests, setGuests] = useState(2);
    const [zone, setZone] = useState('Общий зал');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        
        if (guests < 1 || guests > 15) {
            alert("Мы можем принять компанию от 1 до 15 человек. Для банкетов звоните нам!");
            return;
        }

        navigate(`/tables?zone=${zone}&guests=${guests}`);
    };

    return (
        <div className={styles.hero}>
            <div className={styles.overlay}>
                <div className={styles.content}>
                    <h1 className={styles.title}>Lera<span>Resto</span></h1>
                    <p className={styles.subtitle}>Забронируйте идеальный столик для вашего вечера</p>
                    
                    <form className={styles.searchBox} onSubmit={handleSearch}>
                        <div className={styles.inputGroup}>
                            <label>Где хотите присесть?</label>
                            <select value={zone} onChange={(e) => setZone(e.target.value)}>
                                <option>Общий зал</option>
                                <option>VIP</option>
                                <option>Терраса</option>
                                <option>У окна</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Сколько вас будет?</label>
                            <input 
                                type="number" 
                                value={guests} 
                                onChange={(e) => setGuests(e.target.value)}
                                min="1" 
                                max="15"
                            />
                        </div>

                        <button type="submit" className={styles.searchBtn}>
                            Найти столик
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};