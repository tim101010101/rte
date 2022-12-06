export class ListNode {
  prev: ListNode | null;
  next: ListNode | null;

  constructor() {
    this.prev = null;
    this.next = null;
  }
}

export class LinkedList<T extends ListNode> {
  head: T | null;
  tail: T | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  *iter(cur = this.head, length = this.length) {
    let count = 0;
    while (count < length && cur) {
      yield cur;
      count++;
      cur = cur.next as T;
    }
  }

  contains(node: T) {
    return Array.from(this.iter()).includes(node);
  }

  append(...nodes: Array<T>) {
    nodes.forEach(node => this.insertBefore(node));
  }

  insertBefore(node: T) {
    if (this.tail) {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    } else {
      node.prev = null;
      this.head = node;
      this.tail = node;
    }

    this.length++;
  }

  remove(node: T) {
    if (!this.contains(node)) return;

    if (node.prev) {
      node.prev.next = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    }

    if (this.head === node) {
      this.head = node.next as T;
    }

    if (this.tail === node) {
      this.tail = node.prev as T;
    }

    this.length--;
  }

  offset(node: T) {
    return Array.from(this.iter()).indexOf(node);
  }

  find(idx: number) {
    if (idx < 0 || idx >= this.length) return null;
    return Array.from(this.iter())[idx];
  }

  forEach(callback: (node: T, idx: number) => void) {
    return Array.from(this.iter()).forEach(callback);
  }

  map<T>(callback: (node: ListNode, idx: number) => T) {
    return Array.from(this.iter()).map(callback);
  }

  reduce<T>(
    callback: (res: T, cur: ListNode, idx: number) => T,
    initialValue = this.head
  ) {
    return Array.from(this.iter()).reduce(callback as any, initialValue);
  }
}