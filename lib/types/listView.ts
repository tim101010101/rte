import { Operable } from 'lib/interfaces';

export interface Pos {
  block: Operable;
  offset: number;
}

export interface ActivePos {}

export interface FeedbackPos {
  pos: Pos;
  active: ActivePos | null;
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

export interface FenceLeaf {
  rect: ClientRect;
  prefixChange: number;
  textOffset: number;
}

export interface FenceRoot {
  totalLength: number;
  totalChange: number;
  fenceList: Array<FenceLeaf>;

  prefixLength: number;
}

export type Fence = Array<FenceRoot>;

export interface FenceInfo {
  totalLength: number;
  totalChange: number;
  fenceList: Array<FenceLeaf>;

  prefixLength: number;

  rect: ClientRect;
  prefixChange: number;
  textOffset: number;
}
