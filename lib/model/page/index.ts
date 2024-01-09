import {
  Context,
  EditorConfig,
  InnerEventListener,
  ListView,
  Operable,
  OperableNode,
  Snapshot,
  VirtualNode,
} from 'lib/types';
import { EventBus, Line, LinkedList, Selection } from 'lib/model';
import { VNodeEventName, InnerEventName } from 'lib/static';
import { Renderer } from 'lib/view';
import {
  get,
  getNearestIdx,
  getTargetInterval,
  set,
  throttle,
} from 'lib/utils';
import { Schema } from 'lib/schema';
import { proxyListView, proxySelection } from './helper';
import { Viewport } from '../viewport';

const { CLICK, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, WHEEL } = VNodeEventName;
const { KEYDOWN, KEYUP } = VNodeEventName;
const { FOCUS_ON, FULL_PATCH, UNINSTALL_BLOCK, INSTALL_BLOCK } = InnerEventName;

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
      this.schema.parse
    );

    this.history = [];
  }

  init(text: string) {
    const lineVNodes = text.split('\n').map(line => this.schema.parse(line));

    lineVNodes.forEach(vNode => {
      const line = new Line(this.eventBus);
      line.vNode = vNode;
      this.listView.insert(line);
    });

    // TODO TEMP
    this.eventBus.attach(VNodeEventName.CLICK, e => {
      const slice = this.viewport.snapshot.window.slice;

      const startPos = slice[0].rect.lineRect.clientY;
      const verticalPos: Array<number> = [startPos];
      slice.reduce((res, cur) => {
        verticalPos.push(res + cur.rect.lineRect.height);

        return res + cur.rect.lineRect.height;
      }, startPos);

      const vertialIdx = getTargetInterval(verticalPos, (e as any).clientY);
      const target = slice[vertialIdx]._origin;
      const {
        rect: { rectList },
      } = slice[vertialIdx];
      const horizontalIdx = getNearestIdx(
        rectList.map(({ clientX }) => clientX),
        (e as any).clientX
      );

      this.selection.focusOn(target, horizontalIdx);
    });

    this.eventBus.attach(
      VNodeEventName.WHEEL,
      throttle(e => {
        this.viewport.render(e.deltaY);
      }, 1000 / 120)
    );

    this.selection.initEventListener();
    this.selection.addEventListener(KEYDOWN, e => {
      if (e.key === 'Tab' && !this.selection.state && this.listView.head) {
        this.selection.focusOn(this.listView.head, 0);
        // TODO render
        this.viewport.render();
      } else if (e.key === 'Escape' && this.selection.state) {
        this.selection.unFocus();
      }
    });
    this.initEventListener();

    // this.eventBus.emit(FULL_PATCH, lineVNodes);
    // TODO debug
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
