export type Noop = Record<string, any>;

export type Keys<T extends object> = (keyof T)[];

export type Values<T extends object> = T[keyof T][];

export type DeepExpandable<o extends Noop> = {
  [k in keyof o]: o[k] extends Noop ? DeepExpandable<o[k]> & Noop : o[k];
} & Noop;

export type DeepPartial<o extends Noop> = Partial<{
  [k in keyof o]: o[k] extends Noop ? Partial<DeepPartial<o[k]>> : o[k];
}>;

export type DeepRequired<o extends Noop> = Required<{
  [k in keyof o]: o[k] extends Noop ? Required<DeepRequired<o[k]>> : o[k];
}>;
