import { createContext, useContext, useMemo, useState } from 'react';
import { initialNotifications } from '../data/notifications.js';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const value = useMemo(() => ({
    notifications,
    unreadCount: notifications.filter((notification) => notification.unread).length,
    markAsRead: (id) => setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, unread: false } : notification)),
    markAllAsRead: () => setNotifications((current) => current.map((notification) => ({ ...notification, unread: false }))),
    removeNotification: (id) => setNotifications((current) => current.filter((notification) => notification.id !== id)),
  }), [notifications]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationsProvider');
  return context;
}
