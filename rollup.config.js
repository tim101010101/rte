import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import esbuild from 'rollup-plugin-esbuild';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

import { terser } from 'rollup-plugin-terser';

import { join } from 'path';

const entries = ['lib/index.ts'];

const resolveDir = dir => join(__dirname, dir);
const plugins = [
  babel({
    babelrc: false,
    babelHelpers: 'bundled',
    presets: [['env', { modules: false }]],
  }),
  resolve({
    preferBuiltins: true,
  }),
  alias({
    entries: [{ find: 'lib', replacement: resolveDir('lib') }],
  }),
  json(),
  typescript(),
  commonjs(),
  esbuild(),
  terser(),
];

export default [
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
  ...entries.map(input => ({
    input,
    output: {
      file: input.replace('lib/', 'dist/').replace('.ts', '.d.ts'),
      format: 'esm',
    },
    external: [],
    plugins: [dts({ respectExternal: true })],
  })),
];
