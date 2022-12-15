import { VirtualNode } from '../types';

export const textContent = (vNode: VirtualNode): string => {
  const { children } = vNode;

  return typeof children === 'string'
    ? children
    : children.reduce<string>(
        (res, cur) =>
          typeof cur === 'string' ? res + cur : res + textContent(cur),
        ''
      );
};

export const trackNode = (
  origin: VirtualNode,
  target: VirtualNode
): Array<number> => {
  const res: Array<number> = [];

  const backTrack = (
    cur: VirtualNode,
    target: VirtualNode,
    path: Array<number>
  ) => {
    if (cur === target) {
      res.push(...path);
      return;
    }

    const { children } = cur;
    if (typeof children !== 'string') {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (typeof child !== 'string') {
          path.push(i);
          backTrack(child, target, path);
          path.pop();
        }
      }
    }
  };

  backTrack(origin, target, []);

  return res;
};

export const setTextContent = (
  vNode: VirtualNode,
  path: number[],
  newContent: string
): VirtualNode => {
  let paren = vNode;
  while (path) paren = paren.children[path.shift()!] as VirtualNode;
  return vNode;
};
