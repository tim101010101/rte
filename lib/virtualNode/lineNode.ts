import { BlockNode } from './blockNode';
import { ListNode } from './linkedList';
import { ShapeTypes } from './nodeTypes';

export class LineNode extends ListNode<ShapeTypes> {
  line: BlockNode;
  container: HTMLElement;
  isActive: boolean;

  constructor(type: ShapeTypes, line: BlockNode, container: HTMLElement) {
    super(type);

    this.line = line;
    this.container = container;
    this.isActive = false;
  }

  get content() {
    return this.line.content;
  }
}
