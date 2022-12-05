import { VirtualNode, VirtualNodeChildren, VirtualNodeProps } from '../types';

export const h = (
  nodeType: number,
  props: VirtualNodeProps,
  children: VirtualNodeChildren
): VirtualNode => {
  return {
    nodeType,
    props,
    children,

    el: null,
  };
};
