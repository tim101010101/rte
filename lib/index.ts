import { Page } from './model';
import { EditorConfig } from './types';
import { Schema } from 'lib/schema';

export class Editor {
  private options: any;
  private container: HTMLElement;
  private page: Page;
  private schema: Schema;

  constructor(options: EditorConfig) {
    const { container, font, schema: schemaConfig } = options;
    this.options = options;
    this.container = document.querySelector(container)!;
    this.page = new Page(this.container, options);

    this.schema = new Schema(schemaConfig, font);
  }

  init(text: string) {
    this.page.init(
      text.split('\n').map(lineText => this.schema.parse(lineText))
    );
  }
}
