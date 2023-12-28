import { Fence, Operable, VirtualNode } from 'lib/types';
import { CursorInfo } from './cursor';
import { LinkedList } from 'lib/model';

export type ListView = LinkedList<Operable>;

export interface Pos {
  block: Operable;
  offset: number;
}

export interface ActivePos {
  block: Operable;
  ancestorIdx: number;
}

/**
 * Relative to the canvas element.
 *
 * The coordinate origin is the upper-left corner of the canvas element.
 */
export interface Rect {
  width: number;
  height: number;
  x: number;
  y: number;
}
/**
 * Relative to the document.body.
 *
 * The coordinate origin is the upper-left corner of the document.body.
 */
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
export interface State {
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
  cursor: CursorInfo;
  /**
   * Index of all activated nodes.
   */
  actived: Array<number>;
}

export interface Snapshot {
  cursor: CursorInfo;
}
