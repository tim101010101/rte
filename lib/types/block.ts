import { Block } from 'lib/model';
import { VirtualNode } from 'lib/types';

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

export interface Pos {
  block: Block;
  offset: number;
}

export interface ActivePos {
  block: Block;
  ancestorIdx: number;
}
