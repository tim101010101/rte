import {
  ClientRect,
  DoubleLinkedListNode,
  Fence,
  Snapshot,
  SyntaxNode,
  VirtualNode,
} from 'lib/types';

/**
 * An interface that carries the ability to interact with the cursor.
 *
 * All elements that need to interact with the cursor must implement the interface.
 *
 * Or implement the interface to interact with the cursor.
 */
export interface Operable extends DoubleLinkedListNode {
  /**
   * The `fence` of this OperableNode.
   */
  fence: Fence;
  /**
   * The `vNode` of this OperableNode.
   *
   * Abstraction of the actual elements in the page.
   */
  vNode: VirtualNode;
  /**
   * The `rect` of this OperableNode.
   *
   * Contains information about the location occupied by the current node.
   */
  rect: ClientRect;

  /**
   * Patch the new VNode and the old VNode(current node)
   *
   * Due to the proxy of the OperableNode, only need to assign values to the old nodes here for the time being.
   *
   * @param newVNode New virtual node
   */
  patch(newVNode: VirtualNode): void;

  /**
   * Moving the cursor to the specified position of the node, and try to activate the node
   *
   * @param prevState The state before the cursor moves
   * @param curOffset Target offset
   * @returns The state after the cursor is focused
   */
  focusOn(prevState: Snapshot | null, curOffset: number): Snapshot;
  /**
   * Hide the cursor and deactivate the current activation.
   *
   * @param prevState The state before the cursor moves
   */
  unFocus(prevState: Snapshot): void;

  /**
   * Move cursor left with a specify step.
   *
   * @param prevState The state before the cursor moves
   * @param step The moving step of the cursor
   * @returns Return the state after the move when the operation is successful, otherwise return null.
   */
  left(prevState: Snapshot, step: number): Snapshot | null;
  /**
   * Move cursor right with a specify step.
   *
   * @param prevState The state before the cursor moves
   * @param step The moving step of the cursor
   * @returns Return the state after the move when the operation is successful, otherwise return null.
   */
  right(prevState: Snapshot, step: number): Snapshot | null;
  /**
   * Move cursor up with a specify step.
   *
   * It will find the previous node along the linked list.
   *
   * @param prevState The state before the cursor moves
   * @param step The moving step of the cursor
   * @returns Return the state after the move when the operation is successful, otherwise return null.
   */
  up(prevState: Snapshot, step: number): Snapshot | null;
  /**
   * Move cursor down with a specify step.
   *
   * It will find the next node along the linked list.
   *
   * @param prevState The state before the cursor moves
   * @param step The moving step of the cursor
   * @returns Return the state after the move when the operation is successful, otherwise return null.
   */
  down(prevState: Snapshot, step: number): Snapshot | null;

  /**
   * Insert a new line at the position of the current cursor.
   *
   * If there is content on the right side of the current cursor, it will automatically truncate and append this paragraph to the new line.
   *
   * @param prevState The state before this operation
   * @param parse Full parser
   * @returns The state after this operation
   */
  newLine(prevState: Snapshot, parse: (src: string) => SyntaxNode): Snapshot;

  /**
   * Insert a char at the position of the current cursor.
   *
   * The cursor will be automatically moved behind the inserted character, and will attempte to activate or deactivate.
   *
   * TODO Will be refactored when the selecting feature supported.
   *
   * @param prevState The state before this operation
   * @param char The char to be inserted
   * @param parse Full parser
   * @returns The state after this operation
   */
  update(
    prevState: Snapshot,
    char: string,
    parse: (src: string) => SyntaxNode
  ): Snapshot;

  /**
   * Delete a char at the position of the current cursor.
   *
   * The cursor will be automatically moved left, and will attempte to activate or deactivate.
   *
   * TODO Will be refactored when the selecting feature supported.
   *
   * @param prevState The state before this operation
   * @param parse Full parser
   * @returns The state after this operation
   */
  delete(prevState: Snapshot, parse: (src: string) => SyntaxNode): Snapshot;
}
