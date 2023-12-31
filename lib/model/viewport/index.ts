import { EventBus, Selection } from 'lib/model';
import {
  ClientRect,
  EditorConfig,
  ListView,
  Operable,
  RenderWindow,
  Snapshot,
  State,
} from 'lib/types';
import { get, max, throttle } from 'lib/utils';
import { Renderer } from 'lib/view';

export class Viewport {
  private renderer: Renderer;
  private config: EditorConfig;

  private listView: ListView;
  private selection: Selection;

  // TEMP
  private cursorRect: ClientRect | null;

  private top: Operable | null;
  private bottom: Operable | null;

  private _totalGap: number;

  private gap: number;
  private excess: number;

  private _snapshot: Snapshot | null;

  constructor(
    container: HTMLElement,
    config: EditorConfig,
    eventBus: EventBus,
    listView: ListView,
    selection: Selection
  ) {
    this.renderer = new Renderer(container, eventBus, config);
    this.config = config;

    this.listView = listView;
    this.selection = selection;

    this.cursorRect = null;

    this.top = null;
    this.bottom = null;

    this._totalGap = 0;

    this.gap = 0;
    this.excess = 0;

    this._snapshot = null;

    // TODO debug
    container.addEventListener(
      'wheel',
      throttle(e => {
        this.render(e.deltaY);
      }, 1000 / 120)
    );

    container.addEventListener('click', () => {
      this.render(500);
    });
  }

  get snapshot(): Snapshot {
    if (!this._snapshot) {
      this._snapshot = {
        cursor: {
          block: null,
          offset: 0,
        },
        window: {
          gap: this.gap,
          top: this.top!,
          slice: this.slice(this.top, this.bottom),
          excess: this.excess,
          bottom: this.bottom!,
        },
      };
    }

    return this._snapshot;
  }
  set snapshot(snapshot: Snapshot) {
    const { cursor, window } = snapshot;

    this.renderer.renderWindow(window);

    // TODO render cursor

    const { gap, top, excess, bottom } = window;
    this.top = top;
    this.gap = gap;
    this.bottom = bottom;
    this.excess = excess;

    this._snapshot = snapshot;
  }

  private slice(top: Operable | null, bottom: Operable | null) {
    const res = [];

    let cur = top;
    while (cur && cur.prev !== bottom) {
      res.push(cur.snapshot());
      cur = cur.next;
    }

    return res;
  }

  render(offset = 0) {
    if (!this.top) this.top = this.listView.head;

    this.renderer.clearCanvasRect();

    const window =
      offset > 0 ? this.moveWindowDown(offset) : this.moveWindowUp(offset);

    if (window) {
      this.snapshot = {
        cursor: {
          block: null,
          offset: 0,
        },
        window,
      };

      this.debug(window);
    }
  }

  private moveWindowDown(offset: number): RenderWindow | null {
    if (!this.bottom?.next && !this.excess && !offset) return null;

    let bottom = this.bottom!;
    let excess = this.excess;

    excess -= offset;
    offset -= this.excess;
    while (bottom?.next && excess < 0) {
      const lineHeight = this.renderer.calcLineHeight(bottom.next.vNode);
      excess += lineHeight;
      offset -= lineHeight;
      bottom = bottom.next;
    }

    // Restricted location
    if (!bottom?.next && excess < 0 && offset > 0) {
      excess = 0;
    }

    // Position the top
    let top = bottom!;
    let height = this.renderer.calcLineHeight(top.vNode) - excess;
    while (top.prev && height < this.renderer.viewportRect.height) {
      height += this.renderer.calcLineHeight(top.prev.vNode);
      top = top.prev;
    }
    const gap = max(height - this.renderer.viewportRect.height, 0);

    return {
      gap,
      top,
      slice: this.slice(top, bottom),
      excess,
      bottom,
    };
  }
  private moveWindowUp(offset: number): RenderWindow | null {
    if (!this.top?.prev && this.gap < 0) return null;

    let gap = this.gap;
    let top = this.top!;

    gap += offset;
    this._totalGap += offset;
    while (top && top.prev && gap < 0) {
      gap += this.renderer.calcLineHeight(top.vNode);
      top = top.prev;
    }

    // Restricted location
    gap = max(gap, 0);
    this._totalGap = max(this._totalGap, 0);

    let bottom = top!;
    let height = this.renderer.calcLineHeight(bottom.vNode) - gap;
    while (bottom.next && height < this.renderer.viewportRect.height) {
      height += this.renderer.calcLineHeight(bottom.next.vNode);
      bottom = bottom.next;
    }
    const excess = max(height - this.renderer.viewportRect.height, 0);

    return {
      gap,
      top,
      slice: this.slice(top, bottom),
      excess,
      bottom,
    };
  }

  private debug(window: RenderWindow) {
    const { gap, slice, excess } = window;

    this.renderer.renderRect(this.renderer.viewportRect);

    this.renderer.fillRect({
      clientX: this.renderer.viewportRect.width / 2,
      clientY: this.renderer.viewportRect.clientY - gap,
      width: this.renderer.viewportRect.width / 2,
      height: gap,
    });
    this.renderer.fillRect({
      clientX: this.renderer.viewportRect.width / 2,
      clientY:
        this.renderer.viewportRect.clientY + this.renderer.viewportRect.height,
      width: this.renderer.viewportRect.width / 2,
      height: excess,
    });

    for (const node of slice) {
      const rect = get(node, 'rect') || {};

      this.renderer.renderRect({
        ...rect,
        clientX: rect?.clientX + this.renderer.viewportRect.width / 2,
      });
    }
  }

  private renderCursor(
    rect: ClientRect,
    // TEMP
    _rectList: Array<ClientRect>,
    _state: State
  ) {
    const { height, clientX, clientY } = rect;
    this.renderer.renderCursor(
      { clientX, clientY, height, width: 2 },
      this.cursorRect
    );
  }
}
