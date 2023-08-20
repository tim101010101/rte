import { getPixelRatio } from 'lib/utils';

export interface CanvasBaseConfig {
  width: number;
  height: number;

  isCache: boolean;
}

export type CanvasConfig2D = CanvasRenderingContext2DSettings;
export type CanvasConfigWebGL = WebGLContextAttributes;
export type CanvasConfigWebGL2 = WebGLContextAttributes;
export type CanvasConfigBitmap = ImageBitmapRenderingContextSettings;

export type CanvasContext =
  | CanvasRenderingContext2D
  | WebGLRenderingContext
  | WebGL2RenderingContext
  | ImageBitmapRenderingContext;

export abstract class Canvas<T extends CanvasContext> {
  private readonly _instance: HTMLCanvasElement;
  private readonly _ctx: T;

  private _pixelRatio: number;
  private _width: number;
  private _height: number;

  protected readonly isCache: boolean;

  constructor(
    instance: HTMLCanvasElement,
    ctx: T,
    { height = 0, width = 0, isCache = false }: CanvasBaseConfig
  ) {
    this._instance = instance;
    this._ctx = ctx;

    this._pixelRatio = getPixelRatio();
    this._width = width;
    this._height = height;

    this.isCache = isCache;

    this.initInlintStyle();
  }

  get instance() {
    return this._instance;
  }
  get ctx() {
    return this._ctx;
  }

  get width() {
    return this._width;
  }
  set width(width: number) {
    this._width = this._instance.width * this.pixelRatio;
    this._instance.style.width = `${width}px`;
    this.correctedPixel();
  }

  get height() {
    return this._height;
  }
  set height(height: number) {
    this._height = this._instance.height * this.pixelRatio;
    this._instance.style.height = `${height}px`;
    this.correctedPixel();
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  get pixelRatio() {
    return this._pixelRatio;
  }
  set pixelRatio(pixelRatio: number) {
    const prev = this._pixelRatio;
    this._pixelRatio = pixelRatio;
    this.setSize(this.width / prev, this.height / prev);
  }

  private initInlintStyle() {
    this._instance.style.padding = '0';
    this._instance.style.margin = '0';
    this._instance.style.border = '0';
    this._instance.style.background = 'transparent';
    this._instance.style.position = 'absolute';
    this._instance.style.top = '0';
    this._instance.style.left = '0';
  }

  /**
   * The current pixel ratio must be corrected in the implementation of this method.
   */
  abstract correctedPixel(): void;
}
