import {
  Context,
  EditorConfig,
  InnerEventListener,
  Operable,
  OperableNode,
  VirtualNode,
} from 'lib/types';
import { EventBus, Line, LinkedList, Selection } from 'lib/model';
import { VNodeEventName, InnerEventName } from 'lib/static';
import { Renderer } from 'lib/view';
import { getNearestIdx, set, throttle } from 'lib/utils';
import { Schema } from 'lib/schema';
import { proxyListView, proxySelection } from './helper';

const { CLICK, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } = VNodeEventName;
const { KEYDOWN, KEYUP } = VNodeEventName;
const { FOCUS_ON, FULL_PATCH, UNINSTALL_BLOCK, INSTALL_BLOCK } = InnerEventName;

export class Page implements Context {
  private container: HTMLElement;
  private config: EditorConfig;

  private renderer: Renderer;
  private eventBus: EventBus;
  private schema: Schema;

  private selection: Selection;
  private listView: LinkedList<Operable>;

  constructor(container: HTMLElement, config: EditorConfig) {
    this.container = container;
    this.config = config;

    this.renderer = new Renderer(this.container, config);
    this.eventBus = new EventBus();
    this.schema = new Schema(config);

    this.selection = proxySelection(this.renderer, this.eventBus, this.schema);
    this.listView = proxyListView(this.renderer);
  }

  init(text: string) {
    const lineVNodes = text.split('\n').map(line => this.schema.parse(line));

    lineVNodes.forEach(() => {
      const line = new Line(this.eventBus);
      this.listView.insert(line);

      // line.addEventListener(VNodeEventName.CLICK, e => {
      //   const rectList = line.fence.reduce<Array<number>>((arr, cur) => {
      //     cur.fenceList.forEach(({ rect }) => {
      //       arr.push(rect.clientX);
      //     });
      //     return arr;
      //   }, []);
      //   const offset = getNearestIdx(rectList, e.clientPos[0]);
      //   this.eventBus.emit(FOCUS_ON, { block: line, offset });
      // });
    });

    this.selection.initEventListener();
    this.selection.addEventListener(KEYDOWN, e => {
      if (
        e.key === 'Tab' &&
        !this.selection.state?.rect &&
        this.listView.head
      ) {
        this.selection.focusOn(this.listView.head, 0);
      } else if (e.key === 'Escape' && this.selection.state?.rect) {
        this.selection.unFocus();
      }
    });
    this.initEventListener();

    this.eventBus.emit(FULL_PATCH, lineVNodes);
  }

  initEventListener() {
    [CLICK, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, KEYDOWN, KEYUP].forEach(
      eventName => {
        window.addEventListener(
          eventName,
          throttle(e => {
            this.eventBus.emit(eventName as any, e);
          }, 25)
        );
      }
    );

    const innerEventDetail: Array<[InnerEventName, InnerEventListener<any>]> = [
      [FULL_PATCH, this.fullPatch],
      [UNINSTALL_BLOCK, this.uninstallBlock],
      [INSTALL_BLOCK, this.installBlock],
    ];

    innerEventDetail.forEach(([eventName, listener]) => {
      this.eventBus.attach(eventName, listener.bind(this));
    });
  }

  fullPatch(lineVNodes: Array<VirtualNode>) {
    this.listView.forEach((block, i) => {
      block.patch(lineVNodes[i]);
    });
    this.renderer.fullPatch(lineVNodes);
  }

  installBlock(newBlock: OperableNode, anchorBlock: OperableNode) {
    const proxiedNode = this.listView.insert(
      newBlock,
      this.listView.offset(anchorBlock) + 1
    );
    this.eventBus.emit(
      FULL_PATCH,
      this.listView.map(({ vNode }) => vNode)
    );
    return proxiedNode;
  }

  uninstallBlock(block: OperableNode) {
    this.listView.remove(block);
    this.eventBus.emit(
      FULL_PATCH,
      this.listView.map(({ vNode }) => vNode)
    );
  }
}
