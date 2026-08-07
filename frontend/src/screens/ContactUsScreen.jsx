import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ContactUsScreen() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const submit = (event) => { event.preventDefault(); setSent(true); };
  return <div className="profile-shell app-transition"><main className="profile-page profile-page--subpage"><header className="subpage-header"><button type="button" onClick={() => navigate(-1)} aria-label="Go back">‹</button><div><p>Support is one message away</p><h1>Contact us</h1></div></header><section className="contact-options"><a href="mailto:support@doctorinquiry.demo"><span>✉</span><div><strong>Email us</strong><small>support@doctorinquiry.demo</small></div><b>›</b></a><a href="tel:+919876543210"><span>☎</span><div><strong>Call us</strong><small>Mon–Fri, 9 AM–6 PM</small></div><b>›</b></a></section><form className="contact-form profile-card" onSubmit={submit}><div className="profile-section-heading"><div><p>Send a message</p><h2>Tell us what you need</h2></div></div><label><span>Subject</span><input required placeholder="How can we help?" /></label><label><span>Message</span><textarea required rows="5" placeholder="Write your message here..." /></label><button type="submit" className="profile-primary-action">{sent ? 'Message sent ✓' : 'Send message'}</button>{sent && <p className="form-success">Thanks! This is a UI-only demo, so no message was sent.</p>}</form></main></div>;
}
