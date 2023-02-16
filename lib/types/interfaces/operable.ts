import { ListNode } from 'lib/model';
import {
  ActivePos,
  ClientRect,
  FeedbackPos,
  Fence,
  FenceInfo,
  Pos,
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

  focusOn(
    prevPos: Pos | null,
    curOffset: number,
    active: Array<ActivePos>
  ): FeedbackPos;
  unFocus(prevPos: Pos, curActive: Array<ActivePos>): FeedbackPos;

  left(pos: Pos, active: Array<ActivePos>, offset: number): FeedbackPos | null;
  right(pos: Pos, active: Array<ActivePos>, offset: number): FeedbackPos | null;
  up(pos: Pos, active: Array<ActivePos>, offset: number): FeedbackPos | null;
  down(pos: Pos, active: Array<ActivePos>, offset: number): FeedbackPos | null;

  newLine(offset: number, parser: (src: string) => SyntaxNode): FeedbackPos;

  update(
    char: string,
    offset: number,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos;

  delete(offset: number, parser: (src: string) => SyntaxNode): FeedbackPos;
}
