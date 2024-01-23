import { join } from 'node:path';
import { defineConfig, definePlugins } from './rollup.js';
import { replacement } from './replacement.js';
import { getArgs } from '../utils.js';
import { root } from '../paths.js';

/**
 * Plugins of `rollup`
 */
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import { dropDebugger } from './plugins/rollup-plugin-drop-debugger.js';
/**
 * There is a TypeError occur when import directly.
 *
 * Fix it according to this issue: https://github.com/egoist/rollup-plugin-esbuild/issues/361
 *
 * ```javascript
 * import dts from 'rollup-plugin-dts';          // TypeError: dts is not a function
 * import esbuild from 'rollup-plugin-esbuild';  // TypeError: esbuild is not a function
 * ```
 */
import _dts from 'rollup-plugin-dts';
import _esbuild from 'rollup-plugin-esbuild';
const dts = _dts.default ?? _dts;
const esbuild = _esbuild.default ?? _esbuild;

const resolveDir = dir => join(root, dir);

/**
 * Get the arguments of the command line.
 */
const args = getArgs();
const isProd = args.m === 'PROD';

/**
 * Entry file of the whole project
 */
const entries = ['lib/index.ts'];

/**
 * List of basic plugin
 */
const plugins = definePlugins([
  isProd && dropDebugger(),

  babel({
    babelrc: false,
    babelHelpers: 'bundled',
    presets: [['env', { modules: false }]],
  }),
  typescript({
    tsconfig: resolveDir('tsconfig.json'),
    check: false,
  }),
  resolve({
    preferBuiltins: true,
  }),
  alias({
    entries: [{ find: 'lib', replacement: resolveDir('lib') }],
  }),
  json(),
  commonjs(),
  replace({
    values: replacement,
    preventAssignment: true,
  }),
  esbuild(),

  isProd && terser(),
]);

/**
 * Options of `rollup`
 */
export const config = defineConfig([
  /**
   * Configuration of the construction of the project subject.
   */
  ...entries.map(input => ({
    input,
    output: [
      {
        file: input.replace('lib/', 'dist/').replace('.ts', '.mjs'),
        format: 'esm',
      },
      {
        file: input.replace('lib/', 'dist/').replace('.ts', '.cjs'),
        format: 'cjs',
      },
    ],
    external: [],
    plugins,
  })),

  /**
   * Configuration of the construction of the declaration file.
   */
  ...entries.map(input => ({
    input,
    output: {
      file: input.replace('lib/', 'dist/').replace('.ts', '.d.ts'),
      format: 'esm',
    },
    external: [],
    plugins: [dts({ respectExternal: true })],
  })),
]);
