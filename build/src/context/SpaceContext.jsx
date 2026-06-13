/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDesks, saveDesks, getBookingLogs, saveBookingLogs, getStudentAccounts, saveStudentAccounts, getActivityNotifications, saveActivityNotifications, getActiveSession, saveActiveSession } from '../data/mockData';
import { useAuth } from './AuthContext';
const SpaceContext = createContext(undefined);
export const SpaceProvider = ({
  children
}) => {
  const {
    user
  } = useAuth();
  const [desks, setDesksState] = useState([]);
  const [bookingLogs, setBookingLogsState] = useState([]);
  const [studentAccounts, setStudentAccountsState] = useState([]);
  const [notifications, setNotificationsState] = useState([]);
  const [activeSession, setActiveSessionState] = useState(null);

  // Sync state with localStorage on startup
  useEffect(() => {
    setDesksState(getDesks());
    setBookingLogsState(getBookingLogs());
    setStudentAccountsState(getStudentAccounts());
    setNotificationsState(getActivityNotifications());
    setActiveSessionState(getActiveSession());
  }, [user]);

  // Periodic Timer for session countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeSession) return;
      const updatedSession = {
        ...activeSession
      };
      let changed = false;

      // 1. Decr general reservation timer
      if (updatedSession.timeRemainingSeconds > 0) {
        updatedSession.timeRemainingSeconds -= 1;
        changed = true;
      }

      // 2. Incr accumulated study time
      if (updatedSession.status === 'Occupied') {
        updatedSession.activeSeconds += 1;
        changed = true;
      }

      // 3. Away mode timer
      if (updatedSession.status === 'Away') {
        if (updatedSession.awayTimeRemainingSeconds > 0) {
          updatedSession.awayTimeRemainingSeconds -= 1;
          changed = true;

          // Update active desk away text
          const currentDesk = desks.find(d => d.id === updatedSession.deskId);
          if (currentDesk && !currentDesk.lastActivityText.includes(`${Math.ceil(updatedSession.awayTimeRemainingSeconds / 60)}m`)) {
            const minsLeft = Math.ceil(updatedSession.awayTimeRemainingSeconds / 60);
            updateDeskProperty(updatedSession.deskId, {
              lastActivityText: `Away for ${minsLeft}m`
            });
          }
        } else {
          // Timer expired! Desk is auto-reported abandoned
          updatedSession.status = 'Verification';
          updatedSession.verificationTimeRemainingSeconds = 300; // 5 mins
          changed = true;

          // Update desk in db
          updateDeskProperty(updatedSession.deskId, {
            lastActivityText: 'Sensor alert: Abandoned'
          });
          addActivityNotification(`Desk ${updatedSession.deskId} reported abandoned`, 'Motion sensor: No activity detected for 20m. Verification triggered.', 'error', updatedSession.deskId);
        }
      }

      // 4. Presence verification timer
      if (updatedSession.status === 'Verification') {
        if (updatedSession.verificationTimeRemainingSeconds > 0) {
          updatedSession.verificationTimeRemainingSeconds -= 1;
          changed = true;
        } else {
          // Verification failed! Release desk completely
          clearInterval(interval);
          autoReleaseDeskDueToAbandonment(updatedSession.deskId);
          return;
        }
      }
      if (changed) {
        setActiveSessionState(updatedSession);
        saveActiveSession(updatedSession);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession, desks]);
  const updateDeskProperty = (deskId, props) => {
    const updated = getDesks().map(desk => {
      if (desk.id === deskId) {
        return {
          ...desk,
          ...props
        };
      }
      return desk;
    });
    setDesksState(updated);
    saveDesks(updated);
  };
  const addActivityNotification = (title, description, type, deskId) => {
    const newNotif = {
      id: 'N' + Date.now(),
      timestamp: 'Just now',
      title,
      description,
      type,
      deskId
    };
    const updated = [newNotif, ...getActivityNotifications()];
    setNotificationsState(updated);
    saveActivityNotifications(updated);
  };
  const autoReleaseDeskDueToAbandonment = deskId => {
    addActivityNotification(`Desk ${deskId} cleared automatically`, 'Reason: Student failed to verify presence within 5 minutes', 'error', deskId);

    // Log in bookings as cancelled or completed with low duration
    const logId = 'B' + Date.now();
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
    const nowTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const newLogs = [{
      id: logId,
      deskId: `Desk #${deskId.replace('D-', '')}`,
      date: today,
      checkIn: nowTime,
      checkOut: nowTime,
      duration: '22m (Incomplete)',
      status: 'Cancelled'
    }, ...getBookingLogs()];
    setBookingLogsState(newLogs);
    saveBookingLogs(newLogs);

    // Set desk as available
    updateDeskProperty(deskId, {
      status: 'Available',
      studentName: undefined,
      studentId: undefined,
      durationText: undefined,
      activeTimeText: undefined,
      lastActivityText: 'Cleared due to inactivity'
    });
    setActiveSessionState(null);
    saveActiveSession(null);
  };

  // 6. Student books desk
  const bookDesk = (deskId, floor, durationSeconds) => {
    if (!user) return;

    // Mark desk as occupied in db
    updateDeskProperty(deskId, {
      status: 'Occupied',
      studentName: user.name,
      studentId: user.studentId,
      durationText: 'Active now',
      lastActivityText: 'Booked just now'
    });

    // Create active session state
    const newSessionState = {
      deskId,
      floor,
      timeRemainingSeconds: durationSeconds !== undefined ? durationSeconds : 3 * 3600,
      // custom or default 3 hours
      activeSeconds: 0,
      status: 'Occupied',
      awayTimeRemainingSeconds: 20 * 60,
      // 20 minutes
      verificationTimeRemainingSeconds: 5 * 60 // 5 minutes
    };
    setActiveSessionState(newSessionState);
    saveActiveSession(newSessionState);
    addActivityNotification(`Desk booked: ${deskId}`, `Student ${user.name} checked into Floor ${floor} Section Desk.`, 'success', deskId);
  };

  // 7. Student checks out
  const releaseDesk = () => {
    if (!activeSession) return;
    const currentDeskId = activeSession.deskId;
    const hrs = Math.floor(activeSession.activeSeconds / 3600);
    const mins = Math.floor(activeSession.activeSeconds % 3600 / 60);
    const durationStr = `${hrs}h ${mins}m`;

    // Create booking log
    const logId = 'B' + Date.now();
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
    const checkInTimeText = new Date(Date.now() - activeSession.activeSeconds * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const checkOutTimeText = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const newLogItem = {
      id: logId,
      deskId: `Desk #${currentDeskId.replace('D-', '')}`,
      date: today,
      checkIn: checkInTimeText,
      checkOut: checkOutTimeText,
      duration: durationStr,
      status: 'Completed'
    };
    const updatedLogs = [newLogItem, ...getBookingLogs()];
    setBookingLogsState(updatedLogs);
    saveBookingLogs(updatedLogs);

    // Make desk available
    updateDeskProperty(currentDeskId, {
      status: 'Available',
      studentName: undefined,
      studentId: undefined,
      durationText: undefined,
      activeTimeText: undefined,
      lastActivityText: 'Just released'
    });
    setActiveSessionState(null);
    saveActiveSession(null);
    addActivityNotification(`Desk released: ${currentDeskId}`, `Finished session: ${durationStr} study duration logged.`, 'info', currentDeskId);
  };

  // 8. Go Away
  const toggleAway = () => {
    if (!activeSession) return;
    const updated = {
      ...activeSession
    };
    if (updated.status === 'Occupied') {
      updated.status = 'Away';
      updated.awayTimeRemainingSeconds = 20 * 60; // 20 mins countdown

      setActiveSessionState(updated);
      saveActiveSession(updated);
      updateDeskProperty(activeSession.deskId, {
        status: 'Away',
        lastActivityText: 'Away for 20m'
      });
      addActivityNotification(`Away Mode activated for ${activeSession.deskId}`, `Student indicated temporary absence. 20m timer started.`, 'warning', activeSession.deskId);
    }
  };

  // 9. Return & Check In
  const returnFromAway = () => {
    if (!activeSession || activeSession.status !== 'Away') return;
    const updated = {
      ...activeSession,
      status: 'Occupied'
    };
    setActiveSessionState(updated);
    saveActiveSession(updated);
    updateDeskProperty(activeSession.deskId, {
      status: 'Occupied',
      lastActivityText: 'Active now'
    });
    addActivityNotification(`Student returned to ${activeSession.deskId}`, `Desk session resumed status Occupied.`, 'success', activeSession.deskId);
  };

  // 10. Confirm Presence (verify still here)
  const confirmPresence = () => {
    if (!activeSession || activeSession.status !== 'Verification' && activeSession.status !== 'Away') return;
    const updated = {
      ...activeSession,
      status: 'Occupied',
      awayTimeRemainingSeconds: 20 * 60
    };
    setActiveSessionState(updated);
    saveActiveSession(updated);
    updateDeskProperty(activeSession.deskId, {
      status: 'Occupied',
      lastActivityText: 'Active now'
    });
    addActivityNotification(`Presence verified on ${activeSession.deskId}`, `Desk status restored successfully.`, 'success', activeSession.deskId);
  };
  const startPresenceVerification = () => {
    if (!activeSession) return;
    const updated = {
      ...activeSession,
      status: 'Verification',
      verificationTimeRemainingSeconds: 5 * 60 // 300 seconds
    };
    setActiveSessionState(updated);
    saveActiveSession(updated);
    updateDeskProperty(activeSession.deskId, {
      lastActivityText: 'Verifying presence'
    });
    addActivityNotification(`Presence Verification requested: ${activeSession.deskId}`, `Prompted student to verify presence within 5 minutes.`, 'warning', activeSession.deskId);
  };

  // 12. Admin Force Release Desk
  const adminForceRelease = deskId => {
    const currentDesks = getDesks();
    const deskObj = currentDesks.find(d => d.id === deskId);
    if (!deskObj) return;
    const studentName = deskObj.studentName || 'Sarah Jenkins';
    const studentId = deskObj.studentId || '#2948102';

    // Log the release in bookings
    const logId = 'B' + Date.now();
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
    const checkOutTimeText = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const newLogs = [{
      id: logId,
      deskId: `Desk #${deskId.replace('D-', '')}`,
      date: today,
      checkIn: '09:15 AM',
      checkOut: checkOutTimeText,
      duration: '2h 10m',
      status: 'Completed'
    }, ...getBookingLogs()];
    setBookingLogsState(newLogs);
    saveBookingLogs(newLogs);

    // Clear desk status
    updateDeskProperty(deskId, {
      status: 'Available',
      studentName: undefined,
      studentId: undefined,
      durationText: undefined,
      activeTimeText: undefined,
      lastActivityText: 'Released by Administrator'
    });

    // If the currently logged-in student's active desk was force released, clear activeSession
    if (activeSession && activeSession.deskId === deskId) {
      setActiveSessionState(null);
      saveActiveSession(null);
    }
    addActivityNotification(`Admin cleared Desk ${deskId}`, `Administrator force-released occupancy held by ${studentName} (${studentId}).`, 'info', deskId);
  };

  // 13. Admin Toggle Desk Disable / Enable
  const adminToggleDeskDisable = deskId => {
    const localDesks = getDesks();
    const target = localDesks.find(d => d.id === deskId);
    if (!target) return;
    const currentlyDisabled = target.status === 'Disabled';
    const nextStatus = currentlyDisabled ? 'Available' : 'Disabled';
    updateDeskProperty(deskId, {
      status: nextStatus,
      studentName: undefined,
      studentId: undefined,
      lastActivityText: currentlyDisabled ? 'Ready' : 'Out of service'
    });
    if (!currentlyDisabled && activeSession && activeSession.deskId === deskId) {
      setActiveSessionState(null);
      saveActiveSession(null);
    }
    addActivityNotification(`Desk ${deskId} ${currentlyDisabled ? 'Enabled' : 'Disabled'}`, `Administrator toggled desk service status to ${nextStatus}.`, currentlyDisabled ? 'success' : 'error', deskId);
  };

  // 14. Support Admin update student status
  const updateStudentStatus = (studentId, status) => {
    const updated = getStudentAccounts().map(stu => {
      if (stu.id === studentId || stu.studentId === studentId) {
        return {
          ...stu,
          status
        };
      }
      return stu;
    });
    setStudentAccountsState(updated);
    saveStudentAccounts(updated);
  };
  const addStudent = student => {
    const newStudent = {
      ...student,
      id: 'S' + (getStudentAccounts().length + 1),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    };
    const updated = [...getStudentAccounts(), newStudent];
    setStudentAccountsState(updated);
    saveStudentAccounts(updated);
    addActivityNotification(`New Student Registered`, `Student ${student.name} (${student.studentId}) added to the administration panel.`, 'info');
  };
  return <SpaceContext.Provider value={{
    desks,
    bookingLogs,
    studentAccounts,
    notifications,
    activeSession,
    bookDesk,
    releaseDesk,
    toggleAway,
    returnFromAway,
    confirmPresence,
    startPresenceVerification,
    adminForceRelease,
    adminToggleDeskDisable,
    updateStudentStatus,
    addStudent,
    addActivityNotification
  }}>
      {children}
    </SpaceContext.Provider>;
};
export const useSpace = () => {
  const context = useContext(SpaceContext);
  if (context === undefined) {
    throw new Error('useSpace must be used within a SpaceProvider');
  }
  return context;
};