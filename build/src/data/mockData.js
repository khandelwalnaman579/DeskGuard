/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Seed Initial Desks matching the UI mocks
export const INITIAL_DESKS = [{
  id: 'D-201',
  floor: 2,
  zone: 'Quiet Zone',
  status: 'Available',
  lastActivityText: '14 mins ago'
}, {
  id: 'D-202',
  floor: 2,
  zone: 'Quiet Zone',
  status: 'Available',
  lastActivityText: 'Ready'
}, {
  id: 'D-203',
  floor: 2,
  zone: 'Quiet Zone',
  status: 'Occupied',
  studentName: 'Jameson Doe',
  studentId: 'UG-882910',
  lastActivityText: 'Active now',
  durationText: '2h 14m'
}, {
  id: 'D-204',
  floor: 2,
  zone: 'Quiet Zone',
  status: 'Occupied',
  studentName: 'Sarah Jenkins',
  studentId: '#2948102',
  lastActivityText: 'Active now',
  durationText: '2h 45m'
}, {
  id: 'D-205',
  floor: 2,
  zone: 'Quiet Zone',
  status: 'Occupied',
  studentName: 'Elena Rodriguez',
  studentId: 'U2391044',
  lastActivityText: 'Active now',
  durationText: '1h 20m'
}, {
  id: 'D-206',
  floor: 2,
  zone: 'Quiet Zone',
  status: 'Away',
  studentName: 'Alex Johnston',
  studentId: 'UG-882910',
  lastActivityText: 'Away for 12m',
  durationText: '2h 14m'
}, {
  id: 'D-207',
  floor: 2,
  zone: 'Quiet Zone',
  status: 'Available',
  lastActivityText: '2 hours ago'
}, {
  id: 'D-208',
  floor: 2,
  zone: 'Quiet Zone',
  status: 'Available',
  lastActivityText: 'Ready'
}, {
  id: 'D-209',
  floor: 2,
  zone: 'Collaborative',
  status: 'Disabled',
  lastActivityText: 'Under Maintenance'
}, {
  id: 'D-210',
  floor: 2,
  zone: 'Collaborative',
  status: 'Available',
  lastActivityText: 'Ready'
}, {
  id: 'D-211',
  floor: 2,
  zone: 'Collaborative',
  status: 'Occupied',
  studentName: 'Chloe Huang',
  studentId: 'STU-77341',
  lastActivityText: 'Active now',
  durationText: '3h 10m'
}, {
  id: 'D-212',
  floor: 2,
  zone: 'Collaborative',
  status: 'Available',
  lastActivityText: 'Ready'
}, {
  id: 'D-213',
  floor: 2,
  zone: 'Collaborative',
  status: 'Available',
  lastActivityText: 'Ready'
}, {
  id: 'D-214',
  floor: 2,
  zone: 'Collaborative',
  status: 'Occupied',
  studentName: 'Liam Kowalski',
  studentId: 'STU-91004',
  lastActivityText: 'Active now',
  durationText: '1h 05m'
}, {
  id: 'D-215',
  floor: 2,
  zone: 'Collaborative',
  status: 'Available',
  lastActivityText: 'Ready'
}, {
  id: 'D-216',
  floor: 2,
  zone: 'Collaborative',
  status: 'Occupied',
  studentName: 'Marcus Chen',
  studentId: 'U2394510',
  lastActivityText: 'Active now',
  durationText: '1h 14m'
},
// Floor 1 desks
{
  id: 'D-101',
  floor: 1,
  zone: 'Quiet Zone',
  status: 'Available',
  lastActivityText: 'Ready'
}, {
  id: 'D-102',
  floor: 1,
  zone: 'Quiet Zone',
  status: 'Occupied',
  studentName: 'Alex Johnston',
  studentId: 'UG-882910',
  lastActivityText: 'Active now',
  durationText: '2h 14m'
}, {
  id: 'D-103',
  floor: 1,
  zone: 'Quiet Zone',
  status: 'Away',
  studentName: 'Mark Thompson',
  studentId: 'STU-11234',
  lastActivityText: 'Away for 5m',
  durationText: '45m'
}, {
  id: 'D-104',
  floor: 1,
  zone: 'Quiet Zone',
  status: 'Disabled',
  lastActivityText: 'Power outlet issue'
},
// Floor 3 desks
{
  id: 'D-304',
  floor: 3,
  zone: 'Computer Lab',
  status: 'Away',
  studentName: 'James Wilson',
  studentId: 'U2391299',
  lastActivityText: 'Away for 15m',
  durationText: '2h'
}, {
  id: 'D-310',
  floor: 3,
  zone: 'Computer Lab',
  status: 'Occupied',
  studentName: 'Soren Raske',
  studentId: 'STU-82390',
  lastActivityText: 'Idle 22m',
  durationText: '5h 45m'
}];

// Seed Historical logs matching history mockup
export const INITIAL_BOOKING_LOGS = [{
  id: 'B1',
  deskId: 'Desk #402',
  date: 'Oct 24, 2023',
  checkIn: '09:15 AM',
  checkOut: '01:45 PM',
  duration: '4h 30m',
  status: 'Completed'
}, {
  id: 'B2',
  deskId: 'Desk #118',
  date: 'Oct 22, 2023',
  checkIn: '02:00 PM',
  checkOut: '05:30 PM',
  duration: '3h 30m',
  status: 'Completed'
}, {
  id: 'B3',
  deskId: 'Desk #205',
  date: 'Oct 21, 2023',
  checkIn: '-',
  checkOut: '-',
  duration: '0m',
  status: 'Cancelled'
}, {
  id: 'B4',
  deskId: 'Desk #310',
  date: 'Oct 20, 2023',
  checkIn: '10:00 AM',
  checkOut: '06:00 PM',
  duration: '8h 00m',
  status: 'Completed'
}, {
  id: 'B5',
  deskId: 'Desk #442',
  date: 'Oct 18, 2023',
  checkIn: '08:00 AM',
  checkOut: '11:30 AM',
  duration: '3h 30m',
  status: 'Completed'
}];

// Seed Students matching Student Management page
export const INITIAL_STUDENT_ACCOUNTS = [{
  id: 'S1',
  name: 'Jameson Doe',
  email: 'j.doe@university.edu',
  studentId: 'STU-94012',
  department: 'Computer Science',
  status: 'Active',
  activeDesk: 'F2-D42',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ9hUn9kvxYmVBgKjSZalPiJpp6U8CC_e05fxVOljCzm_O8mMEojdd-Zr7lTcpUvexkq-F_cb7O8zxml6eXB1zmVeK28l9ZSKR7KqdHpFcCKDoVqqTQlGOsYjCQP0IO5nAK_2--fLZ7FGD3qACMCK1zb0zEQMIYDBha-mFkDsXBIPDHScRucdKoO47KqbsDlJsVitM-uxVuD6BNbLA2hA_ozHARKzcHG3FSkDf3IXIicIOxCmvn6wXUWsBpCEIMEQGbTq6RnW5hQ2X'
}, {
  id: 'S2',
  name: 'Amara Miller',
  email: 'a.miller@university.edu',
  studentId: 'STU-88210',
  department: 'Literature & Arts',
  status: 'Suspended',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeC5TxtAyaEmlN5SMeVV6bHdmCtZStKAKErkPXbVeRlYR7cFzhVRkG9SDNZUNYsxdONw1Ixr_zoTVhAUMIbKz-OORW2ldDEeYMs0NSBWNKhddt98kpYtK0F0M17XLCODLithpXSBe1FhYM5N1iopTVp3hDcTK7DfhQWaPmRTISL7_oNHBOIwmsdJkNBPjd-tWxsQYNbKmB8dFwPfBQesbithfypS-fNLiFaOWyqvBGTB8oEY1kpe3Xub3-R4PYN_4z-F0fC0WEDfQ2'
}, {
  id: 'S3',
  name: 'Liam Kowalski',
  email: 'l.kowalski@university.edu',
  studentId: 'STU-91004',
  department: 'Economics',
  status: 'Active',
  activeDesk: 'F1-B07',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7Nz1p3TSKTW-VTAYel-nZ3KfBeJstEvfk8p62ulS1ffGrnQoAWhBAHjz3GnmEIlzjIZ9WRxL8BVPK0vFGdO-2BMHGncpvuA3uDj48hsh-bBqVIeYtYR31h3gmM0AE6Nk36zandoEr-CWyntK0ATssmTb6lcIQojdZCbbXcLO8C0aCKk3an-3Xn-g5WVR3MDQUIai0ci-7QpywpmbVY4VwdU-7KwJfuhvDmbaXf6A3uiDOO4nSjyo4JOKCm-tBgi_bKvdwgba1fcn6'
}, {
  id: 'S4',
  name: 'Chloe Huang',
  email: 'c.huang@university.edu',
  studentId: 'STU-77341',
  department: 'Neuroscience',
  status: 'Active',
  activeDesk: 'F4-A12',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO3-ymM9I0YpKeF1aWFeoNgngLtjBRlN3MN1qfpaLRPzeOgGDqR3jGFSMFHv4yvi_DnQzOn_a5IW1PdukWQqYmyJSFAFYK5arb4oJraYdMmjyhRMB6VkcS7D2xjBT6Xjy4qZ0rpFh2k6bUbPaWXZVLrblaFpZ_9rC9SFhAFVJq2Y0AklvsBfM2WUDC9HHYV3YlLj6gOGkzsGwClMIysITogMisk_8U6FN8LaQaH0f41nFyL9w5pkW7Qb2urJc2f0o_QAaII-505jNY'
}, {
  id: 'S5',
  name: 'Soren Raske',
  email: 's.raske@university.edu',
  studentId: 'STU-82390',
  department: 'Computer Engineering',
  status: 'Flagged',
  activeDesk: 'F2-E01',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSimGhor_qEWuh5jPG3NaJWriLvD7a_c6kw2SvI5yRTApmmZD6RieMycxBkH7yN1C1k2WD7tVDlJS1aliJsizjphbPG8OnO9KCBIBVBBFXauUa_ws97HpRSjro_giXJJDKvX1RNVtVA8JrWe5Y_piDGzHWOC61imOIOKXD-B28NxIjcM-ZDdFaVXnWj950RYk_VgpGq5snGoOpiONAwWTxEuhEIT1fOp5RFpzkDt6dkGzvPI-N5O-wyvUHDenM9mXkSfNtoeGTOT1Z'
}];

// Seed live administration reports/notifications matching Admin Dashboard
export const INITIAL_NOTIFICATIONS = [{
  id: 'N1',
  timestamp: '2 minutes ago',
  title: 'Desk A-102 reported abandoned',
  description: 'Motion sensor: No activity for 45m',
  type: 'error',
  deskId: 'Desk #102'
}, {
  id: 'N2',
  timestamp: '14 minutes ago',
  title: 'Staff cleared Desk B-12',
  description: 'Attendant: Sarah J. | Status: Available',
  type: 'success',
  deskId: 'Desk #12'
}, {
  id: 'N3',
  timestamp: '31 minutes ago',
  title: 'Peak occupancy reached',
  description: 'Level 3 at 98% capacity',
  type: 'info'
}, {
  id: 'N4',
  timestamp: '45 minutes ago',
  title: 'Desk C-44 reported abandoned',
  description: 'Motion sensor: No activity for 60m',
  type: 'error',
  deskId: 'Desk #44'
}];
const KEYS = {
  DESKS: 'deskguard_desks',
  LOGS: 'deskguard_logs',
  STUDENTS: 'deskguard_students',
  NOTIFS: 'deskguard_notifications',
  ACTIVE_SESSION: 'deskguard_active_session'
};

// Database Initialization & Getters/Setters
export const getDesks = () => {
  const existing = localStorage.getItem(KEYS.DESKS);
  if (!existing) {
    localStorage.setItem(KEYS.DESKS, JSON.stringify(INITIAL_DESKS));
    return INITIAL_DESKS;
  }
  return JSON.parse(existing);
};
export const saveDesks = desks => {
  localStorage.setItem(KEYS.DESKS, JSON.stringify(desks));
};
export const getBookingLogs = () => {
  const existing = localStorage.getItem(KEYS.LOGS);
  if (!existing) {
    localStorage.setItem(KEYS.LOGS, JSON.stringify(INITIAL_BOOKING_LOGS));
    return INITIAL_BOOKING_LOGS;
  }
  return JSON.parse(existing);
};
export const saveBookingLogs = logs => {
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
};
export const getStudentAccounts = () => {
  const existing = localStorage.getItem(KEYS.STUDENTS);
  if (!existing) {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENT_ACCOUNTS));
    return INITIAL_STUDENT_ACCOUNTS;
  }
  return JSON.parse(existing);
};
export const saveStudentAccounts = students => {
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
};
export const getActivityNotifications = () => {
  const existing = localStorage.getItem(KEYS.NOTIFS);
  if (!existing) {
    localStorage.setItem(KEYS.NOTIFS, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  return JSON.parse(existing);
};
export const saveActivityNotifications = activities => {
  localStorage.setItem(KEYS.NOTIFS, JSON.stringify(activities));
};
export const getActiveSession = () => {
  const existing = localStorage.getItem(KEYS.ACTIVE_SESSION);
  if (!existing) return null;
  return JSON.parse(existing);
};
export const saveActiveSession = session => {
  if (!session) {
    localStorage.removeItem(KEYS.ACTIVE_SESSION);
  } else {
    localStorage.setItem(KEYS.ACTIVE_SESSION, JSON.stringify(session));
  }
};