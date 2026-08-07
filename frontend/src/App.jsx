import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { PublicOnlyRoute } from './components/PublicOnlyRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AppExperience } from './components/AppExperience.jsx';
import { GlobalLoader } from './components/GlobalLoader.jsx';
import { GlobalLoadingProvider } from './context/GlobalLoadingContext.jsx';
import { NotificationsProvider } from './context/NotificationsContext.jsx';

// Route modules stay out of the first bundle and load on demand.
const LoginScreen = lazy(() => import('./screens/LoginScreen.jsx').then((module) => ({ default: module.LoginScreen })));
const HomeDashboard = lazy(() => import('./screens/HomeDashboard.jsx').then((module) => ({ default: module.HomeDashboard })));
const DoctorsScreen = lazy(() => import('./screens/DoctorsScreen.jsx').then((module) => ({ default: module.DoctorsScreen })));
const DoctorDetailsScreen = lazy(() => import('./screens/DoctorDetailsScreen.jsx').then((module) => ({ default: module.DoctorDetailsScreen })));
const BookAppointmentScreen = lazy(() => import('./screens/BookAppointmentScreen.jsx').then((module) => ({ default: module.BookAppointmentScreen })));
const AppointmentSuccessScreen = lazy(() => import('./screens/AppointmentSuccessScreen.jsx').then((module) => ({ default: module.AppointmentSuccessScreen })));
const AppointmentsScreen = lazy(() => import('./screens/AppointmentsScreen.jsx').then((module) => ({ default: module.AppointmentsScreen })));
const AppointmentDetailsScreen = lazy(() => import('./screens/AppointmentDetailsScreen.jsx').then((module) => ({ default: module.AppointmentDetailsScreen })));
const NotificationsScreen = lazy(() => import('./screens/NotificationsScreen.jsx').then((module) => ({ default: module.NotificationsScreen })));
const NotificationDetailsScreen = lazy(() => import('./screens/NotificationDetailsScreen.jsx').then((module) => ({ default: module.NotificationDetailsScreen })));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen.jsx').then((module) => ({ default: module.ProfileScreen })));
const EditProfileScreen = lazy(() => import('./screens/EditProfileScreen.jsx').then((module) => ({ default: module.EditProfileScreen })));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen.jsx').then((module) => ({ default: module.SettingsScreen })));
const HelpSupportScreen = lazy(() => import('./screens/HelpSupportScreen.jsx').then((module) => ({ default: module.HelpSupportScreen })));
const ContactUsScreen = lazy(() => import('./screens/ContactUsScreen.jsx').then((module) => ({ default: module.ContactUsScreen })));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GlobalLoadingProvider>
          <BrowserRouter>
            <NotificationsProvider><AppExperience>
              <Suspense fallback={<GlobalLoader message="Loading your care space..." />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<PublicOnlyRoute><LoginScreen /></PublicOnlyRoute>} />
                  <Route path="/home" element={<ProtectedRoute><HomeDashboard /></ProtectedRoute>} />
                  <Route path="/doctors" element={<ProtectedRoute><DoctorsScreen /></ProtectedRoute>} />
                  <Route path="/doctors/:doctorId" element={<ProtectedRoute><DoctorDetailsScreen /></ProtectedRoute>} />
                  <Route path="/doctors/:doctorId/book" element={<ProtectedRoute><BookAppointmentScreen /></ProtectedRoute>} />
                  <Route path="/appointments/success" element={<ProtectedRoute><AppointmentSuccessScreen /></ProtectedRoute>} />
                  <Route path="/appointments" element={<ProtectedRoute><AppointmentsScreen /></ProtectedRoute>} />
                  <Route path="/appointments/:appointmentId" element={<ProtectedRoute><AppointmentDetailsScreen /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />
                  <Route path="/notifications/:notificationId" element={<ProtectedRoute><NotificationDetailsScreen /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
                  <Route path="/profile/edit" element={<ProtectedRoute><EditProfileScreen /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
                  <Route path="/help-support" element={<ProtectedRoute><HelpSupportScreen /></ProtectedRoute>} />
                  <Route path="/contact-us" element={<ProtectedRoute><ContactUsScreen /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </Suspense>
            </AppExperience></NotificationsProvider>
          </BrowserRouter>
        </GlobalLoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
