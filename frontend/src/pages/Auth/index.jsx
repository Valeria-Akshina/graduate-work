import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './index.module.css';

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? 'login' : 'register';
        
        try {
            const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    alert(`Добро пожаловать, ${data.user.username}!`);
                    
                    const fromPage = location.state?.from || '/';
                    window.location.href = fromPage; 
                } else {
                    alert("🎉 Регистрация успешна! Вам начислено 500 приветственных баллов. Теперь войдите в созданный аккаунт под своими данными.");
                    setIsLogin(true);
                    setPassword('');
                }
            } else {
                alert(data.error || "Что-то пошло не так");
            }
        } catch (err) {
            console.error(err);
            alert("Ошибка соединения с сервером");
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        margin: '10px 0',
        borderRadius: '8px',
        border: '1px solid #444',
        backgroundColor: '#222831',
        color: '#eeeeee',
        fontSize: '1rem',
        boxSizing: 'border-box',
        outline: 'none'
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <h2 className={styles.title}>
                    {isLogin ? 'Вход в систему' : 'Регистрация'}
                </h2>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input 
                        type="text" 
                        placeholder="Имя пользователя" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={inputStyle}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Пароль" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required 
                    />
                    <button type="submit" className={styles.submitBtn}>
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>

                <div style={{ marginTop: '25px', borderTop: '1px solid #444', paddingTop: '15px' }}>
                    <button 
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setUsername('');
                            setPassword('');
                        }} 
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#00adb5',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            width: '100%'
                        }}
                    >
                        {isLogin ? 'Ещё нет аккаунта? Создать его' : 'Уже есть аккаунт? Нажмите для входа'}
                    </button>
                </div>
            </div>
        </div>
    );
};