import { lexer, parser } from './parser';
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

  init(text: string) {
    this.page = new Page(this.container);
    this.page.init(text.split('\n').map(lineText => parser(lexer(lineText))));
  }
}
