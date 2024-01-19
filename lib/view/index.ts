import { EventBus, walkTextNode } from 'lib/model';
import {
  ClientRect,
  CursorInfo,
  EditorConfig,
  FontInfo,
  RenderConfig,
  RenderSnapshot,
  RenderWindow,
  SliceItemWithRect,
  VirtualNode,
  VirtualNodeBehavior,
} from 'lib/types';
import { get, max, mixin, overlapNodes, set } from 'lib/utils';
import { Paint } from './paint';

const getRenderInfo = (
  isActive: boolean,
  font: FontInfo,
  behavior?: VirtualNodeBehavior
): RenderConfig | null => {
  const renderConfig = { font };

  if (behavior) {
    const { beforeActived, actived } = behavior;
    if (!isActive && beforeActived && beforeActived.show === false) return null;

    return !isActive && beforeActived
      ? mixin(renderConfig, beforeActived)
      : isActive && actived
      ? mixin(renderConfig, actived)
      : renderConfig;
  }

  return renderConfig;
};

export class Renderer {
  private pagePainter: Paint;
  private cursorPainter: Paint;

  private config: EditorConfig;

  private eventBus: EventBus;

  constructor(
    container: HTMLElement,
    eventBus: EventBus,
    config: EditorConfig
  ) {
    this.pagePainter = new Paint(container, config);
    this.cursorPainter = new Paint(container, config);

    this.eventBus = eventBus;
    this.config = config;

    overlapNodes(this.pagePainter.el, this.cursorPainter.el);
    this.pagePainter.init();
    this.cursorPainter.init();
  }

  get viewportRect(): ClientRect {
    return this.pagePainter.editableRect;
  }

  calcLineHeight(vNode: VirtualNode) {
    let lineHeight = 0;
    walkTextNode(vNode, textNode => {
      const { font } = textNode;
      const fontSize = font.size;
      lineHeight = max(fontSize, lineHeight);
    });

    // If the current behavior is empty, return the default line height.
    return lineHeight || this.config.render.font.size;
  }

  renderVNodeInto(vNode: VirtualNode, startPos: [number, number]) {
    const rectList: Array<ClientRect> = [];

    const width = this.pagePainter.editableRect.width;
    let prevXOffset = startPos[0];
    const prevYOffset = startPos[1];
    let lineHeight = 0;
    let totalLength = 0;

    walkTextNode(vNode, (textNode, _, parent) => {
      const { text, font, behavior } = textNode;
      const fontSize = font.size;

      const renderInfo = getRenderInfo(
        parent ? parent.isActive : false,
        font,
        behavior
      );

      if (renderInfo) {
        lineHeight = max(fontSize, lineHeight);

        const { rect, charRectList } = this.pagePainter.drawText(
          text,
          { clientX: prevXOffset, clientY: prevYOffset, maxWidth: width },
          renderInfo
        );

        prevXOffset += rect.width;
        totalLength += rect.width;
        rectList.push(...charRectList);
      }
    });

    rectList.push({
      clientX: prevXOffset,
      clientY: prevYOffset,
      width: width - totalLength,
      height: lineHeight || this.config.render.font.size,
    });

    return {
      rectList,
      lineRect: {
        clientX: startPos[0],
        clientY: startPos[1],
        width,
        height: lineHeight || this.config.render.font.size,
      },
    };
  }

  renderWindow(window: RenderWindow, cursor: CursorInfo | null) {
    const { gap, slice, excess } = window;

    let currentOffsetY = -gap;
    const { clientX, clientY, height, width } = this.viewportRect;

    for (const node of slice) {
      const { vNode } = node;
      const { rectList, lineRect } = this.renderVNodeInto(vNode, [
        clientX,

        // Transform `Rect` to `ClientRect`
        currentOffsetY + clientY,
      ]);

      // TODO render cursor
      if (cursor) {
        if (get(node, '_origin') === cursor.block) {
          console.log('xxxxxxxx', cursor.offset);
        }
      }

      currentOffsetY += lineRect.height;
      set(node, 'rect', { lineRect, rectList });
    }

    const excessRect = {
      clientX,
      clientY: height + clientY,
      width,
      height: excess - 2,
    };
    this.clearRect(excessRect);

    const gapRect = {
      clientX,
      // Transform `Rect` to `ClientRect`
      clientY: clientY - gap,
      width,
      height: gap - 2,
    };
    this.clearRect(gapRect);
  }

  renderSnapshot(snapshot: RenderSnapshot): RenderSnapshot<SliceItemWithRect> {
    this.pagePainter.clearRect(this.pagePainter.canvasRect);

    const { window, cursor } = snapshot;

    const { gap, slice, excess } = window;

    const needToRenderCursor =
      !!cursor && slice.find(node => node._origin === cursor.block);

    let currentOffsetY = -gap;
    const { clientX, clientY, height, width } = this.viewportRect;

    for (const node of slice) {
      const { vNode } = node;
      const { rectList, lineRect } = this.renderVNodeInto(vNode, [
        clientX,

        // Transform `Rect` to `ClientRect`
        currentOffsetY + clientY,
      ]);

      // TODO render cursor
      if (needToRenderCursor) {
        if (node._origin === cursor.block) {
          this.renderCursor(cursor, rectList[cursor.offset]);
        }
      }

      currentOffsetY += lineRect.height;

      // Update the `rect` property to snapshot by side-effect
      set(node, 'rect', { lineRect, rectList });
    }

    if (!cursor || !needToRenderCursor) {
      this.cursorPainter.clearRect(this.cursorPainter.canvasRect);
    }

    const excessRect = {
      clientX,
      clientY: height + clientY,
      width,
      height: excess - 2,
    };
    this.pagePainter.clearRect(excessRect);
    this.cursorPainter.clearRect(excessRect);

    const gapRect = {
      clientX,
      // Transform `Rect` to `ClientRect`
      clientY: clientY - gap,
      width,
      height: gap - 2,
    };
    this.pagePainter.clearRect(gapRect);
    this.cursorPainter.clearRect(gapRect);

    // TODO SAFETY
    return snapshot as RenderSnapshot<SliceItemWithRect>;
  }

  fillRect(rect: ClientRect) {
    this.pagePainter.drawRect(rect, { fillStyle: 'blue' }, true);
  }
  renderRect(rect: ClientRect) {
    this.pagePainter.drawRect(rect);
  }
  clearRect(rect: ClientRect) {
    this.pagePainter.clearRect(rect);
  }

  renderCursor(cursor: CursorInfo, rect: ClientRect) {
    this.cursorPainter.clearRect(this.cursorPainter.canvasRect);

    // TODO rect
    this.cursorPainter.drawRect(
      {
        ...rect,
        width: 4,
      },
      { fillStyle: 'green' },
      true
    );
  }

  clearCanvasRect() {
    this.pagePainter.clearRect(this.pagePainter.canvasRect);
  }
  clearEditableRect() {
    this.pagePainter.clearRect(this.pagePainter.editableRect);
  }
}
