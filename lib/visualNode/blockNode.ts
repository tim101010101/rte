import { NodeType } from '../nodeType';
import { BasicNode } from './basicNode';

export class BlockNode extends BasicNode {
  constructor(type: NodeType, dom: HTMLElement, content: string) {
    super(type, dom, content);
  }
}
