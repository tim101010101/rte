import { OperableNode } from './interfaces';
import { VirtualNode } from './virtualNode';

export interface Context {
  fullPatch(lineVNodes: Array<VirtualNode>): void;

  installBlock(newBlock: OperableNode, anchorBlock: OperableNode): void;
  uninstallBlock(block: OperableNode): void;
}
