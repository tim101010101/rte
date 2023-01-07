import { SyntaxNode } from 'lib/types';
import { appendChild, removeAllChild, replaceOldNode } from 'lib/utils';
import { materialize, Page } from 'lib/model';

export const render = (vNode: SyntaxNode, container: HTMLElement) => {
  const node = materialize(vNode);
  appendChild(container, node);
};

export const patchBlock = (
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

export const patchPage = (page: Page, container: HTMLElement) => {
  removeAllChild(container);
  page.forEach(block => block.patch(block.vNode));
};
