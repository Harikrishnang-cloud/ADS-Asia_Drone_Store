import { create } from 'zustand';
import { Notification } from '@/components/layout/dropdowns/NotificationDropdown';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    setNotifications: (notifications) => {
        const unread = notifications.filter(n => !n.read).length;
        set({ notifications, unreadCount: unread });
    },
    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1
    })),
    markAsRead: (id) => set((state) => {
        const updated = state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
        );
        const unread = updated.filter(n => !n.read).length;
        return { notifications: updated, unreadCount: unread };
    }),
    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
    })),
}));
