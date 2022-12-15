import { appendChild, createDomNode } from '../utils';
import { Block } from '../virtualNode/block';

export class Selection {
  private el: HTMLElement;
  private activeBlock: Block | null;
  private fenceOffset: number | null;

  constructor(container: HTMLElement) {
    this.el = createDomNode('span', ['r-cursor-test']);
    this.activeBlock = null;
    this.fenceOffset = null;

    appendChild(container, this.el);
  }

  private get fence() {
    return this.activeBlock!.fence;
  }

  focusOn(activeBlock = this.activeBlock, fenseOffset = this.fenceOffset) {
    if (activeBlock === null || fenseOffset === null) return;

    if (!this.activeBlock) {
      this.el.style.display = 'inline-block';
    }

    this.activeBlock = activeBlock;
    this.fenceOffset = fenseOffset;

    const fence = this.fence;
    const x = fence[fenseOffset];
    const { height, y } = activeBlock.rectList[0];
    const width = fence[fenseOffset + 1] - fence[fenseOffset];

    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
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
      this.fenceOffset !== this.fence.length - 2
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
      const curFence = this.fence;
      this.fenceOffset =
        prevOffset >= curFence.length - 2
          ? curFence.length - 2
          : this.fenceOffset;

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
      const curFence = this.fence;
      this.fenceOffset =
        prevOffset >= curFence.length - 2
          ? curFence.length - 2
          : this.fenceOffset;

      this.focusOn();
    }
  }
}
