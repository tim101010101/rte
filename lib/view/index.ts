import { EventBus, walkTextNode } from 'lib/model';
import {
  ClientRect,
  EditorConfig,
  FontInfo,
  RenderConfig,
  RenderWindow,
  VirtualNode,
  VirtualNodeBehavior,
} from 'lib/types';
import { max, mixin, overlapNodes, set } from 'lib/utils';
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
    return lineHeight;
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

  renderWindow(window: RenderWindow) {
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

      currentOffsetY += lineRect.height;
      set(node, 'rect', lineRect);
    }

    const excessRect = {
      clientX,
      clientY: height + clientY,
      width,
      height: excess,
    };
    this.clearRect(excessRect);

    const gapRect = {
      clientX,
      // Transform `Rect` to `ClientRect`
      clientY: clientY - gap,
      width,
      height: gap,
    };
    this.clearRect(gapRect);
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

  renderCursor(rect: ClientRect, oldRect?: ClientRect | null) {
    if (oldRect) {
      this.clearCursor(oldRect);
    }
    this.cursorPainter.drawRect(rect, { fillStyle: 'green' }, true);
  }
  clearCursor(rect: ClientRect) {
    this.cursorPainter.clearRect(rect);
  }

  clearCanvasRect() {
    this.pagePainter.clearRect(this.pagePainter.canvasRect);
  }
  clearEditableRect() {
    this.pagePainter.clearRect(this.pagePainter.editableRect);
  }
}
