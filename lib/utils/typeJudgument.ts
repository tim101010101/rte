export const isEmptyString = (s: string) => /^[ \n\t]*$/.test(s);

export const isNumber = (n: any): n is number => typeof n === 'number';

export const isFunction = (f: any): f is Function => typeof f === 'function';
