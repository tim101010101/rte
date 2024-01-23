import { getArgs } from '../utils.js';

/**
 * Get the arguments of the command line.
 */
const args = getArgs();
const isDev = args.m === 'DEV';
const isProd = args.m === 'PROD';

/**
 * Replacement of `rollup-plugin-replace`
 */
export const replacement = {
  __DEV__: isDev && !isProd,
};
