import { Operable } from 'lib/types';

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

export interface FenceLeaf {
  rect: ClientRect;
  prefixChange: number;
  textOffset: number;
}

export interface FenceRoot {
  fenceList: Array<FenceLeaf>;

  prefixLength: number;

  totalLength: number;
  totalChange: number;
}

export type Fence = Array<FenceRoot>;

export interface FenceInfoItem {
  ancestorIdx: number;
  totalLength: number;
  totalChange: number;
  prefixChange: number;
}

export interface FenceInfo {
  rect: ClientRect;
  textOffset: number;

  fenceInfoList: Array<FenceInfoItem>;
}

export interface Snapshot {
  // TODO
}
