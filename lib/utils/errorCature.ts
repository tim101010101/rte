export const panicAt = (msg: string) => {
  throw new Error(`[ERROR]: ${msg}`);
};

export const warningAt = (msg: string) => {
  console.warn(`[WARN]: ${msg}`);
};
