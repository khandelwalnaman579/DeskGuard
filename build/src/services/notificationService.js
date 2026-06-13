/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  getActivityNotifications,
  saveActivityNotifications
} from '../data/mockData';

// In the future this maps to Express routes:
// GET    /api/notifications
// POST   /api/notifications
// DELETE /api/notifications/:id
// PATCH  /api/notifications/:id/read
export const notificationService = {
  /**
   * Simulate GET /api/notifications
   */
  async getNotifications() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getActivityNotifications();
  },

  /**
   * Simulate POST /api/notifications
   */
  async createNotification(title, description, type, deskId) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const newNotif = {
      id: 'N' + Date.now(),
      timestamp: 'Just now',
      title,
      description,
      type,
      deskId
    };
    const updated = [newNotif, ...getActivityNotifications()];
    saveActivityNotifications(updated);
    return newNotif;
  },

  /**
   * Simulate DELETE /api/notifications/:id
   */
  async clearNotification(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const updated = getActivityNotifications().filter((n) => n.id !== id);
    saveActivityNotifications(updated);
    return true;
  },

  /**
   * Simulate DELETE /api/notifications
   */
  async clearAll() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    saveActivityNotifications([]);
    return true;
  }
};
