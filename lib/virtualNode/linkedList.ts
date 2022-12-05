export class ListNode<T = undefined> {
  type?: T;
  next: this | null;

  constructor(type?: T) {
    this.type = type;
    this.next = null;
  }

  insertAfter(node: ListNode<T>) {
    node.next = this.next;
    this.next = node as any;
  }
}
