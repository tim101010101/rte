import { deepCloneVNode, isTextNode } from 'lib/model';
import { Operable, VirtualNode } from 'lib/types';

export const initPatchBuffer = () => {
  const buffer = new Map<Operable, Array<number>>();

  const addTarget = (block: Operable, target: number) => {
    if (buffer.has(block)) {
      buffer.set(block, [...buffer.get(block)!, target]);
    } else {
      buffer.set(block, [target]);
    }
  };

  const flushBuffer = (active: boolean, newVNode?: VirtualNode) => {
    Array.from(buffer.entries()).forEach(([block, activeTargets]) => {
      block.patch(
        deepCloneVNode(newVNode || block.vNode, (cur, i) => {
          if (!isTextNode(cur) && activeTargets.includes(i)) {
            cur.isActive = active;
          }
          return cur;
        })
      );
    });
    buffer.clear();
  };

  return {
    addTarget,
    flushBuffer,
  };
};
