/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSpace as useContextSpace } from '../context/SpaceContext';

/**
 * Access the Desk space tracking state, live bookings, and admin actions.
 */
export const useSpace = () => {
  return useContextSpace();
};