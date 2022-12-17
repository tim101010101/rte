import { appendChild, createDomNode } from 'lib/utils';
import { Block, textContent } from 'lib/model';
import { activeNode, cancelActiveNode } from './switchActiveMarker';

export class Selection {
  private el: HTMLElement;
  private activeBlock: Block | null;
  private fenceOffset: number | null;
  private isActiveMaker: boolean;

  constructor(container: HTMLElement) {
    this.el = createDomNode('span', ['r-cursor-test']);
    this.activeBlock = null;
    this.fenceOffset = null;
    this.isActiveMaker = false;

    appendChild(container, this.el);
  }

  private get fence() {
    return this.activeBlock!.fence;
  }

  focusOn(activeBlock = this.activeBlock, fenceOffset = this.fenceOffset) {
    if (activeBlock === null || fenceOffset === null) return;

    if (!this.activeBlock) {
      this.el.style.display = 'inline-block';
    }

    this.activeBlock = activeBlock;
    this.fenceOffset = fenceOffset;

    // TODO patch when focus on the edge of syntax nodes
    const {
      isInVNode,
      vNode: target,
      textOffset,
    } = this.fence.fenceList[fenceOffset];
    if (isInVNode) {
      if (
        !this.isActiveMaker &&
        (textOffset === 0 || textOffset === textContent(target!).length - 1)
      ) {
        activeNode(target!, activeBlock);

        this.isActiveMaker = true;
        this.fenceOffset += 2;
      } else if (this.isActiveMaker) {
        cancelActiveNode(target!, activeBlock);

        this.isActiveMaker = false;
        this.fenceOffset -= 2;
      }
    }

    const { fenceList, lineHeight, y } = this.fence;
    const { cursorOffset: curOffset } = fenceList[this.fenceOffset];
    // const { cursorOffset: nextOffset } = fenceList[fenceOffset + 1];

    this.el.style.left = `${curOffset}px`;
    this.el.style.top = `${y}px`;
    this.el.style.width = `${2}px`;
    this.el.style.height = `${lineHeight}px`;
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
