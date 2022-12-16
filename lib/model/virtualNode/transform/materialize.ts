import { VirtualNode } from 'lib/types';
import {
  appendChild,
  createDomNode,
  createFragment,
  createTextNode,
  entries,
  set,
} from 'lib/utils';

export const materialize = (vNode: VirtualNode): HTMLElement => {
  const { tagName, children } = vNode;

  vNode.el = createDomNode(tagName);

  mountProps(vNode);
  mountListener(vNode);
  appendChild(
    vNode.el!,
    typeof children === 'string'
      ? createTextNode(children)
      : materializeChildren(children)
  );

  set(vNode.el, 'vNode', vNode);

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

const mountListener = (vNode: VirtualNode) => {
  const { el, events } = vNode;
  if (el && events) {
    events.forEach(([event, listener, capture]) =>
      el.addEventListener(event, listener as any, capture)
    );
  }
};
