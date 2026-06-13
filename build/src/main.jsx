import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { SpaceProvider } from './context/SpaceContext';
import { NotificationProvider } from './context/NotificationContext';
createRoot(document.getElementById('root')).render(<StrictMode>
    <AuthProvider>
      <SpaceProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </SpaceProvider>
    </AuthProvider>
  </StrictMode>);