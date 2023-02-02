import { getFont } from 'lib/model';
import {
  ClientRect,
  EditorConfig,
  FontRenderOptions,
  Rect,
  RenderConfig,
  RenderOption,
} from 'lib/types';
import {
  appendChild,
  correctedPixel,
  createCanvasAndContext,
  entries,
  mixin,
  panicAt,
  posNode,
  set,
  sizeAdapt,
} from 'lib/utils';

type ClientPos = { clientX: number; clientY: number };
type WithCLientRect<T> = T & { rect: ClientRect };
type DrawContentFunction = ({
  clientX,
  clientY,
  maxWidth,
}: ClientPos & { maxWidth: number }) => number;

const initCanvas2D = (container: HTMLElement, config: EditorConfig) => {
  const [canvas, ctx] = createCanvasAndContext('2d');
  sizeAdapt(container, canvas);
  appendChild(container, canvas);
  correctedPixel(canvas, ctx);

  const { font, page } = config;
  const { padding, rowSpacing } = page;

  const { color, textBaseline, textAlign } = font;

  const options = {
    font,
    fillStyle: color,
    strokeStyle: color,
    textBaseline,
    textAlign,
    rowSpacing,
    padding,
  };

  return {
    canvas,
    ctx,
    options,
  };
};

export class Paint {
  private readonly canvas: HTMLCanvasElement;
  private readonly renderOptions: RenderOption;

  private _ctx: CanvasRenderingContext2D;

  private _canvasRect: ClientRect | null;
  private _editableRect: ClientRect | null;
  private _startPos: ClientPos | null;

  constructor(container: HTMLElement, config: EditorConfig) {
    const { canvas, ctx, options } = initCanvas2D(container, config);

    this.canvas = canvas;
    this.renderOptions = options;

    this._ctx = ctx;

    this._canvasRect = null;
    this._editableRect = null;
    this._startPos = null;
  }

  get el() {
    return this.canvas;
  }
  get ctx() {
    this._ctx.beginPath();
    return this._ctx;
  }

  private get canvasRect(): ClientRect {
    return (
      this._canvasRect || panicAt('try to get canvasRect before initialization')
    );
  }
  private get editableRect(): ClientRect {
    return (
      this._editableRect ||
      panicAt('try to get editableRect before initialization')
    );
  }
  private get startPos(): ClientPos {
    return (
      this._startPos || panicAt('try to get startPos before initialization')
    );
  }
  private set startPos(pos: ClientPos) {
    this._startPos = pos;
  }

  private newLine(lineHeight: number) {
    const { clientX, clientY } = this.startPos;
    const { rowSpacing } = this.renderOptions;
    this.startPos = { clientX, clientY: clientY + lineHeight + rowSpacing };
  }

  private clientRect2Rect(clientRect: ClientRect): Rect {
    const { clientX, clientY, width, height } = clientRect;
    const { clientX: startX, clientY: startY } = this.canvasRect;
    return {
      x: clientX - startX,
      y: clientY - startY,
      width,
      height,
    };
  }

  rect2ClientRect(rect: Rect): ClientRect {
    const { x, y, width, height } = rect;
    const { clientX: startX, clientY: startY } = this.canvasRect;
    return {
      clientX: x + startX,
      clientY: y + startY,
      width,
      height,
    };
  }

  init() {
    const { width, height, x, y } = posNode(this.canvas);
    const { padding } = this.renderOptions;

    this._canvasRect = {
      width,
      height,
      clientX: x,
      clientY: y,
    };
    this._editableRect = {
      width: width - padding * 2,
      height: height - padding * 2,
      clientX: x + padding,
      clientY: y + padding,
    };
    this._startPos = {
      clientX: x + padding,
      clientY: y + padding,
    };
  }

  getDisposableContext(options?: RenderConfig) {
    const c = this.ctx;
    entries(mixin(this.renderOptions, options)).forEach(([k, v]) => {
      set(c, k, k === 'font' ? getFont(v) : v);
    });
    return c;
  }

  drawLine(drawContent: DrawContentFunction): ClientRect {
    const { width } = this.editableRect;
    const lineHeight = drawContent({ ...this.startPos, maxWidth: width });
    const lineRect = {
      ...this.startPos,
      width: width,
      height: lineHeight,
    };

    this.newLine(lineHeight);

    return lineRect;
  }

  resetLineDrawing() {
    const { clientX, clientY } = this.editableRect;
    this.startPos = {
      clientX,
      clientY,
    };
  }

  private drawTextFloatLeft(
    text: string,
    clientRect: ClientRect,
    ctx: CanvasRenderingContext2D,
    isFill: boolean
  ): WithCLientRect<{ charRectList: Array<ClientRect> }> {
    const { x, y, width: maxWidth, height } = this.clientRect2Rect(clientRect);
    const charRectList: Array<ClientRect> = [];
    let prevXOffset = x;

    Array.from(text).forEach(char => {
      isFill
        ? ctx.fillText(char, prevXOffset, y + height, maxWidth)
        : ctx.strokeText(char, prevXOffset, y + height, maxWidth);
      const { width } = ctx.measureText(char);
      charRectList.push(
        this.rect2ClientRect({
          x: prevXOffset,
          y,
          width,
          height,
        })
      );
      prevXOffset += width;
    });

    return {
      rect: this.rect2ClientRect({
        x,
        y,
        width: prevXOffset - x,
        height,
      }),
      charRectList,
    };
  }
  // // TODO transform rect to clientRect
  // private drawTextCenter(
  //   text: string,
  //   { x, y, width: maxWidth, height }: Rect,
  //   ctx: CanvasRenderingContext2D
  // ): WithCLientRect<{ charRectList: Array<Rect> }> {
  //   ctx.textAlign = 'left';
  //   const charRectList: Array<Rect> = [];
  //   const { width: textWidth } = ctx.measureText(text);

  //   const startX = (maxWidth - textWidth) / 2 + x;
  //   let prevXOffset = startX;

  //   Array.from(text).forEach(char => {
  //     ctx.fillText(char, prevXOffset, y + height, maxWidth);
  //     const { width } = ctx.measureText(char);
  //     charRectList.push({
  //       x: prevXOffset,
  //       y,
  //       width,
  //       height,
  //     });
  //     prevXOffset += width;
  //   });

  //   return {
  //     rect: { x: startX, y, width: textWidth, height },
  //     charRectList,
  //   };
  // }
  // // TODO transform rect to clientRect
  // private drawTextFloatRight(
  //   text: string,
  //   { x, y, width: maxWidth, height }: Rect,
  //   ctx: CanvasRenderingContext2D
  // ): WithCLientRect<{ charRectList: Array<ClientRect> }> {
  //   ctx.textAlign = 'left';
  //   const charRectList: Array<ClientRect> = [];
  //   const { width: textWidth } = ctx.measureText(text);

  //   const startX = maxWidth - textWidth + x;
  //   let prevXOffset = startX;

  //   Array.from(text).forEach(char => {
  //     ctx.fillText(char, prevXOffset, y + height, maxWidth);
  //     const { width } = ctx.measureText(char);
  //     charRectList.push({
  //       x: prevXOffset,
  //       y,
  //       width,
  //       height,
  //     });
  //     prevXOffset += width;
  //   });

  //   return {
  //     rect: { x: startX, y, width: textWidth, height },
  //     charRectList,
  //   };
  // }

  drawText(
    text: string,
    { clientX, clientY, maxWidth: width }: ClientPos & { maxWidth: number },
    fontOptions: Partial<FontRenderOptions> = {},
    isFill: boolean = true
  ): WithCLientRect<{ charRectList: Array<ClientRect> }> {
    const c = this.getDisposableContext(fontOptions);
    const fontSize = fontOptions?.font?.size || this.renderOptions.font.size;
    const rect = { clientX, clientY, width, height: fontSize };

    switch (c.textAlign) {
      case 'left':
        return this.drawTextFloatLeft(text, rect, c, isFill);
      // case 'center':
      //   return this.drawTextCenter(text, rect, c);
      // case 'right':
      //   return this.drawTextFloatRight(text, rect, c);

      default:
        return panicAt(`unsupported properties: [textAlign: '${c.textAlign}']`);
    }
  }

  clearRect(clientRect: ClientRect) {
    const { x, y, width, height } = this.clientRect2Rect(clientRect);
    const lineWidth = this.ctx.lineWidth;
    this.ctx.clearRect(
      x - lineWidth,
      y - lineWidth,
      width + lineWidth * 2,
      height + lineWidth * 2
    );
  }

  drawRect(
    clientRect: ClientRect,
    renderOptions: RenderConfig = {},
    isFill: boolean = false
  ) {
    const c = this.getDisposableContext(renderOptions);
    const { x, y, width, height } = this.clientRect2Rect(clientRect);
    isFill
      ? c.fillRect(x, y, width, height)
      : c.strokeRect(x, y, width, height);
  }
}
