import { EditorConfig, Operable } from 'lib/types';
import {
  EventBus,
  Line,
  LinkedList,
  textContent,
  walkTextNode,
  Selection,
} from 'lib/model';
import { VNodeEventName, InnerEventName } from 'lib/static';
import { Renderer } from 'lib/view';
import { activedLine, activedWeirdLine, line, weirdLine } from 'lib/mock';
import { throttle } from 'lib/utils';

const { CLICK, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } = VNodeEventName;
const { KEYDOWN, KEYUP } = VNodeEventName;

export class Page extends LinkedList<Operable> {
  private container: HTMLElement;
  private config: EditorConfig;

  private renderer: Renderer;
  private eventBus: EventBus;

  // schema: Schema;
  selection: Selection;

  constructor(container: HTMLElement, config: EditorConfig) {
    super();

    this.container = container;
    this.config = config;

    this.renderer = new Renderer(this.container, config);
    this.eventBus = new EventBus();

    this.selection = new Selection(this.renderer, this.eventBus);
    // this.schema = schema;
  }

  init(text: string) {
    // parse.....
    const lineVNodes = [line, activedLine];
    // const res = this.renderer.fullPatch(lines);
    lineVNodes.forEach((vNode, i) => {
      const line = new Line(this.renderer, this.eventBus);
      this.appendTail(line);

      line.patch(vNode);
      line.addEventListener(VNodeEventName.CLICK, e => {
        console.log(i);
      });
    });

    // res.forEach(({ lineRect }, i) => {
    //   const vNode = lines[i];
    //   this.eventBus.attach(
    //     CLICK,
    //     { vNode, rect: lineRect },
    //     ({ target, clientPos }) => {
    //       console.log('click1');
    //     }
    //   );
    // });

    this.initEventListener();
  }

  initEventListener() {
    [CLICK, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, KEYDOWN, KEYUP].forEach(
      eventName => {
        window.addEventListener(
          eventName,
          throttle(e => {
            this.eventBus.emit(eventName as any, e);
          })
        );
      }
    );
  }
}
