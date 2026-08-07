const navItems = [
  { label: 'Home', icon: '⌂' },
  { label: 'Appointments', icon: '▣' },
  { label: 'Notifications', icon: '♧' },
  { label: 'Profile', icon: '◉' },
];

export function BottomNavigation({ activeItem = 'Home' }) {
  const navigate = useNavigate();
  return <nav className="bottom-nav" aria-label="Primary navigation"><div className="bottom-nav__inner">{navItems.map((item) => <button className={`bottom-nav__item${item.label === activeItem ? ' bottom-nav__item--active' : ''}`} type="button" key={item.label} onClick={item.label === 'Home' ? () => navigate('/home') : undefined} aria-current={item.label === activeItem ? 'page' : undefined}><span className="bottom-nav__icon" aria-hidden="true">{item.icon}</span>{item.label}</button>)}</div></nav>;
}
import { useNavigate } from 'react-router-dom';
