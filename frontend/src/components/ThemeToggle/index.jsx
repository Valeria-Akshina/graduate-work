import React, { useState, useEffect } from 'react';
import styles from './index.module.css';

export const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    return (
        <button 
            className={styles.toggleBtn} 
            onClick={() => setIsDark(!isDark)}
            title="Сменить тему"
        >
            {isDark ? '🌙' : '☀️'} 
            <span className={styles.text}>
                {isDark ? 'Темная' : 'Светлая'}
            </span>
        </button>
    );
};