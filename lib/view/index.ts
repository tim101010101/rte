import { walkTextNode } from 'lib/model';
import {
  ClientRect,
  EditorConfig,
  FontInfo,
  Rect,
  RenderConfig,
  VirtualNode,
  VirtualNodeBehavior,
} from 'lib/types';
import { max, mixin, overlapNodes } from 'lib/utils';
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
  private lines: Set<ClientRect>;
  private config: EditorConfig;

  constructor(container: HTMLElement, config: EditorConfig) {
    this.pagePainter = new Paint(container, config);
    this.cursorPainter = new Paint(container, config);

    this.lines = new Set();
    this.config = config;

    overlapNodes(this.pagePainter.el, this.cursorPainter.el);
    this.pagePainter.init();
    this.cursorPainter.init();
  }

  private getPageContext(options?: RenderConfig) {
    return this.pagePainter.getDisposableContext(options);
  }

  //! ERROR bug dev dairy 2023-1-15
  private drawLineWithVNode(vNode: VirtualNode, rect?: ClientRect) {
    const rectList: Array<ClientRect> = [];
    const lineRect = this.pagePainter.drawLine(
      ({ clientX, clientY, maxWidth }) => {
        let prevXOffset = clientX;
        let prevYOffset = clientY;
        let lineHeight = 0;
        let totalLength = 0;

        walkTextNode(vNode, (textNode, _, parent) => {
          const { text, font, behavior } = textNode;
          const fontSize = font.size;
          // TODO maybe bug here
          const renderInfo = getRenderInfo(
            parent ? parent.isActive : false,
            font,
            behavior
          );

          if (renderInfo) {
            lineHeight = max(fontSize, lineHeight);

            const { rect, charRectList } = this.pagePainter.drawText(
              text,
              { clientX: prevXOffset, clientY: prevYOffset, maxWidth },
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
          width: maxWidth - totalLength,
          height: lineHeight || this.config.font.size,
        });

        return {
          clientX,
          clientY,
          width: maxWidth,
          height: lineHeight || this.config.font.size,
        };
      },
      rect
    );

    return {
      lineRect,
      rectList,
    };
  }

  fullPatch(lines: Array<VirtualNode>) {
    this.pagePainter.resetLineDrawing();
    this.pagePainter.clearRect(this.pagePainter.editableRect);
    const res = lines.map(line => this.patch(line));

    return res;
  }

  patch(newVNode: VirtualNode, oldVNode?: VirtualNode, oldRect?: ClientRect) {
    if (oldRect && oldVNode && this.lines.has(oldRect)) {
      this.pagePainter.clearRect(oldRect);
      this.lines.delete(oldRect);
    }

    const { lineRect, rectList } = this.drawLineWithVNode(newVNode, oldRect);

    // rectList.forEach(rect => this.renderRect(rect, { strokeStyle: 'red' }));

    this.lines.add(lineRect);

    return {
      lineRect,
      rectList,
    };
  }

  // dev only
  renderRect(rect: ClientRect, options?: RenderConfig) {
    this.pagePainter.drawRect(rect, options);
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
}
