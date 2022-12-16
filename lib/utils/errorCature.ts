export const panicAt = (msg: string) => {
  throw new Error(`[ERROR]: ${msg}`);
};
