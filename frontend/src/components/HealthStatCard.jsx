export function HealthStatCard({ label, value, note, icon, tone = 'blue' }) {
  return <article className={`health-stat health-stat--${tone}`}><span className="health-stat__icon" aria-hidden="true">{icon}</span><p>{label}</p><strong>{value}</strong><small>{note}</small></article>;
}
