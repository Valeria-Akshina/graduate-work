import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (username.length < 3 || password.length < 4) {
            alert("Логин должен быть > 3 символов, а пароль > 4");
            return;
        }

        const endpoint = isLogin ? '/api/login' : '/api/register';
        
        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                alert(isLogin ? "С возвращением!" : "Аккаунт создан!");
                navigate('/');
            } else {
                alert(data.error || "Что-то пошло не так");
            }
        } catch (err) {
            console.error(err);
            alert("Сервер не отвечает");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <h2 className={styles.title}>
                    {isLogin ? 'Вход в LeraResto' : 'Регистрация'}
                </h2>
                
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Ваш логин</label>
                        <input 
                            type="text" 
                            placeholder="Например, lera_boss"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label>Пароль</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        {isLogin ? 'Войти' : 'Создать аккаунт'}
                    </button>
                </form>

                <button 
                    className={styles.toggleBtn} 
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                </button>
            </div>
        </div>
    );
};