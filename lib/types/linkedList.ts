export interface ListNode {
  prev: ListNode | null;
  next: ListNode | null;
}

export interface LinkedList<T> {
  head: LinkedList<T> | null;
  tail: LinkedList<T> | null;
  length: number;

  iter(cur: ListNode, length: number): void;

  // contains(node: ListNode) {
  //   return Array.from(this.iter()).includes(node);
  // }

  // append(...nodes: Array<ListNode>) {
  //   nodes.forEach(node => this.insertBefore(node));
  // }

  // insertBefore(node: ListNode) {
  //   if (this.tail) {
  //     this.tail.next = node;
  //     node.prev = this.tail;
  //     this.tail = node;
  //   } else {
  //     node.prev = null;
  //     this.head = node;
  //     this.tail = node;
  //   }
  // }

  // remove(node: ListNode) {
  //   if (!this.contains(node)) return;

  //   if (node.prev) {
  //     node.prev.next = node.next;
  //   }

  //   if (node.next) {
  //     node.next.prev = node.prev;
  //   }

  //   if (this.head === node) {
  //     this.head = node.next;
  //   }

  //   if (this.tail === node) {
  //     this.tail = node.prev;
  //   }

  //   this.length--;
  // }

  // offset(node: ListNode) {
  //   return Array.from(this.iter()).indexOf(node);
  // }

  // find(idx: number) {
  //   if (idx < 0 || idx >= this.length) return null;
  //   return Array.from(this.iter())[idx];
  // }

  // forEach(callback: (node: ListNode, idx: number) => void) {
  //   return Array.from(this.iter()).forEach(callback);
  // }

  // map<T>(callback: (node: ListNode, idx: number) => T) {
  //   return Array.from(this.iter()).map(callback);
  // }

  // reduce<T>(
  //   callback: (res: T, cur: ListNode, idx: number) => T,
  //   initialValue = this.head
  // ) {
  //   return Array.from(this.iter()).reduce(callback as any, initialValue);
  // }
}