import { deepClone } from 'lib/utils';
import { Block, walkNode } from 'lib/model';
import { VirtualNode } from 'lib/types';

export const activeNode = (target: VirtualNode, block: Block) => {
  if (target?.props.classList?.includes('r-bold')) {
    // TODO deep clone for this time being
    const { vNode } = block;
    const newVNode = deepClone(vNode!);

    walkNode(newVNode, (cur, parent) => {
      if (parent && cur.el === target.el) {
        const children = parent.children as Array<VirtualNode>;
        const prefix = children.shift()!;
        const suffix = children.pop()!;
        children.unshift({
          ...prefix,
          props: {
            classList: ['r-grey'],
          },
        });
        children.push({
          ...suffix,
          props: {
            classList: ['r-grey'],
          },
        });
        parent.children = children;
      }
    });

    block.patch(newVNode);
  }
};

export const cancelActiveNode = (target: VirtualNode, block: Block) => {
  if (target?.props.classList?.includes('r-bold')) {
    // TODO deep clone for this time being
    const { vNode } = block;
    const newVNode = deepClone(vNode!);

    walkNode(newVNode, (cur, parent) => {
      if (parent && cur.el === target.el) {
        const children = parent.children as Array<VirtualNode>;
        const prefix = children.shift()!;
        const suffix = children.pop()!;
        children.unshift({
          ...prefix,
          props: {
            classList: ['r-hide'],
          },
        });
        children.push({
          ...suffix,
          props: {
            classList: ['r-hide'],
          },
        });
        parent.children = children;
      }
    });

    block.patch(newVNode);
  }
};
