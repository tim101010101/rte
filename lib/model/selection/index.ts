import { appendChild, createDomNode, min } from 'lib/utils';
import { Block } from 'lib/model';
import { VirtualNode } from 'lib/types';
import { trySwitchActiveSyntaxNode } from './switchActiveMarker';
import { ClassName, TagName } from 'lib/static';

export interface Pos {
  block: Block;
  fenceOffset: number;
}

export interface ActivePos {
  block: Block;
  offset: number;
}

export class Selection {
  private el: HTMLElement;
  private pos?: Pos | null;
  private active?: ActivePos | null;

  constructor(container: HTMLElement) {
    this.el = createDomNode(TagName.SPAN, [ClassName.RTE_CURSOR]);

    appendChild(container, this.el);
  }

  private setShape(width: number, height: number, left: number, top: number) {
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.style.left = `${left}px`;
    this.el.style.top = `${top}px`;
  }

  private setPos({ block, fenceOffset }: Pos) {
    const { fence } = block;
    const { fenceList, lineHeight, y } = fence;
    const offset = fenceList[fenceOffset].cursorOffset;

    this.setShape(2, lineHeight, offset, y);
  }

  focusOn(block: Block, fenceOffset: number, isCrossLine: boolean) {
    if (!this.pos) {
      this.el.style.display = 'inline-block';
    }

    const { pos, active } = trySwitchActiveSyntaxNode(
      {
        block,
        fenceOffset,
      },
      isCrossLine,
      this.active
    );

    this.pos = pos;
    this.active = active;

    // re-render the cursor
    this.setPos(pos);
  }

  unFocus() {
    if (this.pos) {
      this.el.style.display = 'none';

      this.pos = null;
    }
  }

  left() {
    if (!this.pos) return;
    const { block, fenceOffset } = this.pos;

    if (fenceOffset !== 0) {
      this.focusOn(block, fenceOffset - 1, false);
    }
  }

  right() {
    if (!this.pos) return;
    const { block, fenceOffset } = this.pos;

    if (
      // this.fenceOffset !== this.fence.fenceList.length - 2
      fenceOffset !==
      block.fence.fenceList.length - 1
    ) {
      this.focusOn(block, fenceOffset + 1, false);
    }
  }

  up() {
    if (!this.pos) return;
    const { block, fenceOffset } = this.pos;

    if (block.prev) {
      const nextFenceLength = block.prev.fence.fenceList.length;
      this.focusOn(block.prev, min(fenceOffset, nextFenceLength - 1), true);
    }
  }

  down() {
    if (!this.pos) return;
    const { block, fenceOffset } = this.pos;

    if (block.next) {
      const nextFenceLength = block.next.fence.fenceList.length;
      this.focusOn(block.next, min(fenceOffset, nextFenceLength - 1), true);
    }
  }

  updateActiveBlockContent(
    char: string,
    parser: (src: string) => VirtualNode
  ) {}
}
