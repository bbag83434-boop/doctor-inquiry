import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { BottomNavigation } from '../components/BottomNavigation.jsx';
import { appointments } from '../data/appointments.js';
import { doctors } from '../data/doctors.js';

export function AppointmentDetailsScreen() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const appointment = appointments.find((item) => item.id === appointmentId);
  const doctor = doctors.find((item) => item.id === appointment?.doctorId);
  if (!appointment || !doctor) return <Navigate to="/appointments" replace />;
  const status = isCancelled ? 'Cancelled' : appointment.status;
  const initials = doctor.name.split(' ').slice(1).map((name) => name[0]).join('');
  const canManage = status === 'Upcoming';
  return <div className="appointment-details-shell app-transition"><main className="appointment-details" aria-label={`Appointment ${appointment.id}`}><header className="appointment-details__header"><button type="button" onClick={() => navigate('/appointments')} aria-label="Back to appointments">‹</button><div><p>Appointment details</p><h1>Your visit</h1></div></header><section className="appointment-ticket"><div className="appointment-ticket__top"><span>Appointment ID</span><strong>{appointment.id}</strong></div><div className="appointment-ticket__date"><div><b>{appointment.day}</b><strong>{appointment.date.split(' ')[0]}</strong><span>{appointment.date.split(' ')[1]}</span></div><section><span className={`status-badge status-badge--${status.toLowerCase()}`}>{status}</span><h2>{appointment.time}</h2><p>In-clinic consultation</p></section></div></section><section className="details-panel"><p className="details-panel__eyebrow">Your doctor</p><div className="details-doctor"><div className={`doctor-avatar doctor-avatar--${doctor.color}`} aria-hidden="true">{initials}</div><div><h2>{doctor.name}</h2><p>{doctor.specialty}</p><span>{doctor.experience} experience</span></div></div></section><section className="details-panel"><p className="details-panel__eyebrow">Patient information</p><dl className="details-list"><div><dt>Name</dt><dd>{appointment.patient.name}</dd></div><div><dt>Age</dt><dd>{appointment.patient.age}</dd></div><div><dt>Phone</dt><dd>{appointment.patient.phone}</dd></div></dl></section><section className="details-panel"><p className="details-panel__eyebrow">Symptoms shared</p><p className="details-symptoms">{appointment.symptoms}</p></section>{canManage && <section className="details-actions"><button type="button" className="button button--secondary button--full" onClick={() => window.alert('Reschedule options will be available soon.')}>Reschedule</button><button type="button" className="button appointment-cancel-button button--full" onClick={() => setShowDialog(true)}>Cancel appointment</button></section>}</main><BottomNavigation activeItem="Appointments" />{showDialog && <div className="cancel-dialog" role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="cancel-title" className="cancel-dialog__card"><span className="cancel-dialog__icon" aria-hidden="true">!</span><h2 id="cancel-title">Cancel this appointment?</h2><p>This will mark your visit with {doctor.name} as cancelled. You can book another time whenever you are ready.</p><div><button type="button" className="button button--ghost" onClick={() => setShowDialog(false)}>Keep appointment</button><button type="button" className="button appointment-cancel-button" onClick={() => { setIsCancelled(true); setShowDialog(false); }}>Yes, cancel</button></div></section></div>}</div>;
}
