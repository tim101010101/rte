import { VirtualNode, Operable } from 'lib/types';

export interface Rect {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface CursorInfo {
  cursorOffset: number;
  textOffset: number;
}

export interface FenceItem {
  vNode: VirtualNode;
  rect: Rect;
  prefixLength: number;
  fenceList: Array<CursorInfo>;
}

export type Fence = Array<FenceItem>;

export interface FenceInfo {
  vNode: VirtualNode;
  rect: Rect;
  prefixLength: number;
  ancestorIdx: number;
  textOffset: number;
  cursorOffset: number;
  hitPos: -1 | 0 | 1;
}

export interface Pos {
  block: Operable;
  offset: number;
}

export interface ActivePos {
  block: Operable;
  ancestorIdx: number;
}
