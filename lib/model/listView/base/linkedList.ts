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
    const arr = Array.from(this.iter());
    return arr.includes(node);
  }

  insert(node: T, offset: number = this.length): void {
    if (offset < 0 || offset > this.length) {
      return panicAt(
        'offset out of bound',
        `length: ${this.length}`,
        `offset: ${offset}`
      );
    }

    if (offset === 0) {
      if (this.head) {
        node.next = this.head;
        this.head.prev = node;
        this.head = node;
      } else {
        this.head = node;
        this.tail = node;
      }
    } else {
      const anchor = this.find(offset - 1)!;
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
