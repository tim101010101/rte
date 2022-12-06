import { Block } from './virtualNode/block';
import { Page } from './virtualNode/page';

export class Editor {
  private options: any;
  private container: HTMLElement;
  private page: Page | null;

  constructor(options: any) {
    const { container } = options;
    this.options = options;
    this.container = document.querySelector(container);
    this.page = null;
  }

  init(blockList: Array<Block>) {
    this.page = new Page(this.container);
    this.page.init(blockList);
  }
}
