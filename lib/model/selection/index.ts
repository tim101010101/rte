import { appendChild, createDomNode, insertAt, isNumber, min } from 'lib/utils';
import {
  Block,
  deepCloneWithTrackNode,
  getAncestor,
  isPureTextAncestor,
  textContentWithMarker,
} from 'lib/model';
import { SetterFunction, VirtualNode } from 'lib/types';
import { activeSubTree, cancelActiveSubTree } from './switchActiveMarker';
import { ClassName, TagName } from 'lib/static';

export class Selection {
  private el: HTMLElement;
  private pos?: { block: Block; fenceOffset: number } | null;
  private active?: { block: Block; path: Array<number> } | null;

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

  private trySwitchActiveSyntaxNode(block: Block, posPath: Array<number>) {
    let needPath = false;
    const [newRoot] = deepCloneWithTrackNode(block.vNode!);

    if (this.active && this.active.block !== this.pos?.block) {
      const [prevActive] = deepCloneWithTrackNode(this.active.block.vNode!);

      cancelActiveSubTree(getAncestor(prevActive, this.active.path));

      this.active.block.patch(prevActive);

      this.active = null;
      needPath = true;
    } else if (this.active && this.active.path[0] !== posPath[0]) {
      cancelActiveSubTree(getAncestor(newRoot, this.active.path));

      this.active = null;
      needPath = true;
    }

    if (!this.active && !isPureTextAncestor(newRoot, posPath)) {
      activeSubTree(getAncestor(newRoot, posPath));
      this.active = { block, path: posPath };
      needPath = true;
    }

    needPath && this.pos!.block.patch(newRoot);
  }

  focusOn(targetBlock: Block, fenceOffset: number) {
    if (!this.pos) {
      this.el.style.display = 'inline-block';
    }

    this.pos = {
      block: targetBlock,
      fenceOffset,
    };

    const fence = this.pos.block.fence;
    const { path } = fence.fenceList[fenceOffset];

    this.trySwitchActiveSyntaxNode(targetBlock, path);

    const { fenceList, lineHeight, y } = fence;
    const { cursorOffset: curOffset } = fenceList[fenceOffset];

    // re-render the cursor
    this.setShape(2, lineHeight, curOffset, y);
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
      this.focusOn(block, fenceOffset - 1);
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
      this.focusOn(block, fenceOffset + 1);
    }
  }

  up() {
    if (!this.pos) return;
    const { block, fenceOffset } = this.pos;

    if (block.prev) {
      const curLength = block.fence.fenceList.length;
      this.focusOn(block.prev, min(fenceOffset, curLength - 2));
    }
  }

  down() {
    if (!this.pos) return;
    const { block, fenceOffset } = this.pos;

    if (block.next) {
      const curLength = block.fence.fenceList.length;
      this.focusOn(block.next, min(fenceOffset, curLength - 2));
    }
  }

  updateActiveBlockContent(
    char: string,
    parser: (src: string) => VirtualNode
  ) {}
}
