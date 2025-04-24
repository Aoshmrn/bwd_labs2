import React from 'react';
import Portal from '../Portal/Portal';
import styles from './Overlay.module.scss';

interface OverlayProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  preventScroll?: boolean;
}

const Overlay = ({ children, isOpen, onClose, preventScroll = true }: OverlayProps) => {
  React.useEffect(() => {
    if (preventScroll && isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, preventScroll]);

  if (!isOpen) return null;

  return (
    <Portal containerId="overlay-root">
      <div 
        className={styles.overlay}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      >
        <div 
          className={styles.content}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};

export default Overlay;