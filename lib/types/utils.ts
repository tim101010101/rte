export type Noop = Record<string, any>;

export type Keys<T extends object> = (keyof T)[];

export type Values<T extends object> = T[keyof T][];

export type DeepExpandable<T extends Noop> = {
  [k in keyof T]: T[k] extends Noop ? DeepExpandable<T[k]> & Noop : T[k];
} & Noop;

export type DeepPartial<T extends Noop> = Partial<{
  [k in keyof T]: T[k] extends Noop ? Partial<DeepPartial<T[k]>> : T[k];
}>;

export type DeepRequired<T extends Noop> = Required<{
  [k in keyof T]: T[k] extends Noop ? Required<DeepRequired<T[k]>> : T[k];
}>;
