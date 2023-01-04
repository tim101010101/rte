export type DOMEventHandler<E> = (e: E) => void;
export type DOMEventDetachHandler = () => void;

export type InnerEventHandler = <T extends Array<any>>(...rest: T) => void;
