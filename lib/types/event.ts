export type DOMEventHandler<E> = (e: E) => void;
export type DOMEventDetachHandler = () => void;

export type InnerEventHandler = <T extends any[]>(...rest: T) => void;
export type InnerEventDetachHandler = () => void;
