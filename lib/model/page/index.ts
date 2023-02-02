import { EditorConfig, Operable } from 'lib/types';
import { EventBus, LinkedList, textContent, walkTextNode } from 'lib/model';
import { VNodeEventName, InnerEventName } from 'lib/static';
import { Renderer } from 'lib/view';
import { activedLine, activedWeirdLine, line, weirdLine } from 'lib/mock';

const { CLICK, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } = VNodeEventName;
const { KEYDOWN, KEYUP } = VNodeEventName;

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
    const lines = [line, activedLine];
    const res = this.renderer.fullPatch(lines);

    res.forEach(({ lineRect }, i) => {
      const vNode = lines[i];
      this.eventBus.attach(
        CLICK,
        { vNode, rect: lineRect },
        ({ target, clientPos }) => {
          console.log('click1');
        }
      );
    });

    this.initEventListener();
  }

  initEventListener() {
    [CLICK, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, KEYDOWN, KEYUP].forEach(
      eventName => {
        window.addEventListener(eventName, e => {
          this.eventBus.emit(eventName as any, e);
        });
      }
    );
  }
}
