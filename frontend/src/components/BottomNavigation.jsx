import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationsContext.jsx';

const navItems = [
  { label: 'Home', icon: '⌂' },
  { label: 'Appointments', icon: '▣' },
  { label: 'Notifications', icon: '♧' },
  { label: 'Profile', icon: '◉' },
];

export function BottomNavigation({ activeItem = 'Home' }) {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const destinations = { Home: '/home', Appointments: '/appointments', Notifications: '/notifications', Profile: '/profile' };
  return <nav className="bottom-nav" aria-label="Primary navigation"><div className="bottom-nav__inner">{navItems.map((item) => <button className={`bottom-nav__item${item.label === activeItem ? ' bottom-nav__item--active' : ''}`} type="button" key={item.label} onClick={destinations[item.label] ? () => navigate(destinations[item.label]) : undefined} aria-current={item.label === activeItem ? 'page' : undefined}><span className="bottom-nav__icon bottom-nav__icon--badge" aria-hidden="true">{item.icon}{item.label === 'Notifications' && unreadCount > 0 && <i>{unreadCount > 9 ? '9+' : unreadCount}</i>}</span>{item.label}</button>)}</div></nav>;
}
