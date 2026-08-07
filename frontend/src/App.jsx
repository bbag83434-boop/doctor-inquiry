import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { PublicOnlyRoute } from './components/PublicOnlyRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AppExperience } from './components/AppExperience.jsx';
import { GlobalLoader } from './components/GlobalLoader.jsx';
import { GlobalLoadingProvider } from './context/GlobalLoadingContext.jsx';

// Route modules stay out of the first bundle and load on demand.
const LoginScreen = lazy(() => import('./screens/LoginScreen.jsx').then((module) => ({ default: module.LoginScreen })));
const HomeDashboard = lazy(() => import('./screens/HomeDashboard.jsx').then((module) => ({ default: module.HomeDashboard })));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GlobalLoadingProvider>
          <BrowserRouter>
            <AppExperience>
              <Suspense fallback={<GlobalLoader message="Loading your care space..." />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<PublicOnlyRoute><LoginScreen /></PublicOnlyRoute>} />
                  <Route path="/home" element={<ProtectedRoute><HomeDashboard /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </Suspense>
            </AppExperience>
          </BrowserRouter>
        </GlobalLoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
