export const isEmptyString = (s: string) => /^[ \n\t]*$/.test(s);

export const isNumber = (n: any): n is number => typeof n === 'number';

export const isFunction = (f: any): f is Function => typeof f === 'function';

export const isObject = (o: any): o is object => typeof o === 'object';

export const isArray = (a: any): a is Array<any> => Array.isArray(a);
