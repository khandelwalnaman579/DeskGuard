/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getActiveSession, saveActiveSession, getBookingLogs, saveBookingLogs } from '../data/mockData';
export const sessionService = {
  /**
   * Fetch active session for current user with simulated API delay.
   */
  async getActiveSession() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return getActiveSession();
  },
  /**
   * Save or clear active session state.
   */
  async saveActiveSession(session) {
    await new Promise(resolve => setTimeout(resolve, 300));
    saveActiveSession(session);
  },
  /**
   * Fetch complete check-in study histories.
   */
  async getBookingLogs() {
    await new Promise(resolve => setTimeout(resolve, 355));
    return getBookingLogs();
  },
  /**
   * Append a new study session completed record.
   */
  async addBookingLog(log) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const logs = getBookingLogs();
    logs.unshift(log); // Prepend to show most recent first
    saveBookingLogs(logs);
  },

  /**
   * Alias matching future Express route: POST /api/sessions
   */
  async createSession(session) {
    return this.saveActiveSession(session);
  },

  /**
   * Alias matching future Express route: DELETE /api/sessions/:id
   */
  async endSession() {
    return this.saveActiveSession(null);
  }
};