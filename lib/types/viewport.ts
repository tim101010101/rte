import { CursorInfo } from './cursor';
import { Fence } from './fence';
import { Operable } from './interfaces';
import { VirtualNode } from './virtualNode';

export interface RenderWindow {
  gap: number;
  top: Operable;
  slice: Array<{
    vNode: VirtualNode;
    fence: Fence;
  }>;
  excess: number;
  bottom: Operable;
}

export interface Snapshot {
  cursor: CursorInfo;
  window: RenderWindow;
}
