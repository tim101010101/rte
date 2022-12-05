export interface VirtualNode {
  nodeType: number;
  props: VirtualNodeProps;
  children: VirtualNodeChildren;

  el: HTMLElement | null;
}

export interface VirtualNodeProps {
  className: string[];
  id: string;
}

export type VirtualNodeChildren = Array<VirtualNode> | string;
