export type SetterFunction<T> = (value: T) => T;

export type Point = [number, number];

export type NoopFunction = (...rest: Array<any>) => any;
