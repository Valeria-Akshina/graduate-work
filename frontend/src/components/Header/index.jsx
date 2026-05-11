import React from 'react';
import { ThemeToggle } from '../ThemeToggle';
import styles from './index.module.css';

export const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                LERA<span>RESTO</span>
            </div>
            <ThemeToggle />
        </header>
    );
};