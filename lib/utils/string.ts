export const insertAt = (source: string, pos: number, newStr: string) => {
  return source
    ? `${source.slice(0, pos)}${newStr}${source.slice(pos)}`
    : newStr;
};

export const removeAt = (source: string, pos: number, count: number = 1) => {
  return `${source.slice(0, pos)}${source.slice(pos + count)}`;
};

export const concat = (...sources: Array<string>): string => {
  return sources.join('');
};

export const splitAt = (source: string, pos: number): [string, string] => {
  return [source.slice(0, pos), source.slice(pos)];
};
