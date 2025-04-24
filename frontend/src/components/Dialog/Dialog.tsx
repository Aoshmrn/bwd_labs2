import React from 'react';
import Overlay from '../Overlay/Overlay';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import styles from './Dialog.module.scss';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Dialog = ({ isOpen, onClose, title, children, actions }: DialogProps) => {
  const dialogRef = useFocusTrap(isOpen);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-labelledby="dialog-title"
        aria-modal="true"
        onKeyDown={handleKeyDown}
      >
        <header className={styles.header}>
          <h2 id="dialog-title" className={styles.title}>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </header>
        <div className={styles.content}>
          {children}
        </div>
        {actions && (
          <footer className={styles.footer}>
            {actions}
          </footer>
        )}
      </div>
    </Overlay>
  );
};

export default Dialog;