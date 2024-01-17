import {
  Context,
  EditorConfig,
  InnerEventListener,
  ListView,
  OperableNode,
  Snapshot,
  VirtualNode,
} from 'lib/types';
import { EventBus, Line, LinkedList, Selection } from 'lib/model';
import { VNodeEventName, InnerEventName } from 'lib/static';
import { throttle } from 'lib/utils';
import { Schema } from 'lib/schema';
import { Viewport } from '../viewport';

const { CLICK, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, WHEEL } = VNodeEventName;
const { KEYDOWN, KEYUP } = VNodeEventName;
const { FULL_PATCH, UNINSTALL_BLOCK, INSTALL_BLOCK } = InnerEventName;

export class Page implements Context {
  private eventBus: EventBus;
  private schema: Schema;

  private selection: Selection;
  private listView: ListView;

  private viewport: Viewport;

  private history: Array<Snapshot>;

  constructor(container: HTMLElement, config: EditorConfig) {
    this.eventBus = new EventBus();
    this.schema = new Schema(config);

    this.listView = new LinkedList();

    this.viewport = new Viewport(
      container,
      config,
      this.eventBus,
      this.listView
    );

    this.selection = new Selection(
      this.eventBus,
      this.viewport,
      this.schema.parse.bind(this.schema)
    );

    this.history = [];
  }

  init(text: string) {
    text
      .split('\n')
      .map(line => this.schema.parse(line))
      .forEach(vNode => {
        const line = new Line(this.eventBus);
        line.vNode = vNode;
        this.listView.insert(line);
      });

    this.selection.initEventListener();
    this.initEventListener();

    this.viewport.render();
  }

  initEventListener() {
    [CLICK, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, KEYDOWN, KEYUP, WHEEL].forEach(
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
    // this.renderer.fullPatch(lineVNodes);
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
