import {
  Operable,
  ActivePos,
  Pos,
  EventInteroperableObject,
  ClientRect,
  SyntaxNode,
  VirtualNode,
} from 'lib/types';
import { EventBus } from 'lib/model';
import { Renderer } from 'lib/view';
import {
  InnerEventName,
  VNodeEventName,
  ControlKey,
  ShowableKey,
} from 'lib/static';
import { panicAt } from 'lib/utils';

const { KEYDOWN } = VNodeEventName;
const { FOCUS_ON, UNFOCUS } = InnerEventName;

export class Selection extends EventInteroperableObject {
  rect: ClientRect | null;

  private renderer: Renderer;
  private pos: Pos | null;
  private active: Array<ActivePos>;
  private parser: (src: string) => SyntaxNode;

  constructor(
    renderer: Renderer,
    eventBus: EventBus,
    parser: (src: string) => SyntaxNode
  ) {
    super(eventBus);

    this.renderer = renderer;
    this.rect = null;
    this.pos = null;
    this.active = [];
    this.parser = parser;
  }

  private setPos(rect: ClientRect | null) {
    if (rect) {
      const { height, clientX, clientY } = rect;
      this.renderer.renderCursor(
        { clientX, clientY, height, width: 2 },
        this.rect
      );
      this.rect = rect;
    } else if (this.rect) {
      this.renderer.clearCursor(this.rect);
      this.rect = null;
    }
  }

  initEventListener() {
    this.addEventListener(FOCUS_ON, ({ block, offset }) => {
      this.focusOn(block, offset);
    });
    this.addEventListener(KEYDOWN, e => {
      switch (e.key) {
        case ControlKey.ARROW_UP:
          this.up();
          break;
        case ControlKey.ARROW_DOWN:
          this.down();
          break;
        case ControlKey.ARROW_LEFT:
          this.left();
          break;
        case ControlKey.ARROW_RIGHT:
          this.right();
          break;

        case ControlKey.BACKSPACE:
          this.delete(this.parser);
          break;

        case 'a':
        case '*':
          this.updateBlockContent(e.key, this.parser);
          break;

        default:
          break;
      }
    });
  }

  focusOn(block: Operable, offset: number) {
    const { rect, pos, active } = block.focusOn(this.pos, offset, this.active);

    // update position of cursor
    this.setPos(rect);

    // update the pos and active
    this.pos = pos;
    this.active = active;
  }
  unFocus() {
    if (this.pos && this.rect) {
      this.renderer.clearCursor(this.rect);
      this.rect = null;

      const { pos, active } = this.pos.block.unFocus(this.pos, this.active);
      this.pos = pos;
      this.active = active;
    }
  }

  left(offset: number = 1) {
    if (!this.pos) return;
    const nextPos = this.pos.block.left(this.pos, this.active, offset);
    if (nextPos) {
      const { rect, pos, active } = nextPos;
      this.setPos(rect);

      this.pos = pos;
      this.active = active;
    }
  }
  right(offset: number = 1) {
    if (!this.pos) return;
    const nextPos = this.pos.block.right(this.pos, this.active, offset);
    if (nextPos) {
      const { rect, pos, active } = nextPos;
      this.setPos(rect);

      this.pos = pos;
      this.active = active;
    }
  }
  up(offset: number = 1) {
    if (!this.pos) return;
    const nextPos = this.pos.block.up(this.pos, this.active, offset);
    if (nextPos) {
      const { rect, pos, active } = nextPos;
      this.setPos(rect);

      this.pos = pos;
      this.active = active;
    }
  }
  down(offset: number = 1) {
    if (!this.pos) return;
    const nextPos = this.pos.block.down(this.pos, this.active, offset);
    if (nextPos) {
      const { rect, pos, active } = nextPos;
      this.setPos(rect);

      this.pos = pos;
      this.active = active;
    }
  }

  newLine(parser: (src: string) => SyntaxNode) {
    if (!this.pos) return;

    const { pos, active } = this.pos.block.newLine(this.pos.offset, parser);
    this.active = active;
    this.pos = pos;

    if (pos) {
      const { block, offset } = pos;
      this.focusOn(block, offset);
    }
  }

  updateBlockContent(char: string, parser: (src: string) => SyntaxNode) {
    if (!this.pos) return;

    const { pos, active } = this.pos.block.update(
      char,
      this.pos.offset,
      parser
    );
    this.active = active;
    this.pos = pos;

    // move cursor right
    if (pos) {
      const { block, offset } = pos;
      this.focusOn(block, offset);
    }
  }

  delete(parser: (src: string) => SyntaxNode) {
    if (!this.pos) return;

    const { pos, active } = this.pos.block.delete(this.pos.offset, parser);
    this.active = active;
    this.pos = pos;

    if (pos) {
      const { block, offset } = pos;
      this.focusOn(block, offset);
    }
  }
}
