import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSwipe } from '../../hooks/useSwipe';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import Portal from '../Portal/Portal';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import styles from './MobileMenu.module.scss';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MobileMenu = ({ isOpen, onClose, onLogout }: MobileMenuProps) => {
  const { isAuthenticated, user } = useAuth();
  const { isSwiping } = useSwipe({
    onSwipeLeft: onClose,
  });
  const menuRef = useFocusTrap(isOpen);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const menuClass = `${styles.menu} ${isSwiping ? styles.swiping : ''}`;

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await onLogout();
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Portal containerId="mobile-menu-root">
      <div 
        className={styles.overlay} 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div 
          ref={menuRef}
          className={menuClass}
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading && (
            <LoadingIndicator size="small" fullscreen />
          )}
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
          
          {isAuthenticated ? (
            <>
              <span className={styles.username}>Welcome, {user?.username}</span>
              <Link to="/profile" onClick={onClose}>Profile</Link>
              <button 
                onClick={handleLogout}
                className={styles.logoutButton}
                disabled={isLoading}
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={onClose}>Login</Link>
              <Link to="/register" onClick={onClose}>Register</Link>
            </>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default MobileMenu;