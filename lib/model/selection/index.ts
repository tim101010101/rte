import { appendChild, createDomNode } from 'lib/utils';
import { Block } from 'lib/model/block';
import { activeMarker, textContent } from 'lib/model/virtualNode';

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

  focusOn(activeBlock = this.activeBlock, fenceOffset = this.fenceOffset) {
    if (activeBlock === null || fenceOffset === null) return;

    if (!this.activeBlock) {
      this.el.style.display = 'inline-block';
    }

    this.activeBlock = activeBlock;
    this.fenceOffset = fenceOffset;

    const { fenceList, lineHeight, y } = this.fence;
    const { cursorOffset: curOffset } = fenceList[fenceOffset];
    // const { cursorOffset: nextOffset } = fenceList[fenceOffset + 1];

    this.el.style.left = `${curOffset}px`;
    this.el.style.top = `${y}px`;
    this.el.style.width = `${2}px`;
    this.el.style.height = `${lineHeight}px`;

    // TODO patch when focus on the edge of syntax nodes
    const { isInVNode, vNode, textOffset } = this.fence.fenceList[fenceOffset];
    if (isInVNode && vNode?.props.classList?.includes('r-bold')) {
      if (textOffset === 0 || textOffset === textContent(vNode).length - 1) {
        // TODO active the marker node
        const newVNode = activeMarker(activeBlock.vNode!, vNode);
        activeBlock.patch(newVNode);
      }
    }
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
