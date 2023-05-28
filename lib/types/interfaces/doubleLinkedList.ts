export interface DoubleLinkedListNode {
  /**
   * The predecessor node of the current node.
   *
   * It is null when the current node is the head node.
   */
  prev: this | null;
  /**
   * The successor node of the current node.
   *
   * It is null when the current node is the tail node.
   */
  next: this | null;
}

export interface DoubleLinkedList<T extends DoubleLinkedListNode> {
  /**
   * Head node of this linked list.
   */
  head: T | null;
  /**
   * Tail node of this linked list.
   */
  tail: T | null;
  /**
   * Count of nodes.
   */
  length: number;

  /**
   * Find the specified node in the current linked list.
   *
   * @param node The node to be searched.
   * @returns Whether the target node is found.
   */
  contains(node: T): boolean;

  /**
   * Insert a node into the specified position.
   *
   * @param node The node to be inserted.
   * @param offset The position to be inserted.
   * @returns Return the node after successful insertion.
   * @throws {Error} If the offset is out of bound.
   */
  insert(node: T, offset: number): T;

  /**
   * Remove the specified node from the current linked list.
   *
   * @param node The node to be removed.
   * @returns Whether the deletion is success.
   */
  remove(node: T): boolean;

  /**
   * Find the index of the specified node from the current linked list
   *
   * @param node The node to be searched.
   * @returns The index of the node, or -1 if it is not present.
   */
  offset(node: T): number;

  /**
   * Return the node at the specified location.
   *
   * @param idx Index of the node.
   * @returns The node at the specified location, or null if it is not present.
   */
  find(idx: number): T | null;

  /**
   * Performs the specified action for each element in this linked list.
   *
   * @param callback A function that accepts up to two arguments, forEach calls the callback function one time for each element in the linked list.
   */
  forEach(callback: (node: T, idx: number) => void): void;

  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   *
   * @param callback A function that accepts up to two arguments. The map method calls the callback function one time for each element in the linked list.
   * @returns An array of return values of callback.
   */
  map<U>(callback: (node: T, idx: number) => U): Array<U>;

  /**
   * Calls the specified callback function for all the elements in the linked list.
   *
   * The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   *
   * @param callback A function that accepts up to three arguments. The reduce method calls the callback function one time for each element in the linked list.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callback function provides this value as an argument instead of an array value.
   * @returns The accumulated result.
   */
  reduce<U>(callback: (res: U, cur: T, idx: number) => U, initialValue: U): U;
}
