"use client";

import React from "react";
import Link from "next/link";
import { Bell, Clock, Info, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

interface NotificationDropdownProps {
  notifications?: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export function NotificationDropdown({ 
  notifications = [], 
  onMarkRead,
  onMarkAllRead 
}: NotificationDropdownProps) {
  const isEmpty = notifications.length === 0;

  const [now, setNow] = useState<number>(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timestamp: number) => {
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} mins ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hrs ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error': return <Info size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-brand-blue" />;
    }
  };

  return (
    <div className="absolute top-[120%] right-0 w-80 md:w-[400px] bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right border border-slate-100 overflow-hidden translate-y-4 group-hover:translate-y-0 z-[100]">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Bell size={18} className="text-brand-orange" />
          Notifications
        </h3>
        {!isEmpty && (
          <button 
            onClick={onMarkAllRead}
            className="text-xs font-semibold text-brand-blue hover:text-brand-orange transition-colors">
            Mark all read
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {isEmpty ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Bell size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-900 font-bold text-sm mb-1">No new notifications</p>
            <p className="text-slate-500 text-xs">We&apos;ll notify you when something important happens.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer relative group/notif ${!notif.read ? 'bg-brand-blue/5' : ''}`}
                onClick={() => onMarkRead?.(notif.id)}
              >
                {!notif.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-brand-blue rounded-full"></div>
                )}
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'success' ? 'bg-green-50' : 
                    notif.type === 'warning' ? 'bg-amber-50' : 
                    notif.type === 'error' ? 'bg-red-50' : 'bg-blue-50'
                  }`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold text-slate-900 mb-1 ${!notif.read ? 'pr-4' : ''}`}>{notif.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">{notif.message}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      <Clock size={10} />
                      {formatTime(notif.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-center">
        <Link 
          href="/user/notifications"
          className="text-sm font-bold text-brand-blue hover:text-brand-orange transition-colors inline-flex items-center gap-2"
        >
          View all notifications
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
