import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation } from '../components/BottomNavigation.jsx';
import { NotificationIcon } from '../components/NotificationIcon.jsx';
import { useNotifications } from '../context/NotificationsContext.jsx';

const filters = ['All', 'Appointment', 'Reminder', 'Report', 'System'];

export function NotificationsScreen() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllAsRead, removeNotification } = useNotifications();
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pullStart, setPullStart] = useState(null);
  const [pullDistance, setPullDistance] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 560);
    return () => window.clearTimeout(timer);
  }, []);

  const visibleNotifications = useMemo(() => notifications.filter((notification) => filter === 'All' || notification.category === filter), [filter, notifications]);
  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 750);
  };
  const onTouchStart = (event) => { if (window.scrollY === 0) setPullStart(event.touches[0].clientY); };
  const onTouchMove = (event) => { if (pullStart !== null) setPullDistance(Math.max(0, Math.min(72, event.touches[0].clientY - pullStart))); };
  const onTouchEnd = () => { if (pullDistance > 52) refresh(); setPullStart(null); setPullDistance(0); };

  return <div className="notifications-shell app-transition" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
    <main className="notifications-page" aria-label="Notification center">
      <div className={`notifications-refresh${refreshing ? ' notifications-refresh--active' : ''}`} style={{ height: pullDistance || undefined }} aria-live="polite"><span className="loader" />{refreshing ? 'Refreshing your updates' : pullDistance > 52 ? 'Release to refresh' : 'Pull to refresh'}</div>
      <header className="notifications-header"><div><p>Care updates</p><h1>Notifications</h1><span>Everything important, in one calm place.</span></div>{unreadCount > 0 && <button type="button" className="mark-all-button" onClick={markAllAsRead}>Mark all read</button>}</header>
      <section className="reminder-card" aria-label="Upcoming appointment reminder"><div className="reminder-card__top"><span className="reminder-card__icon" aria-hidden="true">◷</span><span>Next appointment</span></div><div><p>Tomorrow · 10:30 AM</p><h2>Dr. Priya Sharma</h2><span>General consultation · Video visit</span></div><button type="button" onClick={() => navigate('/appointments')}>View appointment <b aria-hidden="true">›</b></button></section>
      <section className="tips-card" aria-label="Daily health tip"><div className="tips-card__emoji" aria-hidden="true">✦</div><div><p>Health tip for today</p><h2>A 10-minute walk after meals can support steadier energy.</h2><span>Small habits make a meaningful difference.</span></div></section>
      <div className="notification-filter-row" role="tablist" aria-label="Filter notifications">{filters.map((item) => <button key={item} type="button" role="tab" aria-selected={filter === item} className={filter === item ? 'notification-filter notification-filter--active' : 'notification-filter'} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <section className="notifications-list" aria-live="polite"><div className="notifications-list__heading"><h2>{filter === 'All' ? 'Recent updates' : `${filter} updates`}</h2>{unreadCount > 0 && <span>{unreadCount} unread</span>}</div>{loading ? <NotificationSkeleton /> : visibleNotifications.length ? visibleNotifications.map((notification) => <article className={`notification-row${notification.unread ? ' notification-row--unread' : ''}`} key={notification.id}><button type="button" className="notification-row__main" onClick={() => navigate(`/notifications/${notification.id}`)}><NotificationIcon name={notification.icon} className={`notification-icon--${notification.accent}`} /><span className="notification-row__copy"><span className="notification-row__titleline"><strong>{notification.title}</strong><time>{notification.time}</time></span><span>{notification.message}</span></span>{notification.unread && <i className="unread-dot" aria-label="Unread" />}</button><button type="button" className="notification-delete" onClick={() => removeNotification(notification.id)} aria-label={`Delete ${notification.title}`}>×</button></article>) : <EmptyNotifications onReset={() => setFilter('All')} />}</section>
    </main><BottomNavigation activeItem="Notifications" />
  </div>;
}

function NotificationSkeleton() { return <div className="notification-skeletons" aria-label="Loading notifications"><div /><div /><div /></div>; }
function EmptyNotifications({ onReset }) { return <div className="notifications-empty"><span aria-hidden="true">◌</span><h2>You&apos;re all caught up</h2><p>There are no {"new "}notifications in this view. We&apos;ll keep your care updates right here.</p><button type="button" onClick={onReset}>View all notifications</button></div>; }
