import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import { exit, argv } from 'node:process';
import pico from 'picocolors';
import minimist from 'minimist';

/**
 * A wrapper of `Promise`
 *
 * Converts the `result` and `error` of the Promise into a tuple
 *
 * @param {Promise} p
 * @returns A binary tuple `[result, error]`
 * @example
 * ```typescript
 * const p = new Promise((resolve, reject) => {
 *   if (Math.round(Math.random())) {
 *     resolve('success')
 *   } else {
 *     reject(new Error('failed'))
 *   }
 * });
 *
 * (async () => {
 *   const [res, err] = await to(p)
 *   if (err) {
 *     console.log(`rejected with ${err}`); // rejected with Error: failed
 *   } else if (res) {
 *     console.log(`resolved with ${res}`); // resolved with success
 *   }
 * })()
 * ```
 */
export const to = async p => {
  try {
    const res = await p;
    return [res, null];
  } catch (err) {
    return [null, err];
  }
};

/**
 * Removes the directory identified by `path`.
 *
 * Using `fsPromises.rmdir()` on a file (not a directory) results in the
 * promise being rejected with an `ENOENT` error on Windows and an `ENOTDIR`error on POSIX.
 *
 * To get a behavior similar to the `rm -rf` Unix command, use `fsPromises.rm()` with options `{ recursive: true, force: true }`.
 *
 * @param {PathLike} path target path
 * @param {RmDirOptions | undefined} options options
 * @return Resolves with `undefined` upon success.
 */
export const rmdir = async (path, options) => {
  let args = '';

  if (options && options.recursive) {
    args += '-r';
  }
  if (options && options.force) {
    args += 'f';
  }

  return promisify(exec)(`rm ${args} ${path}`);
};

export const panicAt = (...msgs) => {
  console.error(msgs.join('\t\n'));
  exit(1);
};

/**
 * @param {string} msg Step message,
 */
export const step = msg => console.log(pico.cyan(msg));

export const getArgs = () => minimist(argv.slice(2));
