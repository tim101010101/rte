import { ListNode } from './linkedList';
import { NodeTypes } from './nodeTypes';

interface EventDetail {
  listener: EventListenerOrEventListenerObject;
  capture: boolean;
}

export class BlockNode<M = undefined> extends ListNode {
  nodeType: NodeTypes;

  dom: HTMLElement | null;
  isActive: boolean;

  meta?: M;

  private _content: string;
  private events: Map<string, EventDetail>;

  constructor(nodeType: NodeTypes, content: string, meta?: M) {
    super();

    this.nodeType = nodeType;

    this.dom = null;
    this.isActive = false;

    this.meta = meta;

    this._content = content;

    this.events = new Map();
  }

  attachDOMEvent(
    eventName: string,
    listener: EventListenerOrEventListenerObject,
    capture: boolean
  ) {
    this.events.set(eventName, { listener, capture });
    this.dom?.addEventListener(eventName, listener, capture);
  }

  detachDOMEvent(eventName: string) {
    const eventDetail = this.events.get(eventName);
    if (eventDetail) {
      const { listener, capture } = eventDetail;
      this.dom?.removeEventListener(eventName, listener, capture);
    }
  }

  get content() {
    let result = this._content;
    let cur = this.next;
    while (cur) {
      result += cur._content;
      cur = cur.next;
    }

    return result;
  }
}
