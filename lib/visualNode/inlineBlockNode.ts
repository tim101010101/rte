import { NodeType } from './nodeType';
import { BasicNode } from './basicNode';

export class InlineBlockNode extends BasicNode {
  constructor(type: NodeType, dom: HTMLElement, content: string) {
    super(type, dom, content);
  }
}
