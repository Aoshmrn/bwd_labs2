import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';

const App = () => {
  return (
    <ErrorBoundary>
      <LoadingProvider>
        <Router>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
      </LoadingProvider>
    </ErrorBoundary>
  );
};

export default App;
