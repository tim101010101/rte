import { ListNode } from './visualNode/dataStructure/linkList';
import { EventBus } from './events';
import { Render } from './render';
import { LineNode } from './visualNode/lineNode';

export class Editor {
  private options: any;
  private node: ListNode<LineNode>;
  private render: Render;
  private eventBus: EventBus;
  private container: HTMLElement;

  constructor(options: any) {
    const { container } = options;

    this.options = options;
    this.node = new ListNode(new LineNode());
    this.render = new Render();
    this.eventBus = new EventBus();
    this.container = document.querySelector(container);
  }

  init() {
    // TODO
  }
}
