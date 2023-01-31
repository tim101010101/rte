import { EditorConfig, Operable } from 'lib/types';
import { EventBus, LinkedList } from 'lib/model';
import { DOMEventName, InnerEventName } from 'lib/static';
import { Renderer } from 'lib/view';
import { activedLine, activedWeirdLine, line, weirdLine } from 'lib/mock';

export class Page extends LinkedList<Operable> {
  private container: HTMLElement;
  private config: EditorConfig;

  private renderer: Renderer;
  private eventBus: EventBus;

  // schema: Schema;
  // selection: Selection;

  constructor(container: HTMLElement, config: EditorConfig) {
    super();

    this.container = container;
    this.config = config;

    this.renderer = new Renderer(this.container, config);
    this.eventBus = new EventBus();

    // this.selection = new Selection(container, this.eventBus);
    // this.schema = schema;
  }

  init(text: string) {
    const rectList = this.renderer.fullPatch([
      line,
      activedLine,
      // activedLine,
      // activedLine,
    ]);
  }
}
