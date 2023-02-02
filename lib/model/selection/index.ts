import { Operable, ActivePos, Pos, SyntaxNode } from 'lib/types';
import { EventBus } from 'lib/model';
import { Renderer } from 'lib/view';

export class Selection {
  private renderer: Renderer;
  private eventBus: EventBus;

  private pos: Pos | null;
  private active: ActivePos | null;

  constructor(renderer: Renderer, eventBus: EventBus) {
    this.renderer = renderer;
    this.eventBus = eventBus;

    this.pos = null;
    this.active = null;
  }

  private setShape(width: number, height: number, left: number, top: number) {
    // TODO
  }

  private setPos({ block, offset }: Pos) {
    const { rect } = block.getFenceInfo(offset);
    const { height, x, y } = rect;

    this.setShape(2, height, x, y);
  }

  focusOn(block: Operable, offset: number) {
    // show the cursor when the page focused for the first time
    if (!this.pos) {
      // this.el.style.display = 'inline-block';
    }

    const { pos, active } = block.focusOn(this.pos, offset, this.active);

    // update position of cursor
    this.setPos(pos);

    // update the pos and active
    this.pos = pos;
    this.active = active;
  }
  unFocus() {
    if (this.pos) {
      // this.el.style.display = 'none';

      const { pos, active } = this.pos.block.unFocus();
      this.pos = pos;
      this.active = active;
    }
  }

  // left(offset: number = 1) {
  //   if (!this.pos) return;
  //   const nextPos = this.pos.block.left(this.pos, this.active, offset);
  //   if (nextPos) {
  //     const { pos, active } = nextPos;
  //     this.setPos(pos);

  //     this.pos = pos;
  //     this.active = active;
  //   }
  // }
  // right(offset: number = 1) {
  //   if (!this.pos) return;
  //   const nextPos = this.pos.block.right(this.pos, this.active, offset);
  //   if (nextPos) {
  //     const { pos, active } = nextPos;
  //     this.setPos(pos);

  //     this.pos = pos;
  //     this.active = active;
  //   }
  // }
  // up(offset: number = 1) {
  //   if (!this.pos) return;
  //   const nextPos = this.pos.block.up(this.pos, this.active, offset);
  //   if (nextPos) {
  //     const { pos, active } = nextPos;
  //     this.setPos(pos);

  //     this.pos = pos;
  //     this.active = active;
  //   }
  // }
  // down(offset: number = 1) {
  //   if (!this.pos) return;
  //   const nextPos = this.pos.block.down(this.pos, this.active, offset);
  //   if (nextPos) {
  //     const { pos, active } = nextPos;
  //     this.setPos(pos);

  //     this.pos = pos;
  //     this.active = active;
  //   }
  // }

  // newLine(parser: (src: string) => SyntaxNode) {
  //   if (!this.pos) return;

  //   const { pos, active } = this.pos.block.newLine(this.pos.offset, parser);
  //   this.active = active;
  //   this.pos = pos;

  //   const { block, offset } = pos;
  //   this.focusOn(block, offset);
  // }

  // updateBlockContent(char: string, parser: (src: string) => SyntaxNode) {
  //   if (!this.pos) return;

  //   const { pos, active } = this.pos.block.update(
  //     char,
  //     this.pos.offset,
  //     this.active,
  //     parser
  //   );
  //   this.active = active;
  //   this.pos = pos;

  //   // move cursor right
  //   const { block, offset } = pos;
  //   this.focusOn(block, offset);
  // }

  // delete(parser: (src: string) => SyntaxNode) {
  //   if (!this.pos) return;

  //   const { pos, active } = this.pos.block.delete(
  //     this.pos.offset,
  //     this.active,
  //     parser
  //   );
  //   this.active = active;
  //   this.pos = pos;

  //   const { block, offset } = pos;
  //   this.focusOn(block, offset);
  // }
}
