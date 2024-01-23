export const log = (...msgs: Array<string>) => {
  console.log(`[LOG]: ${msgs.join('\n\t')}`);
};

export const debug = (...msgs: Array<string>) => {
  if (!__DEV__) return;
  console.log(`[DEBUG]: ${msgs.join('\n\t')}`);
};

export const panicAt = (...msgs: Array<string>) => {
  let msg = '[ERROR]: ';

  if (msgs.length === 1) {
    msg += msgs[0];
  } else {
    msg += msgs[0];
    msgs.slice(1).forEach(m => (msg += `\n\t${m}`));
  }

  throw new Error(msg);
};

export const warningAt = (...msgs: Array<string>) => {
  console.warn(`[WARN]: ${msgs.join('\n\t')}`);
};
