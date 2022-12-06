import { VirtualNode } from '../types';
import { appendChild, createDomNode, createTextNode } from '../utils/dom';
import { NodeTypes } from '../virtualNode/nodeTypes';

export const render = (vNode: VirtualNode, container: HTMLElement) => {
  mount(vNode, container);
};

const mount = (vNode: VirtualNode, container: HTMLElement) => {
  if (vNode.nodeType & NodeTypes.BLOCK) {
    createBlock(vNode);
  } else {
    createInlineBlock(vNode);
  }

  const { el } = vNode;
  if (el) {
    mountListener(vNode);
    mountChildren(vNode.children, el);

    appendChild(container, el);
  }
};

const createBlock = (vNode: VirtualNode) => {
  const el = createDomNode('div', ['r-block-test']);
  vNode.el = el;
};

const createInlineBlock = (vNode: VirtualNode) => {
  const { nodeType, children } = vNode;
  const content = children as string;
  nodeType & NodeTypes.PLAIN_TEXT && plainText(vNode, content);
  nodeType & NodeTypes.BOLD && bold(vNode, content);
};

const mountChildren = (
  children: Array<VirtualNode> | string,
  parent: HTMLElement
) => {
  if (typeof children === 'string') {
    const textNode = createTextNode(children);
    appendChild(parent, textNode);
  } else {
    children.forEach(child => mount(child, parent));
  }
};

const mountListener = (vNode: VirtualNode) => {
  const { el, events } = vNode;
  if (el && events) {
    events.forEach(([event, listener]) =>
      el.addEventListener(event, listener as any)
    );
  }
};

const plainText = (vNode: VirtualNode, content: string) => {
  const { el } = vNode;
  if (!el) {
    const el = createDomNode('span', ['r-plain-text-test']);
    el.innerText = content;
    vNode.el = el;
  }
};

const bold = (vNode: VirtualNode, content: string) => {
  const { el } = vNode;
  const dom = createDomNode('strong', ['r-inline-test']);
  if (!el) {
    dom.innerText = content;
    vNode.el = dom;
  } else {
    appendChild(el, dom);
  }
};
