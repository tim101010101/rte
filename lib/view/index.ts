import { getFont, walkTextNode } from 'lib/model';
import { FontInfo, Rect, VirtualNode, VirtualNodeBehavior } from 'lib/types';
import { max, overlapNodes } from 'lib/utils';
import { Paint } from './paint';

const getRenderInfo = (
  isActive: boolean,
  font: FontInfo,
  behavior?: VirtualNodeBehavior
) => {
  let textAlign = 'left';

  if (behavior) {
    const { beforeActived, actived } = behavior;
    if (!isActive && beforeActived) {
      const { show } = beforeActived;
      if (show === false) return null;
    } else if (isActive && actived) {
      const { show } = actived;
      if (show === false) return null;
    }
  }

  return {
    font: getFont(font),
    textAlign,
  };
};

export class Renderer {
  private _page: Paint;
  private _cursor: Paint;
  private lines: Set<Rect>;

  constructor(container: HTMLElement) {
    this._page = new Paint(container);
    this._cursor = new Paint(container);

    this.lines = new Set();

    overlapNodes(this._page.el, this._cursor.el);
  }

  // init() {}

  get pageContext() {
    return this._page.ctx;
  }

  patch(vNode: VirtualNode, oldRect: Rect | null) {
    if (oldRect && this.lines.has(oldRect)) {
      const { x, y, width, height } = oldRect;
      this.pageContext.clearRect(x - 1, y - 1, width + 2, height + 2);
      this.lines.delete(oldRect);
    }

    const rectList: Array<Rect> = [];

    const x = 30;
    const y = 30;

    let prevXOffset = x;
    let prevYOffset = y;
    let lineHeight = 0;

    walkTextNode(vNode, (textNode, parent) => {
      const { text, font, behavior } = textNode;
      const ctx = this.pageContext;

      if (parent) {
        const renderInfo = getRenderInfo(parent.isActive, font, behavior);
        if (!renderInfo) {
          return;
        } else {
          const { font } = renderInfo;

          lineHeight = max(textNode.font.size, lineHeight);

          ctx.font = font;
          ctx.textBaseline = 'ideographic';

          Array.from(text).forEach(char => {
            ctx.fillText(char, prevXOffset, prevYOffset + textNode.font.size);
            const { width } = ctx.measureText(char);

            rectList.push({
              x: prevXOffset,
              y: prevYOffset,
              width,
              height: textNode.font.size,
            });
            prevXOffset += width;
          });
        }
      }
    });

    const lineRect = {
      x,
      y,
      width: prevXOffset - x,
      height: lineHeight,
    };

    // const c = this.pageContext;
    // c.strokeStyle = '#f00';
    // c.strokeRect(x, y, prevXOffset - x, lineHeight);

    this.lines.add(lineRect);

    return {
      lineRect,
      rectList,
    };
  }
}
