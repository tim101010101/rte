import { SyntaxNode, TextNode, VirtualNode } from 'lib/types';
import { NodeType } from 'lib/static';
import { set } from 'lib/utils';

const { PLAIN_TEXT, PREFIX, SUFFIX } = NodeType;

export const isTheseTypes = (
  vNode: VirtualNode,
  ...types: NodeType[]
): boolean => {
  return !!types.reduce((res, cur) => res && !!(vNode.type & cur), true);
};

export const isTextNode = (vNode: VirtualNode): vNode is TextNode =>
  !!(vNode.type & PLAIN_TEXT);

export const isPureTextNode = (vNode: VirtualNode): vNode is TextNode =>
  vNode.type === PLAIN_TEXT;

export const isMarkerTextNode = (vNode: VirtualNode): vNode is TextNode =>
  isTheseTypes(vNode, PLAIN_TEXT, PREFIX) ||
  isTheseTypes(vNode, PLAIN_TEXT, SUFFIX);

export const isActive = (vNode: VirtualNode) => vNode.isActive;

export const deepCloneWithTrackNode = (
  vNode: VirtualNode,
  target: VirtualNode
): [VirtualNode, Array<number>] => {
  const path: Array<number> = [];
  let hasFound = false;

  const dfs = (cur: VirtualNode) => {
    if (!cur) return cur;
    if (cur === target) hasFound = true;

    const newVNode = { ...cur };

    set(
      newVNode,
      'children',
      isTextNode(cur)
        ? cur.text
        : cur.children.reduce<Array<VirtualNode>>((res, child, i) => {
            hasFound || path.unshift(i);
            res.push(dfs(child));
            hasFound || path.shift();
            return res;
          }, [])
    );

    return newVNode;
  };

  return [dfs(vNode), path];
};

export const textContent = (vNode: VirtualNode): string => {
  if (isTextNode(vNode)) {
    return vNode.text;
  } else {
    return vNode.children.reduce((res, cur) => res + textContent(cur), '');
  }
};

export const posNode = (vNode: VirtualNode) => {
  const { el } = vNode;
  if (!el) return null;

  const range = document.createRange();
  range.selectNode(el);
  const res = Array.from(range.getClientRects());
  range.detach();

  return res.shift()!;
};

export const walkTextNode = (
  vNode: SyntaxNode,
  callback: (textNode: TextNode) => void
) => {
  const nodeList = [...vNode.children];
  while (nodeList.length) {
    const node = nodeList.shift()!;
    if (isTextNode(node)) {
      callback(node);
    } else {
      nodeList.unshift(...node.children);
    }
  }
};

export const getTextList = (vNode: SyntaxNode) => {
  const res: Array<string> = [];
  walkTextNode(vNode, textNode => {
    res.push(textNode.text);
  });
  return res;
};

export const getTextRectList = (vNode: SyntaxNode) => {
  const rectList: Array<DOMRect> = [];
  walkTextNode(vNode, textNode => {
    const rect = posNode(textNode);
    rect && rectList.push(rect);
  });

  return rectList;
};

export const getParent = (root: VirtualNode, path: Array<number>) => {
  let cur = root;
  while (path.length !== 1) {
    if (!isTextNode(cur)) {
      cur = cur.children[path.pop()!] as SyntaxNode;
    }
  }
  return cur;
};
