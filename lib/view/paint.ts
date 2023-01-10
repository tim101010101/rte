import { Rect } from 'lib/types';
import {
  appendChild,
  correctedPixel,
  createCanvasAndContext,
  mixin,
  sizeAdapt,
} from 'lib/utils';

interface RenderOption {
  fillStyle: string;
  strokeStyle: string;
  font: string;
  textBaseline: CanvasTextBaseline;
  textAlign: CanvasTextAlign;
}
type RenderConfig = Partial<RenderOption>;

export class Paint {
  private canvas: HTMLCanvasElement;
  private elements: Set<Rect>;

  private _ctx: CanvasRenderingContext2D;
  private options: RenderOption;

  constructor(container: HTMLElement) {
    const [canvas, ctx] = createCanvasAndContext('2d');
    this.elements = new Set();
    this.canvas = canvas;
    this._ctx = ctx;
    this.options = {
      fillStyle: '#000',
      strokeStyle: '#000',
      font: '20px arial',
      textBaseline: 'bottom',
      textAlign: 'left',
    };

    sizeAdapt(container, canvas);
    appendChild(container, canvas);

    correctedPixel(this.canvas, this._ctx);
  }

  get el() {
    return this.canvas;
  }
  get ctx() {
    this._ctx.beginPath();
    return this._ctx;
  }

  private getDisposableContext(options?: RenderConfig) {
    const o = mixin(this.options, options);
    const c = this.ctx;
    return mixin(c, o);
  }

  fillText(text: string, rect: Rect, options?: RenderConfig) {
    const c = this.getDisposableContext(options);
    c.fillText(text, rect.x, rect.y, rect.width);
    this.elements.add(rect);
  }
  strokeText(text: string, rect: Rect, options?: RenderConfig) {
    const c = this.getDisposableContext(options);
    c.strokeText(text, rect.x, rect.y, rect.width);
    this.elements.add(rect);
  }

  fillRect(rect: Rect, options?: RenderConfig) {
    const c = this.getDisposableContext(options);
    c.fillRect(rect.x, rect.y, rect.width, rect.height);
    this.elements.add(rect);
  }
  strokeRect(rect: Rect, options?: RenderConfig) {
    const c = this.getDisposableContext(options);
    c.strokeRect(rect.x, rect.y, rect.width, rect.height);
    this.elements.add(rect);
  }
}
