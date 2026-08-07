const icons = {
  calendar: '▣',
  bell: '◌',
  report: '▤',
  shield: '✦',
};

export function NotificationIcon({ name, className = '' }) {
  return <span className={`notification-icon ${className}`} aria-hidden="true">{icons[name] || '•'}</span>;
}
