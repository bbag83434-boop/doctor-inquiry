import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/doctors.css';
import './styles/appointments.css';
import './styles/appointment-list.css';
import './styles/notifications.css';
import './styles/experience.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
