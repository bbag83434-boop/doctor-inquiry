import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { PublicOnlyRoute } from './components/PublicOnlyRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { HomePlaceholder } from './screens/HomePlaceholder.jsx';
import { LoginScreen } from './screens/LoginScreen.jsx';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<PublicOnlyRoute><LoginScreen /></PublicOnlyRoute>} />
            <Route path="/home" element={<ProtectedRoute><HomePlaceholder /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
