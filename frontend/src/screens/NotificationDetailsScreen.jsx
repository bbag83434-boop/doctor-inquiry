import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { NotificationIcon } from '../components/NotificationIcon.jsx';
import { useNotifications } from '../context/NotificationsContext.jsx';

export function NotificationDetailsScreen() {
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const { notifications, markAsRead, removeNotification } = useNotifications();
  const notification = notifications.find((item) => item.id === notificationId);
  if (!notification) return <Navigate to="/notifications" replace />;

  const dismiss = () => { removeNotification(notification.id); navigate('/notifications', { replace: true }); };
  return <div className="notification-details-shell app-transition"><main className="notification-details"><header className="notification-details__header"><button type="button" onClick={() => navigate(-1)} aria-label="Go back">‹</button><div><p>{notification.category}</p><h1>Notification details</h1></div></header><article className="notification-details-card"><NotificationIcon name={notification.icon} className={`notification-icon--${notification.accent}`} /><span className="notification-details-card__category">{notification.category}</span><h2>{notification.title}</h2><time>{notification.date}</time><p>{notification.message}</p>{notification.category === 'Reminder' && <div className="notification-details-card__note"><span aria-hidden="true">✓</span><p>Keeping reminders visible helps you make time for the care routine you chose.</p></div>}</article><div className="notification-details__actions">{notification.unread && <button type="button" className="button button--secondary" onClick={() => markAsRead(notification.id)}>Mark as read</button>}<button type="button" className="button button--ghost" onClick={dismiss}>Delete notification</button></div></main></div>;
}
