import { appendChild, createDomNode, isNumber } from 'lib/utils';
import {
  Block,
  deepCloneWithTrackNode,
  getAncestor,
  isPureTextAncestor,
} from 'lib/model';
import { SetterFunction, VirtualNode } from 'lib/types';
import { activeSubTree, cancelActiveSubTree } from './switchActiveMarker';
import { ClassName, TagName } from 'lib/static';

export class Selection {
  private el: HTMLElement;
  private activeBlock: Block | null;
  private activePath: Array<number> | null;
  private fenceOffset: number | null;

  constructor(container: HTMLElement) {
    this.el = createDomNode(TagName.SPAN, [ClassName.RTE_CURSOR]);
    this.activeBlock = null;
    this.fenceOffset = null;
    this.activePath = null;

    appendChild(container, this.el);
  }

  private setFenceOffset(offset: number | SetterFunction<number>) {
    if (isNumber(offset)) {
      this.fenceOffset = offset;
    } else {
      this.fenceOffset = offset(this.fenceOffset!);
    }
  }

  private get fence() {
    return this.activeBlock!.fence;
  }

  private setShape(width: number, height: number, left: number, top: number) {
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.style.left = `${left}px`;
    this.el.style.top = `${top}px`;
  }

  private trySwitchActiveSyntaxNode(target: VirtualNode) {
    let needPatch = false;
    const [newRoot, path] = deepCloneWithTrackNode(
      this.activeBlock!.vNode!,
      target
    );

    if (this.activePath && this.activePath[0] !== path[0]) {
      cancelActiveSubTree(getAncestor(newRoot, this.activePath));
      this.activePath = null;
      needPatch = true;

      // TODO move cursor left
    }

    if (!this.activePath && !isPureTextAncestor(newRoot, path)) {
      activeSubTree(getAncestor(newRoot, path));
      this.activePath = path;
      needPatch = true;
    }

    needPatch && this.activeBlock?.patch(newRoot);
  }

  focusOn(activeBlock = this.activeBlock, fenceOffset = this.fenceOffset) {
    if (activeBlock === null || fenceOffset === null) return;
    if (!this.activeBlock) {
      this.el.style.display = 'inline-block';
    }

    this.activeBlock = activeBlock;
    this.fenceOffset = fenceOffset;

    // try to active syntax node, expect of Pure Plain-Text Node
    const { vNode, textOffset } = this.fence.fenceList[fenceOffset];
    this.trySwitchActiveSyntaxNode(vNode);

    // move cursor
    const { fenceList, lineHeight, y } = this.fence;
    const { cursorOffset: curOffset } = fenceList[this.fenceOffset];
    // const { cursorOffset: nextOffset } = fenceList[fenceOffset + 1];

    // re-render the cursor
    this.setShape(2, lineHeight, curOffset, y);
  }

  unFocus() {
    if (this.activeBlock) {
      this.el.style.display = 'none';

      this.fenceOffset = null;
      this.activeBlock = null;
    }
  }

  left() {
    if (this.fenceOffset !== null && this.fenceOffset !== 0) {
      this.fenceOffset--;
      this.focusOn();
    }
  }

  right() {
    if (
      this.fenceOffset !== null &&
      // this.fenceOffset !== this.fence.fenceList.length - 2
      this.fenceOffset !== this.fence.fenceList.length - 1
    ) {
      this.fenceOffset++;
      this.focusOn();
    }
  }

  up() {
    if (
      this.fenceOffset !== null &&
      this.activeBlock &&
      this.activeBlock.prev
    ) {
      const prevOffset = this.fenceOffset;
      this.activeBlock = this.activeBlock.prev;
      const curLength = this.fence.fenceList.length;
      this.fenceOffset =
        prevOffset >= curLength - 2 ? curLength - 2 : this.fenceOffset;

      this.focusOn();
    }
  }

  down() {
    if (
      this.fenceOffset !== null &&
      this.activeBlock &&
      this.activeBlock.next
    ) {
      const prevOffset = this.fenceOffset;
      this.activeBlock = this.activeBlock.next;
      const curLength = this.fence.fenceList.length;
      this.fenceOffset =
        prevOffset >= curLength - 2 ? curLength - 2 : this.fenceOffset;

      this.focusOn();
    }
  }
}
