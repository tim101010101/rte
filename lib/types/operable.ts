import { ListNode } from 'lib/model';
import {
  ActivePos,
  Fence,
  FenceInfo,
  Pos,
  Rect,
  SyntaxNode,
  VirtualNode,
} from 'lib/types';

export interface FeedbackPos {
  pos: Pos;
  active: ActivePos | null;
}

export interface Operable extends ListNode {
  vNode: SyntaxNode;
  rect: Rect;
  fence: Fence;

  getFenceInfo(offset: number): FenceInfo;

  focusOn(
    prevPos: Pos | null,
    curOffset: number,
    active: ActivePos | null,
    isCrossLine: boolean
  ): FeedbackPos;
  unFocus(): { pos: Pos | null; active: ActivePos | null };

  left(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
  right(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
  up(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;
  down(pos: Pos, active: ActivePos | null, offset: number): FeedbackPos | null;

  newLine(): void;

  update(
    char: string,
    offset: number,
    parser: (src: string) => SyntaxNode
  ): FeedbackPos;

  patch(newVNode: VirtualNode): void;
}
