export interface ListNode {
  prev: this | null;
  next: this | null;
}

export interface LinkedList<T extends ListNode> {
  head: LinkedList<T> | null;
  tail: LinkedList<T> | null;
  length: number;

  iter(cur: T, length: number): void;
  contains(node: T): void;
  append(...nodes: Array<T>): void;
  insertBefore(node: T): void;
  remove(node: T): void;
  offset(node: T): void;
  find(idx: number): T | null;
  forEach(callback: (node: T, idx: number) => void): void;
  map<U>(callback: (node: T, idx: number) => U): Array<U>;
  reduce<U>(callback: (acc: U, cur: T, idx: number) => U): U;
}
