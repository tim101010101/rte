import { ClientRect, EditorConfig, Operable } from 'lib/types';
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
import { getNearestIdx, throttle } from 'lib/utils';
import { Schema } from 'lib/schema';

const { CLICK, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } = VNodeEventName;
const { KEYDOWN, KEYUP } = VNodeEventName;
const { FOCUS_ON } = InnerEventName;

export class Page extends LinkedList<Operable> {
  private container: HTMLElement;
  private config: EditorConfig;

  private renderer: Renderer;
  private eventBus: EventBus;

  schema: Schema;
  selection: Selection;

  constructor(container: HTMLElement, config: EditorConfig) {
    super();

    this.container = container;
    this.config = config;

    this.renderer = new Renderer(this.container, config);
    this.eventBus = new EventBus();

    this.schema = new Schema(config);
    this.selection = new Selection(
      this.renderer,
      this.eventBus,
      this.schema.parse.bind(this.schema)
    );
  }

  init(text: string) {
    const lineVNodes = text.split('\n').map(line => this.schema.parse(line));
    // const lineVNodes = [heading, this.schema.parse(text.split('\n')[1])];

    lineVNodes.forEach((vNode, i) => {
      const line = new Line(this.renderer, this.eventBus);
      this.appendTail(line);

      line.patch(vNode);
      line.addEventListener(VNodeEventName.CLICK, e => {
        const rectList = line.fence.reduce<Array<number>>((arr, cur) => {
          cur.fenceList.forEach(({ rect }) => {
            arr.push(rect.clientX);
          });
          return arr;
        }, []);
        const offset = getNearestIdx(rectList, e.clientPos[0]);
        this.eventBus.emit(FOCUS_ON, { block: line, offset });
      });

      // // dev only
      // const rectList = line.fence.reduce<Array<ClientRect>>((res, cur) => {
      //   const { fenceList } = cur;
      //   fenceList.forEach(({ rect }) => {
      //     res.push(rect);
      //   });
      //   return res;
      // }, []);

      // rectList.forEach(rect =>
      //   this.renderer.renderRect(rect, { strokeStyle: 'red' })
      // );
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
          }, 50)
        );
      }
    );
  }
}
