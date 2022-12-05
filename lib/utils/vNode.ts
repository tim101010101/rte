interface VirtualNode {
  nodeType: number;
  props: VirtualNodeProps;
  children: VirtualNodeChildren;

  el: HTMLElement | null;
}

interface VirtualNodeProps {
  className: string[];
  id: string;
}

type VirtualNodeChildren = Array<VirtualNode> | string;

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
