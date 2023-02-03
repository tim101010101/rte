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
    active: ActivePos | null
  ): FeedbackPos;
  unFocus(): { pos: Pos | null; active: ActivePos | null };

  left(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
  right(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
  up(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
  down(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;

  newLine(offset: number, parser: (src: string) => SyntaxNode): FeedbackPos;

  update(
    char: string,
    offset: number,
    active: ActivePos | null,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos;

  delete(
    offset: number,
    active: ActivePos | null,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos;
}
