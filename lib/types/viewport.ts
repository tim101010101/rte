import { CursorInfo } from './cursor';
import { Fence } from './fence';
import { Operable } from './interfaces';
import { ClientRect } from './listView';
import { VirtualNode } from './virtualNode';

export type SliceItem = {
  vNode: VirtualNode;
  fence: Fence;

  _origin: Operable;
};

export type SliceItemWithRect = SliceItem & {
  rect: {
    lineRect: ClientRect;
    rectList: Array<ClientRect>;
  };
};

export type Ref<_T> = number;
export type Deref<T extends Ref<any>> = T extends Ref<infer U> ? U : never;

export interface SnapshotWindow<
  T extends SliceItem | SliceItemWithRect = SliceItem
> {
  gap: number;
  top: Ref<Operable>;
  slice: Array<T>;
  excess: number;
  bottom: Ref<Operable>;
}

export interface RenderWindow<
  T extends SliceItem | SliceItemWithRect = SliceItem
> {
  gap: number;
  top: Operable;
  slice: Array<T>;
  excess: number;
  bottom: Operable;
}

export interface Snapshot<T extends SliceItem | SliceItemWithRect = SliceItem> {
  cursor: CursorInfo | null;
  window: SnapshotWindow<T>;
}

export interface RenderSnapshot<
  T extends SliceItem | SliceItemWithRect = SliceItem
> {
  cursor: CursorInfo | null;
  window: RenderWindow<T>;
}
