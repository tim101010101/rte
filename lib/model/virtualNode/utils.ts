import { VirtualNode } from '../../types';
import { h } from './h';

// TODO
export const activeMarker = (vNode: VirtualNode, target: VirtualNode) => {
  const { tagName, events, props } = vNode;
  return h(
    tagName,
    props,
    [
      h('span', { classList: ['r-bold'] }, '**'),
      target,
      h('span', { classList: ['r-bold'] }, '**'),
    ],
    events
  );
};

// TODO
export const textContent = (vNode: VirtualNode | string): string => {
  if (typeof vNode === 'string') return vNode;

  const { children } = vNode;
  return typeof children === 'string'
    ? children
    : children.reduce<string>((res, cur) => res + textContent(cur), '');
};

export const isElementVisiable = (vNode: VirtualNode) => {
  const { el } = vNode;
  return el ? !el.classList.contains('r-hide') : false;
};

export const posNode = (vNode: VirtualNode) => {
  const { el } = vNode;
  if (!el) return null;

  const range = document.createRange();
  range.selectNode(el);
  const res = Array.from(range.getClientRects());
  range.detach();

  return res.shift()!;
};

export const walkVisiableNode = (
  vNode: VirtualNode,
  callback: (node: VirtualNode) => void
) => {
  const { children } = vNode;
  if (typeof children === 'string') return;

  const nodeList = [...vNode.children];
  while (nodeList.length) {
    const node = nodeList.shift()!;

    if (typeof node === 'string' || !isElementVisiable(node)) {
      continue;
    } else {
      callback(node);
    }

    nodeList.unshift(...node.children);
  }
};

export const flatTreeToText = (vNode: VirtualNode) => {
  const res: Array<string> = [];
  walkVisiableNode(vNode, node => {
    const { children } = node;
    if (typeof children === 'string') {
      res.push(children);
    }
  });
  return res;
};

export const getVisiableTextRectList = (vNode: VirtualNode) => {
  const rectList: Array<DOMRect> = [];
  walkVisiableNode(vNode, node => {
    const { children } = node;
    if (typeof children === 'string') {
      const rect = posNode(node);
      rect && rectList.push(rect);
    }
  });

  return rectList;
};
