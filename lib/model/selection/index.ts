import { appendChild, createDomNode, min } from 'lib/utils';
import { Block } from 'lib/model';
import { ActivePos, Pos, SyntaxNode } from 'lib/types';
import { ClassName, TagName } from 'lib/static';
import { trySwitchActiveSyntaxNode } from './switchActive';
import { tryActiveWhenInput } from './updateBlockContent';

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

  private setPos({ block, offset }: Pos) {
    const { rect, cursorOffset } = block.getFenceInfo(offset);
    const { height, y } = rect;

    this.setShape(2, height, cursorOffset, y);
  }

  focusOn(block: Block, offset: number, isCrossLine: boolean) {
    // show the cursor when the page focused for the first time
    if (!this.pos) {
      this.el.style.display = 'inline-block';
    }

    // attempt to activate and deactivate syntax node
    // return new position of cursor and the activated node
    const { pos, active } = trySwitchActiveSyntaxNode(
      this.pos,
      { block, offset },
      this.active,
      isCrossLine
    );

    // update position of cursor
    this.setPos(pos);

    // update the pos and active
    this.pos = pos;
    this.active = active;
  }

  unFocus() {
    if (this.pos) {
      this.el.style.display = 'none';

      this.pos = null;
    }
  }

  left() {
    if (!this.pos) return;
    const { block, offset } = this.pos;

    if (offset !== 0) {
      this.focusOn(block, offset - 1, false);
    }
  }

  right() {
    if (!this.pos) return;
    const { block, offset } = this.pos;

    if (
      // this.fenceOffset !== this.fence.fenceList.length - 2
      offset !==
      block.fenceLength - 1
    ) {
      this.focusOn(block, offset + 1, false);
    }
  }

  up() {
    if (!this.pos) return;
    const { block, offset } = this.pos;

    if (block.prev) {
      this.focusOn(block.prev, min(offset, block.prev.fenceLength - 1), true);
    }
  }

  down() {
    if (!this.pos) return;
    const { block, offset } = this.pos;

    if (block.next) {
      this.focusOn(block.next, min(offset, block.next.fenceLength - 1), true);
    }
  }

  updateBlockContent(char: string, parser: (src: string) => SyntaxNode) {
    if (!this.pos) return;

    // try to activate the node which being updated
    this.active = tryActiveWhenInput(this.pos, char, parser);

    // move cursor right
    const { block, offset } = this.pos;
    this.focusOn(block, offset + 1, false);
  }
}
