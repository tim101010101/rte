import { OperableNode } from 'lib/types';
import { proxy, set } from 'lib/utils';
import { Renderer } from 'lib/view';
import { calcFence } from './calcFence';

export const proxyOperable = (
  block: OperableNode,
  renderer: Renderer
): OperableNode => {
  return proxy(block, {
    set(target, k, newValue, receiver) {
      if (k === 'vNode') {
        const { vNode } = target.dump();
        // const { lineRect, rectList } = renderer.patch(newValue, vNode, rect);

        // set(target, 'rect', lineRect, receiver);
        // set(target, 'fence', calcFence(newValue, rectList), receiver);

        // TODO render vNode

        set(target, 'fence', calcFence(newValue), receiver);
      }

      return set(target, k, newValue, receiver);
    },
  });
};
