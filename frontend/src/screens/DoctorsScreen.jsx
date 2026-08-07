import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { DashboardHeader } from '../components/DashboardHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { doctors, specialties } from '../data/doctors.js';

export function DoctorsScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const filteredDoctors = useMemo(() => doctors.filter((doctor) => (specialty === 'All' || doctor.specialty === specialty) && doctor.name.toLowerCase().includes(query.trim().toLowerCase())), [query, specialty]);

  return <main className="doctors-page" aria-label="Doctors directory">
    <DashboardHeader name={user?.name} />
    <section className="directory-intro"><p>Find your care expert</p><h2>Doctors who put you first.</h2><span>Browse trusted specialists and choose care that fits your day.</span></section>
    <label className="directory-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search by doctor name" aria-label="Search doctors by name" /></label>
    <section className="specialty-filter" aria-labelledby="specialty-title"><div className="directory-section-title"><h3 id="specialty-title">Specialties</h3><span>{filteredDoctors.length} doctors</span></div><div className="specialty-chips"><button type="button" onClick={() => setSpecialty('All')} className={specialty === 'All' ? 'specialty-chip specialty-chip--active' : 'specialty-chip'}>All</button>{specialties.map((item) => <button type="button" key={item} onClick={() => setSpecialty(item)} className={specialty === item ? 'specialty-chip specialty-chip--active' : 'specialty-chip'}>{item}</button>)}</div></section>
    <section className="doctor-list" aria-live="polite">{filteredDoctors.map((doctor, index) => <article className="doctor-card" style={{ '--card-delay': `${index * 65}ms` }} key={doctor.id} onClick={() => navigate(`/doctors/${doctor.id}`)}><div className={`doctor-avatar doctor-avatar--${doctor.color}`} aria-hidden="true">{doctor.name.split(' ').slice(1).map((name) => name[0]).join('')}</div><div className="doctor-card__body"><div><h3>{doctor.name}</h3><p>{doctor.specialty}</p></div><div className="doctor-card__meta"><span>{doctor.experience} exp.</span><span>★ {doctor.rating}</span></div><strong className="availability-dot">{doctor.availability}</strong></div><Button variant="secondary" className="doctor-card__button" onClick={(event) => { event.stopPropagation(); navigate(`/doctors/${doctor.id}`); }}>View profile</Button></article>)}{!filteredDoctors.length && <div className="directory-empty"><span aria-hidden="true">⌕</span><h3>No doctors found</h3><p>Try another name or specialty.</p></div>}</section>
  </main>;
}
