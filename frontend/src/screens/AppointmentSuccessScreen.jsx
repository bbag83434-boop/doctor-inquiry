import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation } from '../components/BottomNavigation.jsx';
import { Button } from '../components/Button.jsx';

export function AppointmentSuccessScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const booking = state?.appointment;
  const doctor = state?.doctor;
  if (!booking || !doctor) return <Navigate to="/home" replace />;

  return <div className="appointment-success"><main className="appointment-success__content" aria-label="Appointment confirmed"><div className="success-mark" aria-hidden="true">✓</div><p className="success-eyebrow">Appointment confirmed</p><h1>You’re all set.</h1><p className="success-copy">Your consultation has been reserved. We look forward to caring for you.</p><section className="success-ticket"><div className="success-ticket__top"><span>Appointment ID</span><strong>{booking.id}</strong></div><div className="success-doctor"><div className={`doctor-avatar doctor-avatar--${doctor.color}`} aria-hidden="true">{doctor.name.split(' ').slice(1).map((name) => name[0]).join('')}</div><div><span>{doctor.specialty}</span><h2>{doctor.name}</h2></div></div><dl><div><dt>Date</dt><dd>{booking.dateLabel}</dd></div><div><dt>Time</dt><dd>{booking.time}</dd></div><div><dt>Patient</dt><dd>{booking.patientName}</dd></div></dl></section><Button fullWidth onClick={() => navigate('/home')}>Back to Home <span aria-hidden="true">→</span></Button></main><BottomNavigation activeItem="Appointments" /></div>;
}
