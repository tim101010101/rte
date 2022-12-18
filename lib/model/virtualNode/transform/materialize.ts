import { isTextNode } from 'lib/model';
import { SyntaxNode, VirtualNode } from 'lib/types';
import {
  appendChild,
  createDomNode,
  createFragment,
  createTextNode,
  entries,
} from 'lib/utils';

export const materialize = (vNode: VirtualNode): HTMLElement => {
  vNode.el = createDomNode(vNode.tagName);

  mountProps(vNode);
  if (isTextNode(vNode)) {
    const { text } = vNode;
    appendChild(vNode.el!, createTextNode(text));
  } else {
    const { children } = vNode;
    mountListener(vNode);
    appendChild(vNode.el!, materializeChildren(children));
  }

  return vNode.el!;
};

const materializeChildren = (
  children: Array<VirtualNode>
): DocumentFragment => {
  return children.reduce((fragment, child) => {
    return appendChild(fragment, materialize(child));
  }, createFragment());
};

const mountProps = (vNode: VirtualNode) => {
  const { el, props } = vNode;
  if (el && props) {
    entries(props).forEach(([k, v]) => {
      if (k === 'classList') {
        (v as Array<string>).forEach(className => el.classList.add(className));
      } else {
        el.setAttribute(k, v);
      }
    });
  }
};

const mountListener = (vNode: SyntaxNode) => {
  const { el, events } = vNode;
  if (el && events) {
    events.forEach(([event, listener, capture]) =>
      el.addEventListener(event, listener as any, capture)
    );
  }
};
