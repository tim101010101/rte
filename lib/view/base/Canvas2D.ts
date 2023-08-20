import { Canvas } from 'lib/types';
import { createCanvasAndContext } from 'lib/utils';

export class Canvas2D extends Canvas<CanvasRenderingContext2D> {
  constructor(width: number, height: number, isCache: boolean) {
    const [instance, ctx] = createCanvasAndContext('2d');
    super(instance, ctx, {
      width,
      height,
      isCache,
    });
  }

  correctedPixel() {
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }
}
