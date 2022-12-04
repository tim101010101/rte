export class ListNode<T> {
  data: T;
  next: ListNode<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }

  insertAfter(newNode: ListNode<T>) {
    newNode.next = this.next;
    this.next = newNode;
  }
}
