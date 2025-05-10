import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import styles from './Navigation.module.scss';

const Navigation: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        avatarRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.leftSection}>
        <Link to="/" className={styles.logo}>
          Events
        </Link>
        <Link to="/events" className={styles.navLink}>
          Все события
        </Link>
        {user && (
          <Link to="/my-events" className={styles.navLink}>
            Мои события
          </Link>
        )}
        {isAdmin && (
          <Link to="/users" className={styles.navLink}>
            Пользователи
          </Link>
        )}
      </div>
      <div className={styles.rightSection}>
        <button 
          onClick={toggleTheme} 
          className={styles.themeToggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {user ? (
          <div className={styles.userMenu} ref={menuRef}>
            <div
              ref={avatarRef}
              className={styles.avatar}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {user && user.firstName ? user.firstName[0].toUpperCase() : ''}
            </div>
            {isMenuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.username}>
                  {user.firstName}
                  {isAdmin && <span className={styles.adminBadge}>Админ</span>}
                </div>
                <Link to="/profile" className={styles.dropdownItem}>
                  Профиль
                </Link>
                <Link to="/my-events" className={styles.dropdownItem}>
                  Мои события
                </Link>
                {isAdmin && (
                  <Link to="/users" className={styles.dropdownItem}>
                    Пользователи
                  </Link>
                )}
                <button onClick={handleLogout} className={styles.dropdownItem}>
                  Выйти
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/login" className={styles.loginButton}>
              Войти
            </Link>
            <Link to="/register" className={styles.registerButton}>
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;