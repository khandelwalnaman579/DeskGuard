/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, MapPin, Layers, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSpace } from '../context/SpaceContext';
import { deskService } from '../services/deskService';

export const CheckInPage = () => {
  const { deskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookDesk } = useSpace();

  const [desk, setDesk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    deskService.getDeskById(deskId)
      .then((result) => {
        if (!active) return;
        if (!result) {
          setError(`Desk ${deskId} could not be found.`);
        } else {
          setDesk(result);
        }
      })
      .catch(() => {
        if (active) setError('Unable to load desk information.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [deskId]);

  const handleConfirm = async () => {
    if (!desk) return;
    setConfirming(true);
    // Simulate network latency for the check-in API call
    await new Promise((resolve) => setTimeout(resolve, 600));
    bookDesk(desk.id, desk.floor, 3 * 3600);
    navigate('/active-session');
  };

  const handleCancel = () => {
    navigate(user?.role === 'admin' ? '/admin-floor-map' : '/floor-map');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-12 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-100 p-8 space-y-6"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-650 rounded-2xl flex items-center justify-center shadow border border-indigo-100">
            <QrCode size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">QR Check-In</h1>
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">Desk {deskId}</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-8 text-slate-400">
            <Loader2 className="animate-spin" size={28} />
            <p className="text-sm">Loading desk information…</p>
          </div>
        )}

        {!loading && error && (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 py-6 text-rose-500 text-center">
              <XCircle size={32} />
              <p className="text-sm font-semibold text-slate-700">{error}</p>
              <p className="text-xs text-slate-400">Please check the QR code and try scanning again.</p>
            </div>
            <Link
              to="/"
              className="block text-center w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
            >
              Return Home
            </Link>
          </div>
        )}

        {!loading && !error && desk && (
          <>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Desk Info</span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    desk.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-700'
                      : desk.status === 'Occupied'
                      ? 'bg-rose-100 text-rose-700'
                      : desk.status === 'Away'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {desk.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold">
                <MapPin size={16} className="text-indigo-650" />
                Desk {desk.id}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Layers size={16} className="text-indigo-650" />
                Floor {desk.floor}{desk.section ? ` · Section ${desk.section}` : ''}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Student</span>
              <p className="text-sm font-semibold text-slate-700">{user?.name || 'Guest Student'}</p>
              <p className="text-xs text-slate-400">{user?.studentId || user?.email}</p>
            </div>

            {desk.status !== 'Available' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl p-4 text-sm">
                  <XCircle size={20} />
                  <span>This desk is currently <strong>{desk.status}</strong> and cannot be checked into right now.</span>
                </div>
                <button
                  onClick={handleCancel}
                  className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
                >
                  Back to Library Map
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleCancel}
                  disabled={confirming}
                  aria-label="Cancel check-in"
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  aria-label="Confirm check-in"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-705 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {confirming ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Checking In…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Confirm Check-In
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};
