import { appendChild, createDomNode } from 'lib/utils';
import { Block, textContent } from 'lib/model';
import { switchActiveNode } from './switchActiveMarker';
import { SyntaxNode } from 'lib/types';

export class Selection {
  private el: HTMLElement;
  private activeBlock: Block | null;
  private activePath: Array<number> | null;
  private fenceOffset: number | null;

  constructor(container: HTMLElement) {
    this.el = createDomNode('span', ['r-cursor-test']);
    this.activeBlock = null;
    this.fenceOffset = null;
    this.activePath = null;

    appendChild(container, this.el);
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

  focusOn(activeBlock = this.activeBlock, fenceOffset = this.fenceOffset) {
    if (activeBlock === null || fenceOffset === null) return;
    if (!this.activeBlock) {
      this.el.style.display = 'inline-block';
    }

    this.activeBlock = activeBlock;
    this.fenceOffset = fenceOffset;

    // TODO patch when focus on the edge of syntax nodes

    const { vNode: target, textOffset } = this.fence.fenceList[fenceOffset];

    console.log(textOffset);

    // TODO when switch the active of the marker node
    // if (textOffset === 0 || textOffset === textContent(target!).length - 1) {
    //   const newVNode = switchActiveNode(activeBlock.vNode!, target!);
    //   activeBlock.patch(newVNode as SyntaxNode);
    //   this.fenceOffset += 2;
    // } else if (this.isActiveMaker) {
    //   const newVNode = switchActiveNode(activeBlock.vNode!, target!);
    //   activeBlock.patch(newVNode as SyntaxNode);
    //   this.fenceOffset -= 2;
    // }

    // move cursor

    const { fenceList, lineHeight, y } = this.fence;
    const { cursorOffset: curOffset } = fenceList[this.fenceOffset];
    // const { cursorOffset: nextOffset } = fenceList[fenceOffset + 1];

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
