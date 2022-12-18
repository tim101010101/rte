import { SyntaxNode } from 'lib/types';
import { appendChild, replaceOldNode } from 'lib/utils';
import { materialize } from 'lib/model';

export const render = (vNode: SyntaxNode, container: HTMLElement) => {
  const node = materialize(vNode);
  appendChild(container, node);
};

export const patch = (
  oldVNode: SyntaxNode | null,
  newVNode: SyntaxNode,
  container: HTMLElement
) => {
  const n2 = materialize(newVNode);
  if (!oldVNode) {
    appendChild(container, n2);
  } else {
    replaceOldNode(container, newVNode.el!, oldVNode.el!);
  }
};
