import { appendChild, createDomNode, insertAt, min, sum } from 'lib/utils';
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
  private pos: Pos | null;
  private active: ActivePos | null;

  constructor(container: HTMLElement) {
    this.el = createDomNode(TagName.SPAN, [ClassName.RTE_CURSOR]);
    this.pos = null;
    this.active = null;

    appendChild(container, this.el);
  }

  private setShape(width: number, height: number, left: number, top: number) {
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.style.left = `${left}px`;
    this.el.style.top = `${top}px`;
  }

  private setPos({ block, fenceOffset }: Pos) {
    // const { fence } = block;
    // const { fenceList, lineHeight, y } = fence;
    // const offset = fenceList[fenceOffset].cursorOffset;
    // this.setShape(2, lineHeight, offset, y);
  }

  // TODO to be optimized
  private getCorrectPos(block: Block, fenceOffset: number) {
    const fence = block.fence;
    for (let i = 0; i < fence.length; i++) {
      const { fenceList, vNode, rect } = fence[i];
      const len = fenceList.length;
      if (fenceOffset >= len) {
        fenceOffset -= len;
      } else {
        return {
          vNode,
          rect,
          ancestorOffset: i,
          cursorInfo: fenceList[fenceOffset],
        };
      }
    }
  }

  focusOn(block: Block, fenceOffset: number, isCrossLine: boolean) {
    if (!this.pos) {
      this.el.style.display = 'inline-block';
    }

    const { pos, active } = trySwitchActiveSyntaxNode(
      this.pos,
      { block, fenceOffset },
      this.active,
      isCrossLine
    );

    this.pos = pos;
    this.active = active;

    const { cursorInfo, rect, vNode, ancestorOffset } = this.getCorrectPos(
      pos.block,
      pos.fenceOffset
    )!;

    const { height, y } = rect;
    const { cursorOffset } = cursorInfo;
    this.setShape(2, height, cursorOffset, y);
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
      sum(block.fence.map(({ fenceList }) => fenceList.length)) - 1
    ) {
      this.focusOn(block, fenceOffset + 1, false);
    }
  }

  up() {
    if (!this.pos) return;
    const { block, fenceOffset } = this.pos;

    if (block.prev) {
      const nextFenceLength = sum(
        block.prev.fence.map(({ fenceList }) => fenceList.length)
      );
      this.focusOn(block.prev, min(fenceOffset, nextFenceLength - 1), true);
    }
  }

  down() {
    if (!this.pos) return;
    const { block, fenceOffset } = this.pos;

    if (block.next) {
      const nextFenceLength = sum(
        block.next.fence.map(({ fenceList }) => fenceList.length)
      );
      this.focusOn(block.next, min(fenceOffset, nextFenceLength - 1), true);
    }
  }

  updateBlockContent(char: string, parser: (src: string) => VirtualNode) {
    // TODO
  }
}
