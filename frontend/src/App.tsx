import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';

const App = () => {
  return (
    <ErrorBoundary>
      <LoadingProvider>
        <Router>
          <AuthProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </AuthProvider>
        </Router>
      </LoadingProvider>
    </ErrorBoundary>
  );
};

export default App;
