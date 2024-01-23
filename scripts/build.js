import { rollup } from './build/rollup.js';
import { config } from './build/config.js';
import { panicAt, to } from './utils.js';

const run = async () => {
  const [_, err] = await to(rollup('build', config));
  if (err) return panicAt('Build error', err);
};
run();
