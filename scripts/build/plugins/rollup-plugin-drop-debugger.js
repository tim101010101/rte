import { transform as transformFilter } from './rollup-plugin-transform.js';

export const dropDebugger = () => {
  return transformFilter([
    {
      reg: /@__DEBUG_.+/g,
      filter: code => {
        return code.replaceAll(/@__DEBUG_.+/g, '');
      },
    },
  ]);
};
