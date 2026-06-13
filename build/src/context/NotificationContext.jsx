/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pushNotification = useCallback(async (title, description, type, deskId) => {
    const created = await notificationService.createNotification(title, description, type, deskId);
    setNotifications((prev) => [created, ...prev]);
    return created;
  }, []);

  const dismissNotification = useCallback(async (id) => {
    await notificationService.clearNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(async () => {
    await notificationService.clearAll();
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, loading, refresh, pushNotification, dismissNotification, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
