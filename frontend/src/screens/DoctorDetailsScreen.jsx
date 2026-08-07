import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { doctors } from '../data/doctors.js';

export function DoctorDetailsScreen() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const doctor = doctors.find((item) => item.id === doctorId);
  if (!doctor) return <Navigate to="/doctors" replace />;
  return <main className="doctor-details" aria-label={`${doctor.name} profile`}>
    <button className="details-back" type="button" onClick={() => navigate('/doctors')} aria-label="Back to doctors">‹</button>
    <section className={`details-hero details-hero--${doctor.color}`}><div className={`doctor-avatar doctor-avatar--${doctor.color}`} aria-hidden="true">{doctor.name.split(' ').slice(1).map((name) => name[0]).join('')}</div><p>{doctor.specialty}</p><h1>{doctor.name}</h1><span>★ {doctor.rating} rating · {doctor.experience} experience</span></section>
    <section className="details-content"><div className="detail-highlight"><span>Consultation fee</span><strong>{doctor.fee}</strong><small>per appointment</small></div><div className="detail-grid"><div><span>Qualification</span><strong>{doctor.qualification}</strong></div><div><span>Languages</span><strong>{doctor.languages}</strong></div></div><section className="detail-section"><h2>About doctor</h2><p>{doctor.about}</p></section><section className="detail-section detail-hours"><h2>Working hours</h2><p><span aria-hidden="true">◷</span>{doctor.hours}</p></section></section>
    <div className="details-booking"><div><span>{doctor.availability}</span><strong>Book a consultation</strong></div><Button fullWidth onClick={() => undefined}>Book Appointment</Button></div>
  </main>;
}
