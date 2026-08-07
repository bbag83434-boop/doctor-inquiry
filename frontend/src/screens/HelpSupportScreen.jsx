import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const faqs = [
  ['How do I edit my profile?', 'Open Profile from the bottom navigation, then choose Edit profile to update your placeholder details.'],
  ['How do appointment reminders work?', 'When notifications are on, care updates and appointment reminders appear in the Notifications area.'],
  ['Can I change the app theme?', 'Yes. Open Settings and use the Dark mode toggle to switch between light and dark themes.'],
];

export function HelpSupportScreen() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(0);
  return <div className="profile-shell app-transition"><main className="profile-page profile-page--subpage"><header className="subpage-header"><button type="button" onClick={() => navigate(-1)} aria-label="Go back">‹</button><div><p>We are here for you</p><h1>Help &amp; support</h1></div></header><section className="help-hero"><span>♡</span><div><h2>How can we help?</h2><p>Find quick answers or reach our friendly support team.</p></div></section><section className="faq-list"><h2>Frequently asked questions</h2>{faqs.map(([question, answer], index) => <article key={question} className={open === index ? 'faq faq--open' : 'faq'}><button type="button" onClick={() => setOpen(open === index ? -1 : index)}><span>{question}</span><b>{open === index ? '−' : '+'}</b></button>{open === index && <p>{answer}</p>}</article>)}</section><button type="button" className="profile-primary-action" onClick={() => navigate('/contact-us')}>Contact support</button></main></div>;
}
