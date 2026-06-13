/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { STORAGE_KEYS } from '../constants';

// Simulated credential store. In the future this check happens server-side
// against PostgreSQL (Express route: POST /api/auth/login).
const MOCK_CREDENTIALS = {
  'student@deskguard.com': { password: 'password123', role: 'student' },
  'admin@deskguard.com': { password: 'password123', role: 'admin' }
};

export const authService = {
  /**
   * Simulate POST /api/auth/login
   */
  async login(email, password, expectedRole) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const normalizedEmail = (email || '').trim().toLowerCase();
    const record = MOCK_CREDENTIALS[normalizedEmail];

    // Allow blank/demo credentials to fall back to role-based mock login,
    // but if an email is provided it must match the known accounts.
    if (normalizedEmail && record) {
      if (record.password !== password) {
        throw new Error('Invalid email or password.');
      }
      if (expectedRole && record.role !== expectedRole) {
        throw new Error('Insufficient permissions for this portal.');
      }
    }

    return { success: true, role: expectedRole || (record ? record.role : 'student') };
  },

  /**
   * Simulate POST /api/auth/register
   */
  async register(name, studentId, email, password) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (!name || !studentId || !email) {
      throw new Error('Missing required registration fields.');
    }
    return { success: true };
  },

  /**
   * Simulate POST /api/auth/logout
   */
  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return { success: true };
  },

  /**
   * Simulate GET /api/auth/session (session persistence check)
   */
  async getSession() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
};
