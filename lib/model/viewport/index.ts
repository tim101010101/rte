import { EventBus } from 'lib/model';
import {
  CursorInfo,
  EditorConfig,
  ListView,
  Operable,
  RenderWindow,
  SliceItemWithRect,
  Snapshot as BaseSnapshot,
} from 'lib/types';
import { assign, get, max } from 'lib/utils';
import { Renderer } from 'lib/view';

type Snapshot = BaseSnapshot<SliceItemWithRect>;

export class Viewport {
  private renderer: Renderer;
  private config: EditorConfig;

  private listView: ListView;

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
    listView: ListView
  ) {
    this.renderer = new Renderer(container, eventBus, config);
    this.config = config;

    this.listView = listView;

    this.top = null;
    this.bottom = null;

    this._totalGap = 0;

    this.gap = 0;
    this.excess = 0;

    this._snapshot = null;
  }

  // TODO PREF reduce the number of calls
  get snapshot(): Snapshot {
    // TODO FIXME update the snapshot of window
    if (!this._snapshot) {
      this._snapshot = {
        cursor: null,
        window: {
          gap: this.gap,
          top: this.top!,

          // TODO SAFETY
          slice: this.slice(this.top, this.bottom) as Array<SliceItemWithRect>,

          excess: this.excess,
          bottom: this.bottom!,
        },
      };
    }

    return this._snapshot;
  }
  set snapshot(snapshot: Snapshot) {
    const { window } = snapshot;
    snapshot = assign(snapshot, {
      window: {
        ...window,
        slice: this.slice(window.top, window.bottom),
      },
    });

    const snapshotWithRect = this.renderer.renderSnapshot(snapshot);

    const { gap, top, excess, bottom } = snapshotWithRect.window;
    this.top = top;
    this.gap = gap;
    this.bottom = bottom;
    this.excess = excess;

    this._snapshot = snapshotWithRect;
  }

  set cursor(cursorInfo: CursorInfo | null) {
    if (!this.snapshot) return;
    this.snapshot = assign(this.snapshot, { cursor: cursorInfo });
  }
  get cursor() {
    return this.snapshot.cursor;
  }
  set window(window: RenderWindow) {
    if (!this.snapshot) return;
    this.snapshot = assign(this.snapshot, { window });
  }
  get window() {
    return this.snapshot.window;
  }

  private slice(top: Operable | null, bottom: Operable | null) {
    const res = [];

    let cur = top;
    while (cur && cur.prev !== bottom) {
      const snapshot = cur.snapshot();
      res.push(snapshot);
      cur = cur.next;
    }

    return res;
  }

  render(offset = 0) {
    if (!this.top) {
      this.top = this.listView.head;
      this.bottom = this.top;
      this.excess = -(
        this.renderer.viewportRect.height -
        this.renderer.calcLineHeight(this.top!.vNode)
      );
    }

    const window = this.updateWindow(offset);
    if (window) {
      this.window = window;
      // this.debug(window);
    }
  }

  private updateWindow(offset: number): RenderWindow | null {
    if (offset > 0) {
      return this.moveWindowDown(offset);
    } else {
      return this.moveWindowUp(offset);
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
      gap += this.renderer.calcLineHeight(top.prev.vNode);
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
      const rect = get(node, 'rect').lineRect || {};

      this.renderer.renderRect({
        ...rect,
        clientX: rect?.clientX + this.renderer.viewportRect.width / 2,
      });
    }

    // console.log('snapshot', window);
  }
}
