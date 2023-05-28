import { Fence, Operable, VirtualNode } from 'lib/types';
import { CursroInfo } from './cursor';

export interface Pos {
  block: Operable;
  offset: number;
}

export interface ActivePos {
  block: Operable;
  ancestorIdx: number;
}

export interface Rect {
  width: number;
  height: number;
  x: number;
  y: number;
}
export interface ClientRect {
  width: number;
  height: number;
  clientX: number;
  clientY: number;
}

export interface FeedbackPos {
  rect: ClientRect | null;
  pos: Pos | null;
  active: Array<ActivePos>;
}

/**
 * The full internal state of the current cursor location.
 */
export interface Snapshot {
  block: Operable;
  vNode: VirtualNode;
  fence: Fence;

  /**
   * The offset of the position of the current cursor, it is based on all positions that can be inserted by the cursor.
   *
   * It is different from textOffset in meaning, but in numerical terms, it's the same as textOffset...
   *
   * TODO Merge offset and textOffset
   */
  offset: number;
  /**
   * The offset of the position of the current cursor, it is based on the position between text characters.
   */
  textOffset: number;
  /**
   * Current cursor information.
   */
  cursor: CursroInfo;
  /**
   * Index of all activated nodes.
   */
  actived: Array<number>;
}
