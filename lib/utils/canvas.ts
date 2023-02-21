import { panicAt } from './errorCature';

export function createCanvasAndContext(
  contextId: '2d',
  options?: CanvasRenderingContext2DSettings
): [HTMLCanvasElement, CanvasRenderingContext2D];
export function createCanvasAndContext(
  contextId: 'bitmaprenderer',
  options?: ImageBitmapRenderingContextSettings
): [HTMLCanvasElement, ImageBitmapRenderingContext];
export function createCanvasAndContext(
  contextId: 'webgl',
  options?: WebGLContextAttributes
): [HTMLCanvasElement, WebGLRenderingContext];
export function createCanvasAndContext(
  contextId: 'webgl2',
  options?: WebGLContextAttributes
): [HTMLCanvasElement, WebGL2RenderingContext];
export function createCanvasAndContext(
  kind: string,
  options?: any
): [HTMLCanvasElement, RenderingContext] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext(kind, options);

  return ctx
    ? [canvas, ctx]
    : panicAt('unable to get context of 2D canvas rendering context');
}

export const correctedPixel = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) => {
  const dpr = window.devicePixelRatio;
  const { width, height } = canvas.getBoundingClientRect();
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
  canvas.width = dpr * width;
  canvas.height = dpr * height;
  ctx.scale(dpr, dpr);
};
