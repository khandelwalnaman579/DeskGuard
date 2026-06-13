/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getDesks, saveDesks } from '../data/mockData';
export const deskService = {
  /**
   * Fetch all desks with simulated API delay.
   */
  async getDesks() {
    await new Promise(resolve => setTimeout(resolve, 350));
    return getDesks();
  },
  /**
   * Fetch a single desk by ID.
   */
  async getDeskById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const desks = getDesks();
    return desks.find(d => d.id === id) || null;
  },
  /**
   * Update details of an existing desk.
   */
  async updateDesk(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const desks = getDesks();
    const index = desks.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error(`Desk with ID ${id} not found.`);
    }
    desks[index] = {
      ...desks[index],
      ...updates
    };
    saveDesks(desks);
    return desks[index];
  },
  /**
   * Book a desk for a student.
   */
  async bookDesk(deskId, studentId, studentName) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const desks = getDesks();
    const index = desks.findIndex(d => d.id === deskId);
    if (index === -1) return false;
    desks[index] = {
      ...desks[index],
      status: 'Occupied',
      studentId,
      studentName,
      lastActivityText: 'Active now',
      durationText: '0m'
    };
    saveDesks(desks);
    return true;
  },

  /**
   * Alias matching future Express route: GET /api/desks
   */
  async getAllDesks() {
    return this.getDesks();
  }
};