import { EditorConfig } from './types';
import { Page } from './model';

export class Editor {
  private options: any;
  private container: HTMLElement;
  private page: Page;

  constructor(options: EditorConfig) {
    const { container, schema: schemaConfig } = options;
    this.options = options;
    this.container = document.querySelector(container)!;
    this.page = new Page(this.container, options);
  }

  init(text: string) {
    this.page.init(text);
  }
}
