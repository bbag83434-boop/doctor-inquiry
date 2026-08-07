import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation } from '../components/BottomNavigation.jsx';
import { appointments } from '../data/appointments.js';
import { doctors } from '../data/doctors.js';

const filters = ['All', 'Upcoming', 'Completed', 'Cancelled'];

export function AppointmentsScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const visibleAppointments = useMemo(() => appointments.filter((appointment) => {
    const doctor = doctors.find((item) => item.id === appointment.doctorId);
    const matchesFilter = filter === 'All' || appointment.status === filter;
    const searchText = `${doctor?.name} ${doctor?.specialty} ${appointment.id} ${appointment.date}`.toLowerCase();
    return matchesFilter && searchText.includes(query.trim().toLowerCase());
  }), [filter, query]);
  return <div className="appointments-shell app-transition"><main className="appointments-list" aria-label="My appointments"><header className="appointments-list__header"><p>Your care schedule</p><h1>My appointments</h1><span>Keep every consultation in one calm place.</span></header><label className="appointments-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search doctor or specialty" aria-label="Search appointments" /></label><div className="appointment-filters" role="tablist" aria-label="Filter appointments">{filters.map((item) => <button key={item} type="button" role="tab" aria-selected={filter === item} className={filter === item ? 'appointment-filter appointment-filter--active' : 'appointment-filter'} onClick={() => setFilter(item)}>{item}</button>)}</div><section className="appointments-results" aria-live="polite"><div className="appointments-results__heading"><h2>{filter === 'All' ? 'All appointments' : `${filter} appointments`}</h2><span>{visibleAppointments.length} {visibleAppointments.length === 1 ? 'visit' : 'visits'}</span></div>{visibleAppointments.length ? <div className="appointments-stack">{visibleAppointments.map((appointment) => { const doctor = doctors.find((item) => item.id === appointment.doctorId); const initials = doctor.name.split(' ').slice(1).map((name) => name[0]).join(''); return <button className="appointments-card" type="button" key={appointment.id} onClick={() => navigate(`/appointments/${appointment.id}`)}><div className={`appointments-card__avatar doctor-avatar doctor-avatar--${doctor.color}`} aria-hidden="true">{initials}</div><div className="appointments-card__content"><div className="appointments-card__topline"><span className="appointments-card__specialty">{doctor.specialty}</span><span className={`status-badge status-badge--${appointment.status.toLowerCase()}`}>{appointment.status}</span></div><h2>{doctor.name}</h2><p>{appointment.date} <i>•</i> {appointment.time}</p></div><span className="appointments-card__arrow" aria-hidden="true">›</span></button>; })}</div> : <div className="appointments-empty"><div aria-hidden="true">◌</div><h2>No appointments found</h2><p>Try another search or choose a different filter to view your care schedule.</p><button type="button" onClick={() => { setFilter('All'); setQuery(''); }}>Clear filters</button></div>}</section></main><BottomNavigation activeItem="Appointments" /></div>;
}
