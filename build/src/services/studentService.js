/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getStudentAccounts, saveStudentAccounts } from '../data/mockData';
export const studentService = {
  /**
   * Fetch all students with simulated API delay.
   */
  async getStudents() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getStudentAccounts();
  },
  /**
   * Update student status (e.g. Active, Suspended, Flagged).
   */
  async updateStudentStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 450));
    const students = getStudentAccounts();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return false;
    students[index].status = status;
    saveStudentAccounts(students);
    return true;
  }
};