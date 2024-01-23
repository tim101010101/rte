import { EditorConfig } from './types';
import { Page } from './model';
import { debug, get } from './utils';
import { injectGlobal } from './debug';

debug(`${__DEV__ && 'Attaching to [DEBUG] mode...'}`);

export class Editor {
  private options: any;
  private container: HTMLElement;
  private page: Page;

  constructor(options: EditorConfig) {
    const { container } = options;
    this.options = options;
    this.container = document.querySelector(container)!;
    this.page = new Page(this.container, options);
  }

  init(text: string) {
    this.page.init(text);

    if (__DEV__)
      injectGlobal({
        editor: this,
        page: this.page,
        selection: get(this.page, 'selection'),
        listView: get(this.page, 'listView'),
        viewport: get(this.page, 'viewport'),
      });
  }
}
