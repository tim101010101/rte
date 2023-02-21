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

export const warningAt = (msg: string) => {
  console.warn(`[WARN]: ${msg}`);
};
