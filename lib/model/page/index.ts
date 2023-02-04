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
import {
  activedLine,
  activedSimpleLine,
  activedWeirdLine,
  line,
  simpleLine,
  weirdLine,
} from 'lib/mock';
import { getNearestIdx, throttle } from 'lib/utils';

const { CLICK, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } = VNodeEventName;
const { KEYDOWN, KEYUP } = VNodeEventName;
const { FOCUS_ON } = InnerEventName;

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
    // const lineVNodes = [line, activedLine];
    const lineVNodes = [simpleLine, activedSimpleLine];
    // const lineVNodes = [activedSimpleLine];
    lineVNodes.forEach((vNode, i) => {
      const line = new Line(this.renderer, this.eventBus);
      this.appendTail(line);

      line.patch(vNode);
      line.addEventListener(VNodeEventName.CLICK, e => {
        const rectList = line.fence.reduce((arr, cur) => {
          cur.fenceList.forEach(({ rect }) => {
            arr.push(rect.clientX);
          });
          return arr;
        }, [] as Array<number>);
        const offset = getNearestIdx(rectList, e.clientPos[0]);
        this.eventBus.emit(FOCUS_ON, { block: line, offset });
      });
    });

    this.selection.initEventListener();
    this.selection.addEventListener(KEYDOWN, e => {
      if (e.key === 'Tab' && !this.selection.rect && this.head) {
        this.selection.focusOn(this.head, 0);
      } else if (e.key === 'Escape' && this.selection.rect) {
        this.selection.unFocus();
      }
    });
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
