import { EventBus, Selection, textContent } from 'lib/model';
import {
  ClientRect,
  EditorConfig,
  ListView,
  Operable,
  Snapshot,
  State,
} from 'lib/types';
import { max, throttle } from 'lib/utils';
import { Renderer } from 'lib/view';

export class Viewport {
  private renderer: Renderer;
  private config: EditorConfig;

  private listView: ListView;
  private selection: Selection;

  // TEMP
  private cursorRect: ClientRect | null;

  private _top: Operable | null;
  private _bottom: Operable | null;

  // Enhance readability
  // HeightOfListViewSlice - HeightOfViewport
  private _vertialGapBetweenModelAndView: number;
  private _vertailExcessBetweenModelAndView: number;

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

    this._top = null;
    this._bottom = null;

    this._vertialGapBetweenModelAndView = 0;
    this._vertailExcessBetweenModelAndView = 0;

    // TODO debug
    container.addEventListener(
      'wheel',
      throttle(e => {
        console.log(`scroll ${e.deltaY}`);
        this.scroll(e.deltaY);
      }, 1000 / 120)
    );
    // container.addEventListener('click', () => {
    //   this.scroll(500);
    // });
  }

  get gap() {
    return this._vertialGapBetweenModelAndView;
  }
  set gap(offset: number) {
    this._vertialGapBetweenModelAndView = offset;
  }

  get excess() {
    return this._vertailExcessBetweenModelAndView;
  }
  set excess(offset: number) {
    this._vertailExcessBetweenModelAndView = offset;
  }

  get height() {
    return this.gap + this.excess + this.renderer.viewportRect.height;
  }

  get top() {
    // TODO calculate top and offset

    if (!this._top) {
      this._top = this.listView.head;
    }

    return this._top;
  }
  set top(top: Operable | null) {
    this._top = top;
  }
  get bottom() {
    // TODO calculate bottom and offset
    return this._bottom;
  }
  set bottom(bottom: Operable | null) {
    this._bottom = bottom;
  }

  get snapshot(): Snapshot {
    // TODO
    return {
      cursor: {
        block: null,
        offset: 0,
      },
    };
  }
  set snapshot(snapshot: Snapshot) {
    // TODO
  }

  // Return true if the height of the list view is enough to fill the viewport.
  private isEnough(height: number) {
    return height - this.gap >= this.renderer.viewportRect.height;
  }

  private shadowExcess() {
    const excessRect = {
      clientX: this.renderer.viewportRect.clientX,
      clientY:
        this.renderer.viewportRect.height +
        this.renderer.viewportRect.clientY +
        2,
      width: this.renderer.viewportRect.width,
      height: this.excess,
    };
    // this.renderer.renderRect(excessRect);
    this.renderer.clearRect(excessRect);

    const gapRect = {
      clientX: this.renderer.viewportRect.clientX,
      // Transform `Rect` to `ClientRect`
      clientY: this.renderer.viewportRect.clientY - this.gap - 2,
      width: this.renderer.viewportRect.width,
      height: this.gap,
    };
    // this.renderer.renderRect(gapRect);
    this.renderer.clearRect(gapRect);
  }

  private lazyRender() {
    if (!this.top) return;

    const targetVNode = this.selection.state?.vNode;
    let totalHeight = 0;
    let currentOffsetY = -this.gap;
    const offsetX = this.renderer.viewportRect.clientX;
    const offsetY = this.renderer.viewportRect.clientY;

    for (const node of this.listView.iter(this.top)) {
      const { vNode } = node;
      const text = textContent(vNode);

      const { rectList, lineRect } = this.renderer.renderVNodeInto(vNode, [
        offsetX,

        // Transform `Rect` to `ClientRect`
        currentOffsetY + offsetY,
      ]);

      if (vNode === targetVNode && this.selection.state) {
        this.renderCursor(
          rectList[this.selection.state.offset],
          rectList,
          this.selection.state
        );
      }

      totalHeight += lineRect.height;
      currentOffsetY += lineRect.height;
      node.rect = lineRect;

      if (this.isEnough(totalHeight)) {
        this.excess =
          totalHeight - this.gap - this.renderer.viewportRect.height;
        this.bottom = node;

        this.shadowExcess();
        break;
      }
    }
  }

  private fullRender() {
    if (!this.top) return;

    // TODO Traverse vNode, if the current cursor area is hit, start recording lineRect and rendering the cursor.
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

  render() {
    // this.renderer.clearRect(this.renderer.viewportRect);
    this.renderer.clearCanvasRect();

    if (this.config.render.isLazy) {
      this.lazyRender();
    } else {
      this.fullRender();
    }

    this.debug();
  }

  scroll(offset: number) {
    if (!this.top || offset === 0) return;

    if (offset > 0) {
      this.scrollToDown(offset);
    } else {
      this.scrollToUp(offset);
    }
  }

  private scrollToDown(offset: number) {
    if (!this.bottom?.next) return;

    // FIXME panic when the offset is too large
    this.gap += offset;
    while (this.top && this.top.next && this.gap >= this.top.rect.height) {
      this.gap -= this.top.rect.height;
      this.top = this.top.next;
    }

    this.render();
  }
  private scrollToUp(offset: number) {
    if (!this.top?.prev && this.gap <= 0) return;

    this.gap += offset;
    while (this.top && this.top.prev && this.gap < 0) {
      this.gap += this.top.rect.height;
      this.top = this.top.prev;
    }

    this.render();
  }

  renderEditableRect() {
    this.renderer.renderRect(this.renderer.viewportRect);
  }

  private debug() {
    this.renderer.renderRect(this.renderer.viewportRect);

    this.renderer.fillRect({
      clientX: this.renderer.viewportRect.width / 2,
      clientY: this.renderer.viewportRect.clientY - this.gap,
      width: this.renderer.viewportRect.width / 2,
      height: this.gap,
    });
    this.renderer.fillRect({
      clientX: this.renderer.viewportRect.width / 2,
      clientY:
        this.renderer.viewportRect.clientY + this.renderer.viewportRect.height,
      width: this.renderer.viewportRect.width / 2,
      height: this.excess,
    });

    let cur = this.top;
    while (cur && cur.prev !== this.bottom) {
      const rect = cur.rect;

      this.renderer.renderRect({
        ...rect,
        clientX: rect.clientX + this.renderer.viewportRect.width / 2,
      });
      cur = cur.next;
    }
  }
}
