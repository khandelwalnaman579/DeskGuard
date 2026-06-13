/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Formats a duration in seconds to HH:MM:SS string.
 * @param ticks Time duration in seconds
 */
export const formatSeconds = ticks => {
  const hrs = Math.floor(ticks / 3600);
  const mins = Math.floor(ticks % 3600 / 60);
  const secs = ticks % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Converts minutes left to a rounded minutes duration string.
 * @param seconds Time duration in seconds
 */
export const formatAwayMinutes = seconds => {
  return `${Math.ceil(seconds / 60)}m`;
};