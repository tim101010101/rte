import { appendChild, createDomNode } from '../utils';
import { Block } from '../virtualNode/block';

export class Selection {
  private el: HTMLElement;
  private activeBlock: Block | null;
  private fenseOffset: number | null;

  constructor(container: HTMLElement) {
    this.el = createDomNode('span', ['r-cursor-test']);
    this.activeBlock = null;
    this.fenseOffset = null;

    appendChild(container, this.el);
  }

  private get fence() {
    return this.activeBlock!.fence;
  }

  focusOn(activeBlock = this.activeBlock, fenseOffset = this.fenseOffset) {
    if (activeBlock === null || fenseOffset === null) return;

    if (!this.activeBlock) {
      this.el.style.display = 'inline-block';
    }

    this.activeBlock = activeBlock;
    this.fenseOffset = fenseOffset;

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

      this.fenseOffset = null;
      this.activeBlock = null;
    }
  }

  // friendly testing
  left() {
    if (this.fenseOffset !== null && this.fenseOffset !== 0) {
      this.fenseOffset--;
      this.focusOn();
    }
  }

  right() {
    if (
      this.fenseOffset !== null &&
      this.fenseOffset !== this.fence.length - 2
    ) {
      this.fenseOffset++;
      this.focusOn();
    }
  }

  up() {
    if (
      this.fenseOffset !== null &&
      this.activeBlock &&
      this.activeBlock.prev
    ) {
      this.activeBlock = this.activeBlock.prev as Block;
      this.focusOn();
    }
  }

  down() {
    if (
      this.fenseOffset !== null &&
      this.activeBlock &&
      this.activeBlock.next
    ) {
      this.activeBlock = this.activeBlock.next as Block;
      this.focusOn();
    }
  }
}
