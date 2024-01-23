import { createServer } from 'vite';
import { config as rollupOptions } from './build/config.js';
import { replacement } from './build/replacement.js';
import { lib, debug, example } from './paths.js';
import { to, getArgs, panicAt } from './utils.js';

/**
 * Get the arguments of the command line.
 */
const args = getArgs();
const isDev = args.m === 'DEV';
const port = args.p || 3000;

/** @type {import('vite').InlineConfig} */
const config = {
  root: isDev ? debug : example,
  server: {
    port,
  },
  resolve: {
    alias: {
      lib,
    },
  },
  build: {
    rollupOptions,
  },
  define: replacement,
};

const run = async () => {
  const [server, errWhenCreateServer] = await to(createServer(config));
  if (errWhenCreateServer) {
    return panicAt('Unable to create server', errWhenCreateServer);
  }

  const [_, errWhenListening] = await to(server.listen());
  if (errWhenListening) {
    return panicAt(
      `Unable to listen at ${config.server.port}`,
      errWhenListening
    );
  }

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
};
run();
