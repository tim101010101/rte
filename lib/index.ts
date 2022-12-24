import { Page } from './model';
import { lexer, parser } from 'lib';
import { EditorConfig } from './types';
import { Schema } from 'lib/schema';
import { demoConfig } from 'lib/schema/data';

export class Editor {
  private options: any;
  private container: HTMLElement;
  private page: Page;

  constructor(options: EditorConfig) {
    const { container, font } = options;
    this.options = options;
    this.container = document.querySelector(container)!;
    this.page = new Page(this.container, options);
  }

  init(text: string) {
    this.page.init(text.split('\n').map(lineText => parser(lexer(lineText))));

    const schema = new Schema(demoConfig);
    schema.parse(text);
  }
}
