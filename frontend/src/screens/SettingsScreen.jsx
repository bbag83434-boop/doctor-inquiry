import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { getSettings, saveSettings } from '../data/profile.js';

export function SettingsScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState(getSettings);
  const [dialog, setDialog] = useState(null);
  const update = (next) => { const updated = { ...settings, ...next }; setSettings(updated); saveSettings(updated); };
  const logoutNow = async () => { try { await logout(); } finally { navigate('/login', { replace: true }); } };
  const info = { privacy: ['Privacy policy', 'Your personal data is used only to make this placeholder care experience feel personal. No profile data is sent to a server.'], terms: ['Terms & conditions', 'This is a demo experience using placeholder data. It does not provide medical advice or replace a healthcare professional.'], about: ['About Doctor Inquiry', 'Doctor Inquiry helps people organize care, appointments and useful health information in one calm space. Version 1.0.0.'], password: ['Change password', 'Password changing is available as a user-interface preview in this phase. No authentication settings are changed.'] };

  return <div className="profile-shell app-transition"><main className="profile-page profile-page--subpage">
    <header className="subpage-header"><button type="button" onClick={() => navigate(-1)} aria-label="Go back">‹</button><div><p>Preferences</p><h1>Settings</h1></div></header>
    <section className="settings-group"><p className="settings-group__label">Appearance</p><div className="settings-card"><div className="settings-row"><span className="settings-row__icon">☾</span><div><strong>Dark mode</strong><small>Use a calmer dark appearance</small></div><Toggle checked={theme === 'dark'} onChange={toggleTheme} label="Toggle dark mode" /></div><div className="settings-row"><span className="settings-row__icon">文</span><div><strong>Language</strong><small>Choose your preferred language</small></div><select className="settings-select" value={settings.language} onChange={(event) => update({ language: event.target.value })} aria-label="Language"><option>English</option><option>বাংলা</option></select></div></div></section>
    <section className="settings-group"><p className="settings-group__label">Care preferences</p><div className="settings-card"><div className="settings-row"><span className="settings-row__icon">♧</span><div><strong>Notifications</strong><small>Appointment and care updates</small></div><Toggle checked={settings.notifications} onChange={() => update({ notifications: !settings.notifications })} label="Toggle notifications" /></div><ActionRow icon="⌁" title="Change password" subtitle="Update your sign-in password" onClick={() => setDialog('password')} /></div></section>
    <section className="settings-group"><p className="settings-group__label">About</p><div className="settings-card"><ActionRow icon="◌" title="Privacy policy" onClick={() => setDialog('privacy')} /><ActionRow icon="§" title="Terms & conditions" onClick={() => setDialog('terms')} /><ActionRow icon="i" title="About app" subtitle="Version 1.0.0" onClick={() => setDialog('about')} /></div></section>
    <button type="button" className="logout-button" onClick={() => setDialog('logout')}>↪ <span>Log out</span></button>
  </main>{dialog && <Dialog title={dialog === 'logout' ? 'Log out of Doctor Inquiry?' : info[dialog][0]} text={dialog === 'logout' ? 'You can sign back in whenever you are ready.' : info[dialog][1]} confirm={dialog === 'logout' ? 'Log out' : 'Done'} danger={dialog === 'logout'} onClose={() => setDialog(null)} onConfirm={dialog === 'logout' ? logoutNow : () => setDialog(null)} />}</div>;
}

function Toggle({ checked, onChange, label }) { return <button className={`toggle${checked ? ' toggle--on' : ''}`} type="button" onClick={onChange} aria-label={label} aria-pressed={checked}><span /></button>; }
function ActionRow({ icon, title, subtitle, onClick }) { return <button type="button" className="settings-row settings-row--button" onClick={onClick}><span className="settings-row__icon">{icon}</span><span><strong>{title}</strong>{subtitle && <small>{subtitle}</small>}</span><b aria-hidden="true">›</b></button>; }
function Dialog({ title, text, confirm, danger, onClose, onConfirm }) { return <div className="settings-dialog-backdrop" role="presentation"><section className="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><span className={`settings-dialog__icon${danger ? ' settings-dialog__icon--danger' : ''}`}>{danger ? '↪' : 'i'}</span><h2 id="dialog-title">{title}</h2><p>{text}</p><div><button type="button" onClick={onClose}>Cancel</button><button type="button" className={danger ? 'danger' : 'confirm'} onClick={onConfirm}>{confirm}</button></div></section></div>; }
