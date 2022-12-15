import { appendChild, createDomNode } from '../utils';

export class Selection {
  private el: HTMLElement;
  private isActive: boolean;

  constructor(container: HTMLElement) {
    this.el = createDomNode('span', ['r-cursor-test']);
    this.isActive = false;

    appendChild(container, this.el);
  }

  setPos(x: number, y: number, width: number, height: number) {
    if (!this.isActive) {
      this.el.style.display = 'inline-block';
      this.isActive = true;
    }

    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
  }
}
