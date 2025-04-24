import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Avatar.module.scss';

interface AvatarProps {
  onLogout: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMyEvents = () => {
    navigate('/my-events');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.avatarContainer}>
      <div ref={avatarRef} className={styles.avatar} onClick={toggleMenu}>
        {/* Можно добавить случайную картинку или инициалы */}
        <span>👤</span>
      </div>
      {isMenuOpen && (
        <div className={styles.menu} ref={menuRef}>
          <button onClick={handleMyEvents}>Мои события</button>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      )}
    </div>
  );
};