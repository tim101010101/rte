import { EventBus } from 'lib/model';
import {
  ClientRect,
  Fence,
  Operable,
  Snapshot,
  SyntaxNode,
  VirtualNode,
  // EventInteroperableObject,
} from 'lib/types';

//! ERROR cann't access EventInteroperable before initialization
import { EventInteroperableObject } from './eventInteroperableImpl';

// prettier-ignore
/**
 * An interface that carries the ability to interact with the cursor.
 *
 * It is same as the `Operable`, but abstract class is used here to further improve constraint capabilities.
 */
export abstract class OperableNode extends EventInteroperableObject implements Operable {
  prev: this | null;
  next: this | null;

  constructor(eventBus: EventBus) {
    super(eventBus)

    this.prev = null;
    this.next = null;
  }

  abstract get rect(): ClientRect;
  abstract set rect(rect: ClientRect);

  abstract get vNode(): VirtualNode;
  abstract set vNode(newVNode: VirtualNode);

  abstract get fence(): Fence;
  abstract set fence(newFence: Fence);

  /**
   * Fully export the current internal state.
   * 
   * @returns Current internal state
   */
  abstract dump(): { rect?: ClientRect, vNode?: VirtualNode, fence?: Fence }

  abstract patch(newVNode: VirtualNode): void;

  abstract focusOn(prevState: Snapshot | null, curOffset: number): Snapshot;
  abstract unFocus(prevState: Snapshot): void;

  abstract left(prevState: Snapshot, step: number): Snapshot | null;
  abstract right(prevState: Snapshot, step: number): Snapshot | null;
  abstract up(prevState: Snapshot, step: number): Snapshot | null;
  abstract down(prevState: Snapshot, step: number): Snapshot | null;

  abstract newLine(prevState: Snapshot, parse: (src: string) => SyntaxNode): Snapshot;

  abstract update(prevState: Snapshot, char: string, parse: (src: string) => SyntaxNode): Snapshot;

  abstract delete(prevState: Snapshot, parse: (src: string) => SyntaxNode): Snapshot;
}
