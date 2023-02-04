import { ListNode } from 'lib/model';
import {
  ActivePos,
  ClientRect,
  FeedbackPos,
  Fence,
  FenceInfo,
  Pos,
  SyntaxNode,
  VirtualNode,
} from 'lib/types';

export interface Operable extends ListNode {
  fence: Fence;
  vNode: VirtualNode;
  rect: ClientRect;

  getFenceInfo(offset: number): FenceInfo;
  patch(newVNode: VirtualNode): void;

  focusOn(
    prevPos: Pos | null,
    curOffset: number,
    active: Array<ActivePos>
  ): FeedbackPos;
  unFocus(): { pos: Pos | null; active: Array<ActivePos> };

  left(pos: Pos, active: Array<ActivePos>, offset: number): FeedbackPos | null;
  right(pos: Pos, active: Array<ActivePos>, offset: number): FeedbackPos | null;
  up(pos: Pos, active: Array<ActivePos>, offset: number): FeedbackPos | null;
  down(pos: Pos, active: Array<ActivePos>, offset: number): FeedbackPos | null;

  newLine(offset: number, parser: (src: string) => SyntaxNode): FeedbackPos;

  update(
    char: string,
    offset: number,
    active: Array<ActivePos>,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos;

  delete(
    offset: number,
    active: Array<ActivePos>,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos;
}
