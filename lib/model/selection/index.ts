import { appendChild, createDomNode, isNumber } from 'lib/utils';
import { Block, isPureTextNode } from 'lib/model';
import { tryActiveNode } from './switchActiveMarker';
import { SetterFunction, TextNode } from 'lib/types';

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

  focusOn(activeBlock = this.activeBlock, fenceOffset = this.fenceOffset) {
    if (activeBlock === null || fenceOffset === null) return;
    if (!this.activeBlock) {
      this.el.style.display = 'inline-block';
    }

    this.activeBlock = activeBlock;
    this.fenceOffset = fenceOffset;

    // try to active syntax node, expect of Pure Plain-Text Node
    const { vNode, textOffset } = this.fence.fenceList[fenceOffset];
    if (!isPureTextNode(vNode)) {
      const fenceOffsetSetter = tryActiveNode(activeBlock, vNode, textOffset);
      fenceOffsetSetter && this.setFenceOffset(fenceOffsetSetter);
    }

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
