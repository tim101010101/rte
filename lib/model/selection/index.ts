import {
  Operable,
  ActivePos,
  Pos,
  EventInteroperableObject,
  VirtualNode,
  EventListener,
  EventName,
  InnerEventListener,
  Point,
  VNodeEventListener,
  VNodeKeyboardEventName,
  VNodeMouseEventName,
  VNodeMouseEvent,
  VNodeKeyboardEvent,
  ClientRect,
} from 'lib/types';
import { EventBus } from 'lib/model';
import { Renderer } from 'lib/view';
import { InnerEventName } from 'lib/static';
import { panicAt } from 'lib/utils';

export class Selection extends EventInteroperableObject {
  private renderer: Renderer;
  private pos: Pos | null;
  private active: ActivePos | null;

  private _rect: ClientRect | null;

  constructor(renderer: Renderer, eventBus: EventBus) {
    super(eventBus);

    this.renderer = renderer;

    this.pos = null;
    this.active = null;

    this._rect = null;
  }

  private get rect(): ClientRect {
    if (!this._rect) {
      return panicAt('');
    }
    return this._rect;
  }

  private setPos({ block, offset }: Pos) {
    const { rect } = block.getFenceInfo(offset);
    const { height, clientX, clientY } = rect;

    // TODO
  }

  addEventListener(
    eventName: VNodeMouseEventName,
    listener: VNodeEventListener<VNodeMouseEvent>
  ): void;
  addEventListener(
    eventName: VNodeKeyboardEventName,
    listener: VNodeEventListener<VNodeKeyboardEvent>
  ): void;
  addEventListener(
    eventName: InnerEventName,
    listener: InnerEventListener<any>
  ): void;
  addEventListener(eventName: EventName, listener: EventListener): void {
    // TODO
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
