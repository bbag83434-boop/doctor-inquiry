import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, saveProfile } from '../data/profile.js';

const fields = [
  ['fullName', 'Full name', 'text'], ['mobile', 'Mobile number', 'tel'], ['email', 'Email address', 'email'],
  ['gender', 'Gender', 'select'], ['dateOfBirth', 'Date of birth', 'text'], ['bloodGroup', 'Blood group', 'select'],
];

export function EditProfileScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState(getProfile);
  const [saved, setSaved] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => { event.preventDefault(); saveProfile(form); setSaved(true); window.setTimeout(() => navigate('/profile'), 700); };

  return <div className="profile-shell app-transition"><main className="profile-page profile-page--subpage">
    <header className="subpage-header"><button type="button" onClick={() => navigate(-1)} aria-label="Go back">‹</button><div><p>Profile settings</p><h1>Edit profile</h1></div></header>
    <form className="edit-profile-form" onSubmit={submit}>
      <div className="edit-avatar"><div className="profile-avatar">{form.photo}</div><button type="button" onClick={() => update('photo', form.photo === 'AM' ? 'AA' : 'AM')}>Change photo</button><small>Placeholder photo can be changed</small></div>
      <section className="profile-card"><div className="profile-section-heading"><div><p>Keep this up to date</p><h2>Personal details</h2></div></div>
        <div className="edit-fields">{fields.map(([key, label, type]) => <label key={key}><span>{label}</span>{type === 'select' ? <select value={form[key]} onChange={(event) => update(key, event.target.value)}>{(key === 'gender' ? ['Female', 'Male', 'Other', 'Prefer not to say'] : ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).map((option) => <option key={option}>{option}</option>)}</select> : <input required={key !== 'dateOfBirth'} type={type} value={form[key]} onChange={(event) => update(key, event.target.value)} />}</label>)}</div>
      </section>
      <button className="profile-primary-action" type="submit">{saved ? 'Profile saved ✓' : 'Save changes'}</button>
    </form>
  </main></div>;
}
