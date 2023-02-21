import { FontInfo } from './virtualNode';

export interface FontRenderOptions {
  fillStyle: string;
  strokeStyle: string;
  font: FontInfo;
  textBaseline: CanvasTextBaseline;
  textAlign: CanvasTextAlign;
}

export interface RenderOption extends FontRenderOptions {
  rowSpacing: number;
  padding: number;
}

export type RenderConfig = Partial<RenderOption>;
