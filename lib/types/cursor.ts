import { Operable } from './interfaces';

export type CursorInfo = {
  type: 'mark' | 'range';
  block: Operable | null;
  offset: number;
};
