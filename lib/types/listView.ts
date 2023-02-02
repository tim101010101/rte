import {
  VirtualNode,
  Operable,
  SyntaxNode,
  SyntaxNodeWithLayerActivation,
} from 'lib/types';

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
  rect: Rect;
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

  rect: Rect;
  prefixChange: number;
  textOffset: number;
}
