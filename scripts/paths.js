import { resolve } from 'path';

export const filename = () => {
  return new URL(import.meta.url).pathname;
};

export const dirname = () => {
  return new URL('.', import.meta.url).pathname;
};

export const root = resolve(dirname(), '../');
export const scripts = resolve(root, 'scripts');
export const lib = resolve(root, 'lib');
export const dist = resolve(root, 'dist');
export const example = resolve(root, 'example');
export const debug = resolve(root, 'debug');
