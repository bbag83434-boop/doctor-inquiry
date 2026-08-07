import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation } from '../components/BottomNavigation.jsx';
import { getProfile } from '../data/profile.js';

const details = [
  ['Mobile number', 'mobile', '☎'],
  ['Email address', 'email', '✉'],
  ['Gender', 'gender', '◉'],
  ['Date of birth', 'dateOfBirth', '◷'],
  ['Blood group', 'bloodGroup', '✦'],
];

export function ProfileScreen() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getProfile);

  useEffect(() => {
    const syncProfile = () => setProfile(getProfile());
    window.addEventListener('focus', syncProfile);
    return () => window.removeEventListener('focus', syncProfile);
  }, []);

  return <div className="profile-shell app-transition">
    <main className="profile-page" aria-label="My profile">
      <section className="profile-hero">
        <div className="profile-hero__glow" />
        <button type="button" className="profile-hero__settings" onClick={() => navigate('/settings')} aria-label="Open settings">⚙</button>
        <div className="profile-avatar" aria-label={`${profile.fullName} profile photo`}>{profile.photo}</div>
        <p>Your care profile</p>
        <h1>{profile.fullName}</h1>
        <span>Member since 2024</span>
        <button type="button" className="profile-edit-button" onClick={() => navigate('/profile/edit')}>Edit profile <b aria-hidden="true">›</b></button>
      </section>

      <section className="profile-card" aria-labelledby="personal-details-title">
        <div className="profile-section-heading"><div><p>Personal information</p><h2 id="personal-details-title">Your details</h2></div><button type="button" onClick={() => navigate('/profile/edit')}>Edit</button></div>
        <div className="profile-details">{details.map(([label, key, icon]) => <div className="profile-detail" key={key}><span className="profile-detail__icon" aria-hidden="true">{icon}</span><div><small>{label}</small><strong>{profile[key]}</strong></div></div>)}</div>
      </section>

      <section className="profile-shortcuts" aria-label="Profile shortcuts">
        <button type="button" onClick={() => navigate('/help-support')}><span aria-hidden="true">?</span><div><strong>Help &amp; support</strong><small>Answers when you need them</small></div><b aria-hidden="true">›</b></button>
        <button type="button" onClick={() => navigate('/contact-us')}><span aria-hidden="true">✦</span><div><strong>Contact us</strong><small>We are here to help</small></div><b aria-hidden="true">›</b></button>
      </section>
    </main>
    <BottomNavigation activeItem="Profile" />
  </div>;
}
