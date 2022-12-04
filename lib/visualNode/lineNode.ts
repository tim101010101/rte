import { ListNode } from './dataStructure/linkList';
import { BlockNode } from './blockNode';
import { InlineBlockNode } from './inlineBlockNode';

export class LineNode {
  private head: ListNode<InlineBlockNode | BlockNode> | null;
  private index: number;
  private isActive: boolean;
  private next: LineNode | null;

  constructor() {
    this.head = null;
    this.index = 0;
    this.isActive = false;
    this.next = null;
  }
}
