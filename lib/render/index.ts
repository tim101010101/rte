import { VirtualNode } from '../types';
import { appendChild } from '../utils';
import { materialize } from '../virtualNode';

export const render = (vNode: VirtualNode, container: HTMLElement) => {
  const node = materialize(vNode);
  appendChild(container, node);
};
