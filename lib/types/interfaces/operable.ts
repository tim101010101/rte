import { ListNode } from 'lib/model';
import {
  ClientRect,
  Fence,
  Snapshot,
  SyntaxNode,
  VirtualNode,
} from 'lib/types';

export interface Operable extends ListNode {
  fence: Fence;
  vNode: VirtualNode;
  rect: ClientRect;

  snapshot(): Snapshot;

  patch(newVNode: VirtualNode): void;

  focusOn(prevState: Snapshot | null, curOffset: number): Snapshot;
  unFocus(prevState: Snapshot): void;

  left(prevState: Snapshot, step: number): Snapshot | null;
  right(prevState: Snapshot, step: number): Snapshot | null;
  up(prevState: Snapshot, step: number): Snapshot | null;
  down(prevState: Snapshot, step: number): Snapshot | null;

  newLine(prevState: Snapshot, parse: (src: string) => SyntaxNode): Snapshot;

  update(
    prevState: Snapshot,
    char: string,
    parse: (src: string) => SyntaxNode
  ): Snapshot;

  delete(prevState: Snapshot, parse: (src: string) => SyntaxNode): Snapshot;
}
