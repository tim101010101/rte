import { VirtualNode } from 'lib/types';
import { entries } from 'lib/utils';

export const mountProps = (vNode: VirtualNode) => {
  const { el, props } = vNode;
  if (el && props) {
    entries(props).forEach(([k, v]) => el.setAttribute(k, v));
  }
};
