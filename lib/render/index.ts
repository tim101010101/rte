import { VirtualNode, VirtualNodeChildren } from '../types';
import { appendChild, removeChild } from '../utils';
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
  oldVNode && removeChild(container, oldVNode.el!);
  appendChild(container, n2);
};

export const patchChildren = (
  oldChildren: any,
  newChildren: any,
  parent: HTMLElement
) => {
  if (oldChildren) {
    oldChildren.forEach((child: any) => {
      const { el } = child;
      el && removeChild(parent, el);
    });
  }

  newChildren.forEach((child: any) => {
    const el = materialize(child);
    appendChild(parent, el);
  });
};
