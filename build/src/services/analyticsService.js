/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const analyticsService = {
  /**
   * Fetch 24-hour occupancy trends.
   */
  async getOccupancyTrends() {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [{
      time: '08:00 AM',
      occupancyRate: 25,
      activeBookings: 12,
      availableSeats: 36
    }, {
      time: '10:00 AM',
      occupancyRate: 58,
      activeBookings: 28,
      availableSeats: 20
    }, {
      time: '12:00 PM',
      occupancyRate: 75,
      activeBookings: 36,
      availableSeats: 12
    }, {
      time: '02:00 PM',
      occupancyRate: 92,
      activeBookings: 44,
      availableSeats: 4
    }, {
      time: '04:00 PM',
      occupancyRate: 85,
      activeBookings: 41,
      availableSeats: 7
    }, {
      time: '06:00 PM',
      occupancyRate: 64,
      activeBookings: 31,
      availableSeats: 17
    }, {
      time: '08:00 PM',
      occupancyRate: 40,
      activeBookings: 19,
      availableSeats: 29
    }, {
      time: '10:00 PM',
      occupancyRate: 15,
      activeBookings: 7,
      availableSeats: 41
    }];
  },
  /**
   * Fetch weekly desk usage aggregates.
   */
  async getWeeklyUsage() {
    await new Promise(resolve => setTimeout(resolve, 450));
    return [{
      day: 'Mon',
      studyHours: 240,
      checkIns: 84,
      collabZoneHours: 110,
      silentZoneHours: 130
    }, {
      day: 'Tue',
      studyHours: 295,
      checkIns: 98,
      collabZoneHours: 125,
      silentZoneHours: 170
    }, {
      day: 'Wed',
      studyHours: 350,
      checkIns: 120,
      collabZoneHours: 160,
      silentZoneHours: 190
    }, {
      day: 'Thu',
      studyHours: 320,
      checkIns: 115,
      collabZoneHours: 140,
      silentZoneHours: 180
    }, {
      day: 'Fri',
      studyHours: 210,
      checkIns: 76,
      collabZoneHours: 100,
      silentZoneHours: 110
    }, {
      day: 'Sat',
      studyHours: 150,
      checkIns: 45,
      collabZoneHours: 85,
      silentZoneHours: 65
    }, {
      day: 'Sun',
      studyHours: 90,
      checkIns: 28,
      collabZoneHours: 40,
      silentZoneHours: 50
    }];
  },
  /**
   * Fetch monthly usage summaries for the past 6 months.
   */
  async getMonthlyUsage() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [{
      month: 'Jan',
      activeStudents: 180,
      totalHoursSpent: 850,
      averageSessionMinutes: 140
    }, {
      month: 'Feb',
      activeStudents: 210,
      totalHoursSpent: 990,
      averageSessionMinutes: 155
    }, {
      month: 'Mar',
      activeStudents: 340,
      totalHoursSpent: 1650,
      averageSessionMinutes: 180
    }, {
      month: 'Apr',
      activeStudents: 410,
      totalHoursSpent: 2100,
      averageSessionMinutes: 195
    }, {
      month: 'May',
      activeStudents: 480,
      totalHoursSpent: 2600,
      averageSessionMinutes: 210
    }, {
      month: 'Jun',
      activeStudents: 520,
      totalHoursSpent: 3120,
      averageSessionMinutes: 220
    }];
  },
  /**
   * Fetch hourly average bookings load.
   */
  async getPeakHours() {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [{
      hourCode: '08:00',
      hourLabel: '8 AM',
      averageOccupancy: 20,
      warningThreshold: 80
    }, {
      hourCode: '09:00',
      hourLabel: '9 AM',
      averageOccupancy: 38,
      warningThreshold: 80
    }, {
      hourCode: '10:00',
      hourLabel: '10 AM',
      averageOccupancy: 62,
      warningThreshold: 80
    }, {
      hourCode: '11:00',
      hourLabel: '11 AM',
      averageOccupancy: 78,
      warningThreshold: 80
    }, {
      hourCode: '12:00',
      hourLabel: '12 PM',
      averageOccupancy: 84,
      warningThreshold: 80
    }, {
      hourCode: '13:00',
      hourLabel: '1 PM',
      averageOccupancy: 72,
      warningThreshold: 80
    }, {
      hourCode: '14:00',
      hourLabel: '2 PM',
      averageOccupancy: 91,
      warningThreshold: 80
    }, {
      hourCode: '15:00',
      hourLabel: '3 PM',
      averageOccupancy: 88,
      warningThreshold: 80
    }, {
      hourCode: '16:00',
      hourLabel: '4 PM',
      averageOccupancy: 82,
      warningThreshold: 80
    }, {
      hourCode: '17:00',
      hourLabel: '5 PM',
      averageOccupancy: 67,
      warningThreshold: 80
    }, {
      hourCode: '18:00',
      hourLabel: '6 PM',
      averageOccupancy: 59,
      warningThreshold: 80
    }, {
      hourCode: '19:00',
      hourLabel: '7 PM',
      averageOccupancy: 50,
      warningThreshold: 80
    }, {
      hourCode: '20:00',
      hourLabel: '8 PM',
      averageOccupancy: 42,
      warningThreshold: 80
    }, {
      hourCode: '21:00',
      hourLabel: '9 PM',
      averageOccupancy: 28,
      warningThreshold: 80
    }, {
      hourCode: '22:00',
      hourLabel: '10 PM',
      averageOccupancy: 12,
      warningThreshold: 80
    }];
  },
  /**
   * Fetch abandoned desk sensor reports and resolution analytics.
   */
  async getAbandonedDeskAnalytics() {
    await new Promise(resolve => setTimeout(resolve, 450));
    return [{
      floor: 'Floor 1',
      timeoutTriggerCount: 14,
      averageInactivityMinutes: 32,
      resolvedByStaffCount: 8,
      resolvedByAutoReleaseCount: 6
    }, {
      floor: 'Floor 2',
      timeoutTriggerCount: 38,
      averageInactivityMinutes: 44,
      resolvedByStaffCount: 22,
      resolvedByAutoReleaseCount: 16
    }, {
      floor: 'Floor 3',
      timeoutTriggerCount: 22,
      averageInactivityMinutes: 38,
      resolvedByStaffCount: 12,
      resolvedByAutoReleaseCount: 10
    }];
  },

  /**
   * Alias matching future Express route: GET /api/analytics
   * Returns a combined snapshot used by admin dashboards.
   */
  async getAnalytics() {
    const [occupancyTrends, weeklyUsage, monthlyUsage, peakHours, abandonedDesks] = await Promise.all([
      this.getOccupancyTrends(),
      this.getWeeklyUsage(),
      this.getMonthlyUsage(),
      this.getPeakHours(),
      this.getAbandonedDeskAnalytics()
    ]);
    return { occupancyTrends, weeklyUsage, monthlyUsage, peakHours, abandonedDesks };
  }
};