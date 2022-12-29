export const insertAt = (source: string, pos: number, newStr: string) => {
  return `${source.slice(0, pos)}${newStr}${source.slice(pos)}`;
};
