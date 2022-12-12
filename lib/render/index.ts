import { VirtualNode, VirtualNodeChildren } from '../types';
import {
  appendChild,
  insertBefore,
  removeChild,
  replaceOldNode,
} from '../utils';
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
