import { panicAt } from 'lib/utils';

export class ListNode {
  prev: this | null;
  next: this | null;

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

  appendTail(...nodes: Array<T>) {
    const append = (node: T) => {
      if (this.tail) {
        node.prev = this.tail;
        this.tail.next = node;
        this.tail = node;
      } else {
        this.head = node;
        this.tail = node;
      }

      this.length++;
    };

    nodes.forEach(node => append(node));
  }

  appendHead(...nodes: Array<T>) {
    const append = (node: T) => {
      if (this.head) {
        node.next = this.head;
        this.head.prev = node;
        this.head = node;
      } else {
        this.head = node;
        this.tail = node;
      }

      this.length++;
    };

    nodes.forEach(node => append(node));
  }

  insertBefore(node: T, anchor: T) {
    if (!this.contains(anchor)) {
      return panicAt('anchor does not exist in the linked list');
    }

    if (anchor.prev) {
      node.next = anchor;
      node.prev = anchor.prev;
      anchor.prev.next = node;
      anchor.prev = node;
    } else {
      node.next = anchor;
      anchor.prev = node;
      this.head = node;
    }

    this.length++;
  }

  insertAfter(node: T, anchor: T) {
    if (!this.contains(anchor)) {
      return panicAt('anchor does not exist in the linked list');
    }

    if (anchor.next) {
      node.prev = anchor;
      node.next = anchor.next;
      anchor.next.prev = node;
      anchor.next = node;
    } else {
      node.prev = anchor;
      anchor.next = node;
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

  map<U>(callback: (node: T, idx: number) => U) {
    return Array.from(this.iter()).map(callback);
  }

  reduce<U>(callback: (res: U, cur: T, idx: number) => U, initialValue: U) {
    return Array.from(this.iter()).reduce(callback as any, initialValue);
  }
}
