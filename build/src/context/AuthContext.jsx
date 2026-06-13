/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getActiveSession, saveActiveSession } from '../data/mockData';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../constants';
const AuthContext = createContext(undefined);
export const AuthProvider = ({
  children
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Check local storage for persisted login
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
  const login = async (email, role) => {
    setLoading(true);
    try {
      // Simulated future call: POST /api/auth/login
      await authService.login(email, 'password123', role);
    } catch (err) {
      setLoading(false);
      throw err;
    }
    let loggedInUser;
    if (role === 'admin') {
      loggedInUser = {
        id: 'A1',
        email: email || 'admin@university.edu',
        name: 'Admin Panel',
        role: 'admin',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvWYT5bOl8R7IdWj-cq_9IAZ5xojKuF6YkRXnzRfs_d_7D8tol9HHCaM6yAqRjGaJtw8qX3EhkEW19jvOObDMC6vbXf-wS6iJDOXHnorYkWdcoBsNVjEHd4Fygn5QkILbRNpBs56Xgs0qdCvHR6w0HXZj6V0RtPGqwpp4DZYYOOPVPGT_jKcJbF6O07A8N75DfkPYTCbXU1USVsUgTscarPrlEnk9Sp5hNnslwyG8_ncOoVmgXF-JSS_7mmPdxCzGrG-iO9vfBu1Ie'
      };
    } else {
      loggedInUser = {
        id: 'S100',
        email: email || 'student@university.edu',
        name: 'Alex Johnston',
        role: 'student',
        studentId: 'UG-882910',
        department: 'Computer Science & AI',
        trustScore: 98,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu0Pkn1M4IMH7ulPr9QdrZuKY419vbOkABjAxqsMHvZppWiSPVOmFqEIG3c1kZESs21PZ06nB8PGWlTvThaTRr5d3gWVohM9nXw-5aXeacQSLYLAZnFWGdt6GJO1HPbznE1usUvE3aJfdqr4K4hczcvvTTGgdWUFT58qo_Zx4k0o2BFFYMf-1WjRfGVIaYyKR0-BuOTAR3NQrK2OgvuUJIKww32rCqoFmUprGxfDqNLyIGINMQYazzQnpq_cLfUv74p08oZF8zaykD'
      };

      // When signing in as Alex Johnston, seed the default study session
      const currentSession = getActiveSession();
      if (!currentSession) {
        saveActiveSession({
          deskId: 'D-102',
          floor: 1,
          timeRemainingSeconds: 2 * 3600 + 44 * 56,
          // 02:44:56
          activeSeconds: 1 * 3600 + 20 * 60,
          // 1h 20m
          status: 'Occupied',
          awayTimeRemainingSeconds: 18 * 60 + 38,
          // 18:38
          verificationTimeRemainingSeconds: 4 * 60 + 57 // 04:57
        });
      }
    }
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setLoading(false);
    return true;
  };
  const logout = () => {
    // Simulated future call: POST /api/auth/logout
    authService.logout();
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
  };
  const registerStudent = async (name, studentId, email) => {
    setLoading(true);
    // Simulated future call: POST /api/auth/register
    await authService.register(name, studentId, email, 'password123');
    const newUser = {
      id: 'S' + Math.floor(Math.random() * 1000).toString(),
      email,
      name,
      role: 'student',
      studentId,
      department: 'General Engineering',
      trustScore: 100,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKUg-X3NrMyU7PYsehjybJiPamcBvp3hm9s-KzT9rL37QPK8QEyA_CwuaeOqYJxqcka2RNTQ8cFu1DIE4h2Iw_MiYeYLS8eet21hImqPgOfpfi_smli2E1V-_d9oM3xE-Ho-rbZrJQhGTQeo-PeIcTTNNLuJGsUfhkqiUJwuV7qQLw2kViOpMc8HtS4d_KZxEnLfRGdIAK0-5HDhwSt_-eWEXuUe8fthZXKgJM_H4c0xV4eV7v5xrWGj_sFAdAv08hCgXvS9NJUs1v'
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
    return true;
  };
  return <AuthContext.Provider value={{
    user,
    loading,
    login,
    logout,
    registerStudent
  }}>
      {children}
    </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};