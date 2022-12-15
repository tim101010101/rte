import { VirtualNode } from '../types';
import { appendChild, replaceOldNode } from '../utils';
import { materialize } from '../virtualNode';

export const render = (vNode: VirtualNode, container: HTMLElement) => {
  const node = materialize(vNode);
  appendChild(container, node);
};

export const patch = (
  oldVNode: VirtualNode | null,
  newVNode: VirtualNode,
  container: HTMLElement
) => {
  const n2 = materialize(newVNode);
  if (!oldVNode) {
    appendChild(container, n2);
  } else {
    replaceOldNode(container, newVNode.el!, oldVNode.el!);
  }
};
