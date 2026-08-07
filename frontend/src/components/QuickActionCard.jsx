export function QuickActionCard({ icon, title, description, accent = 'blue', onClick }) {
  return <button type="button" className={`quick-action quick-action--${accent}`} aria-label={title} onClick={onClick}><span className="quick-action__icon" aria-hidden="true">{icon}</span><span className="quick-action__title">{title}</span><span className="quick-action__description">{description}</span></button>;
}
