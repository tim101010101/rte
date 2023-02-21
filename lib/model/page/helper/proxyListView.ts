import { LinkedList } from 'lib/model/listView';
import { OperableNode } from 'lib/types';
import { get, proxy } from 'lib/utils';
import { Renderer } from 'lib/view';
import { proxyOperable } from './proxyOperable';

export const proxyListView = (renderer: Renderer): LinkedList<OperableNode> => {
  const linkedList = new LinkedList<OperableNode>();

  const proxiedInsert = proxy(linkedList.insert, {
    apply(fn, thisArg, args: Parameters<typeof linkedList.insert>) {
      const [block, offset] = args;
      return fn.apply(thisArg, [proxyOperable(block, renderer), offset]);
    },
  });
  const proxiedRemove = proxy(linkedList.remove, {
    apply(fn, thisArg, args: Parameters<typeof linkedList.remove>) {
      const [block] = args;
      return fn.apply(thisArg, [block]);
    },
  });

  return proxy(linkedList, {
    get(target, k, receiver) {
      switch (k) {
        case 'insert':
          return proxiedInsert;
        case 'remove':
          return proxiedRemove;

        default:
          return get(target, k, receiver);
      }
    },
  });
};
