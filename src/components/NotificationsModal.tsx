/**
 * Notifications Center Drawer
 */

import React from 'react';
import { Bell, CheckCheck, X, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { store } from '../services/store';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  if (!isOpen) return null;

  const state = store.getState();
  const notifications = state.notifications;

  const handleItemClick = (notif: NotificationItem) => {
    store.markNotificationAsRead(notif.id);
    if (notif.linkRoute?.includes('application')) {
      onNavigateTab('applications');
    } else if (notif.linkRoute?.includes('payment')) {
      onNavigateTab('payments');
    }
    onClose();
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'action_required':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm">Notifications & Reminders</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => store.markAllNotificationsAsRead()}
              className="text-stone-300 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button 
              onClick={onClose}
              className="text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-4 hover:bg-stone-50 transition-colors cursor-pointer flex items-start gap-3 ${
                  !notif.isRead ? 'bg-amber-50/40' : ''
                }`}
              >
                <div className="mt-0.5">{getIcon(notif.type)}</div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className={`font-semibold ${!notif.isRead ? 'text-stone-900 font-bold' : 'text-stone-700'}`}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0"></span>
                    )}
                  </div>
                  <p className="text-stone-600 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-stone-400 text-xs">
              No notifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
