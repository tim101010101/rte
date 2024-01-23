import { opendir } from 'node:fs/promises';
import { rollup as build, watch } from 'rollup';
import { panicAt, rmdir, to, step } from '../utils.js';
import { dist, root } from '../paths.js';

const clearDist = async () => {
  step('Clearing dist...');

  const [dir, notExist] = await to(opendir(dist));

  if (!dist.startsWith(root)) {
    return panicAt('The path may be wrong.', `${dist}`);
  } else if (notExist) {
    return;
  } else if (dir) {
    dir.close();
  }

  const [, fail] = await to(rmdir(dist, { recursive: true, force: true }));
  if (fail) return panicAt('Clear dist fail.', `${fail}`);

  step('Clean up completed');
};

const buildOrWatch = async (mode, options) => {
  step('start building...');

  switch (mode) {
    case 'build':
      if (Array.isArray(options)) {
        for (const option of options) {
          const bundle = await build(option);

          if (Array.isArray(option.output)) {
            await Promise.all(option.output.map(bundle.write));
          } else {
            await bundle.write(option.output);
          }
        }
      } else {
        const bundle = await build(options);
        await bundle.write(options.output);
      }
      return;

    case 'watch':
      watch(options);
      return;

    default:
      break;
  }
};

/**
 * @param {'watch' | 'build'} mode Operation mode
 * @param {import('rollup').RollupOptions | import('rollup').RollupOptions[]} options Rollup configuration
 */
export const rollup = async (mode, options) => {
  await clearDist();

  step(`start building with [${mode} mode] ...`);
  await buildOrWatch(mode, options);
  step(mode === 'build' ? 'building completed' : 'watch mode started');
};

/**
 * @param {import('rollup').Plugin[]} plugins
 */
export const definePlugins = plugins => plugins.filter(Boolean);

export { defineConfig } from 'rollup';
