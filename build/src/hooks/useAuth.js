/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAuth as useContextAuth } from '../context/AuthContext';

/**
 * Access the Authenticated User session state and actions.
 */
export const useAuth = () => {
  return useContextAuth();
};