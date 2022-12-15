import { appendChild, createDomNode, getNearestIdx } from '../utils';
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

  setPos(
    x: number,
    y: number,
    width: number,
    height: number,
    activeBlock: Block,
    fenseOffset: number
  ) {
    if (!this.activeBlock) {
      this.el.style.display = 'inline-block';
    }

    this.activeBlock = activeBlock;
    this.fenseOffset = fenseOffset;

    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
  }

  // friendly testing
  left() {
    if (this.fenseOffset && this.fenseOffset !== 0) {
      this.fenseOffset--;

      const fence = this.activeBlock!.fence;
      const offset = fence[this.fenseOffset];
      const { height, top } = this.activeBlock!.rectList[0];
      this.setPos(
        offset,
        top,
        fence[this.fenseOffset + 1] - fence[this.fenseOffset],
        height,
        this.activeBlock!,
        this.fenseOffset
      );
    }
  }

  right() {
    if (this.fenseOffset && this.fenseOffset !== 0) {
      this.fenseOffset++;

      const fence = this.activeBlock!.fence;
      const offset = fence[this.fenseOffset];
      const { height, top } = this.activeBlock!.rectList[0];
      this.setPos(
        offset,
        top,
        fence[this.fenseOffset + 1] - fence[this.fenseOffset],
        height,
        this.activeBlock!,
        this.fenseOffset
      );
    }
  }
}
