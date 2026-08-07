import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { doctors } from '../data/doctors.js';

const timeSlots = ['09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(date) {
  if (!date) return 'Choose a date';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

export function BookAppointmentScreen() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const doctor = doctors.find((item) => item.id === doctorId);
  const [form, setForm] = useState({ date: getToday(), time: timeSlots[1], patientName: '', age: '', gender: '', mobile: '', symptoms: '' });
  const [isConfirming, setIsConfirming] = useState(false);
  const formattedDate = useMemo(() => formatDate(form.date), [form.date]);

  if (!doctor) return <Navigate to="/doctors" replace />;

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const confirmAppointment = (event) => {
    event.preventDefault();
    setIsConfirming(true);
    window.setTimeout(() => navigate('/appointments/success', {
      replace: true,
      state: { appointment: { ...form, dateLabel: formattedDate, id: `DI-${Date.now().toString().slice(-6)}` }, doctor },
    }), 1450);
  };

  return <main className="appointment-page" aria-label="Book appointment">
    <header className="appointment-page__header"><button className="appointment-back" type="button" onClick={() => navigate(`/doctors/${doctor.id}`)} aria-label="Back to doctor details">‹</button><div><p>Appointment booking</p><h1>Choose your visit</h1></div></header>
    <section className="booking-doctor-card" aria-label="Selected doctor"><div className={`doctor-avatar doctor-avatar--${doctor.color}`} aria-hidden="true">{doctor.name.split(' ').slice(1).map((name) => name[0]).join('')}</div><div><span>{doctor.specialty}</span><h2>{doctor.name}</h2><p>★ {doctor.rating} · {doctor.experience} experience</p></div><strong>{doctor.fee}</strong></section>
    <form className="booking-form" onSubmit={confirmAppointment}>
      <section className="booking-section"><div className="booking-section__title"><span>01</span><div><h2>When would you like to visit?</h2><p>Pick a date and an available time.</p></div></div><label className="booking-field"><span>Date</span><input name="date" value={form.date} min={getToday()} onChange={updateField} type="date" required /></label><div className="time-slots" role="group" aria-label="Available appointment times">{timeSlots.map((slot) => <button className={`time-slot${form.time === slot ? ' time-slot--selected' : ''}`} type="button" onClick={() => setForm((current) => ({ ...current, time: slot }))} key={slot}>{slot}</button>)}</div></section>
      <section className="booking-section"><div className="booking-section__title"><span>02</span><div><h2>Patient details</h2><p>These details are only kept on this device for the demo.</p></div></div><div className="booking-fields"><label className="booking-field booking-field--wide"><span>Patient name</span><input name="patientName" value={form.patientName} onChange={updateField} placeholder="Enter full name" required /></label><label className="booking-field"><span>Age</span><input name="age" value={form.age} onChange={updateField} min="1" max="120" inputMode="numeric" type="number" placeholder="Age" required /></label><label className="booking-field"><span>Gender</span><select name="gender" value={form.gender} onChange={updateField} required><option value="" disabled>Select</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label><label className="booking-field booking-field--wide"><span>Mobile number</span><input name="mobile" value={form.mobile} onChange={updateField} inputMode="tel" pattern="[0-9]{10}" placeholder="10-digit mobile number" type="tel" required /></label><label className="booking-field booking-field--wide"><span>Symptoms <em>Optional</em></span><textarea name="symptoms" value={form.symptoms} onChange={updateField} placeholder="Briefly describe what you need help with" rows="4" /></label></div></section>
      <aside className="appointment-summary" aria-label="Appointment summary"><div><span>Appointment summary</span><strong>{doctor.fee}</strong></div><dl><div><dt>Doctor</dt><dd>{doctor.name}</dd></div><div><dt>Date</dt><dd>{formattedDate}</dd></div><div><dt>Time</dt><dd>{form.time}</dd></div><div><dt>Patient</dt><dd>{form.patientName || 'Your name'}</dd></div></dl></aside>
      <Button fullWidth type="submit" className="confirm-button">Confirm Appointment <span aria-hidden="true">→</span></Button>
    </form>
    {isConfirming && <div className="appointment-loader" role="status" aria-live="assertive"><div className="appointment-loader__card"><div className="appointment-loader__pulse"><span>+</span></div><h2>Confirming your visit</h2><p>Securing your preferred time with {doctor.name}.</p><div className="appointment-loader__progress"><i /></div></div></div>}
  </main>;
}
