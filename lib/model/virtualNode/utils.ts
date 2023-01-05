import { FontInfo, SyntaxNode, TextNode, VirtualNode } from 'lib/types';
import { NodeType } from 'lib/static';
import { set } from 'lib/utils';
import { syntaxMarker } from 'lib/model';

const { PLAIN_TEXT, PREFIX, SUFFIX } = NodeType;

export const getFont = (fontInfo: FontInfo) => {
  const { size, family, bold, italic } = fontInfo;
  return `${italic ? 'italic' : 'normal'} ${
    bold ? 'bold' : 'normal'
  } ${size}px ${family}`;
};

export const isMarkerNode = (vNode: VirtualNode): vNode is SyntaxNode =>
  vNode.type === PREFIX || vNode.type === SUFFIX;

export const isTextNode = (vNode: VirtualNode): vNode is TextNode =>
  vNode.type === PLAIN_TEXT;

export const isPureTextAncestor = (root: VirtualNode, path: Array<number>) => {
  if (isTextNode(root)) return true;
  return !!(root.children[path[0]].type === PLAIN_TEXT);
};

export const deepCloneVNode = <T extends VirtualNode>(vNode: T): T => {
  if (!vNode) return vNode;

  const newVNode = { ...vNode };

  set(
    newVNode,
    isTextNode(vNode) ? 'children' : 'text',
    isTextNode(vNode)
      ? vNode.text
      : vNode.children.reduce<Array<T>>((res, child) => {
          res.push(deepCloneVNode(child as T));
          return res;
        }, [])
  );

  return newVNode;
};

export const deepCloneWithTrackNode = (
  vNode: VirtualNode,
  target?: VirtualNode
): [VirtualNode, Array<number>] => {
  const path: Array<number> = [];
  let hasFound = false;

  const dfs = (cur: VirtualNode) => {
    if (!cur) return cur;
    if (target && cur === target) hasFound = true;

    const newVNode = { ...cur };

    set(
      newVNode,
      isTextNode(cur) ? 'children' : 'text',
      isTextNode(cur)
        ? cur.text
        : cur.children.reduce<Array<VirtualNode>>((res, child, i) => {
            hasFound || path.push(i);
            res.push(dfs(child));
            hasFound || path.pop();
            return res;
          }, [])
    );

    return newVNode;
  };

  return [dfs(vNode), path];
};

export const textContentWithMarker = (vNode: VirtualNode): string => {
  if (!vNode) return '';

  if (isTextNode(vNode)) {
    return vNode.text;
  } else {
    let subRes = '';
    const { marker, children, isActive } = vNode;
    const { prefix, suffix } = marker;
    if (!isActive && prefix) subRes += prefix;
    subRes += children.reduce((content, cur) => {
      content += textContentWithMarker(cur);
      return content;
    }, '');
    if (!isActive && suffix) subRes += suffix;

    return subRes;
  }
};

export const textContent = (vNode: VirtualNode): string => {
  if (isTextNode(vNode)) {
    return vNode.text;
  } else {
    return vNode.children.reduce((res, cur) => res + textContent(cur), '');
  }
};

export const setTextContent = (
  root: VirtualNode,
  path: Array<number>,
  newTextContent: string
) => {
  const target = getNode(root, path);
  const parent = getParent(root, path);

  if (isTextNode(parent) || !isTextNode(target)) return;

  parent.children[path[path.length - 1]] = {
    ...target,
    text: newTextContent,
  };
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
  vNode: VirtualNode,
  callback: (
    textNode: TextNode,
    parent: SyntaxNode | null,
    path: Array<number>
  ) => void
) => {
  const path: Array<number> = [];
  const dfs = (cur: VirtualNode, parent: SyntaxNode | null) => {
    if (!cur) return;

    if (isTextNode(cur)) {
      callback(cur, parent, [...path]);
    } else {
      cur.children.forEach((child, i) => {
        path.push(i);
        dfs(child, cur);
        path.pop();
      });
    }
  };

  dfs(vNode, null);
};

export const getTextList = (vNode: SyntaxNode) => {
  const res: Array<string> = [];
  walkTextNode(vNode, textNode => {
    res.push(textNode.text);
  });
  return res;
};

export const getAncestorRectList = (vNode: SyntaxNode) => {
  const rectList: Array<DOMRect> = [];
  vNode.children.forEach(child => {
    const rect = posNode(child);
    rect && rectList.push(rect);
  });

  return rectList;
};

export const getNode = (root: VirtualNode, path: Array<number>) => {
  let cur = root;
  let idx = path.length - 1;
  while (idx >= 0) {
    if (!isTextNode(cur)) {
      cur = cur.children[path[idx--]];
    }
  }
  return cur;
};

export const getParent = (root: VirtualNode, path: Array<number>) => {
  let cur = root;
  let idx = path.length - 1;
  while (idx > 0) {
    if (!isTextNode(cur)) {
      cur = cur.children[path[idx--]];
    }
  }
  return cur;
};

export const getAncestor = (root: VirtualNode, path: Array<number>) => {
  if (isTextNode(root)) return root;
  return root.children[path[0]] as SyntaxNode;
};

export const getMarkerLength = (root: VirtualNode) => {
  let prefixLength = 0;
  let suffixLength = 0;

  const recur = (cur: VirtualNode) => {
    if (isTextNode(cur)) return;

    const { marker, children } = cur;
    const { prefix, suffix } = marker;

    if (prefix) prefixLength += prefix.length;
    if (suffix) suffixLength += suffix.length;

    children.forEach(child => recur(child));
  };

  recur(root);

  return {
    prefix: prefixLength,
    suffix: suffixLength,
  };
};

export const getFirstLeafNode = (root: VirtualNode): TextNode => {
  let cur = root;
  while (!isTextNode(cur)) {
    cur = cur.children[0];
  }
  return cur;
};

export const activeSubTree = (root: SyntaxNode, offset: number) => {
  let prefixLength = 0;
  let suffixLnegth = 0;

  const recur = (cur: VirtualNode) => {
    if (isTextNode(cur)) return;

    const { isActive, children, marker } = cur;
    const { prefix, suffix } = marker;
    if (!isActive) {
      const { font } = getFirstLeafNode(cur);
      if (prefix) {
        cur.children.unshift(syntaxMarker(prefix, true, font));
        prefixLength += prefix.length;
      }

      if (suffix) {
        cur.children.push(syntaxMarker(suffix, false, font));
        suffixLnegth += suffix.length;
      }

      cur.isActive = true;
    }

    children.forEach(child => recur(child));
  };

  const newRoot = deepCloneVNode(root);
  recur(newRoot.children[offset]);

  return {
    root: newRoot,
    prefix: prefixLength,
    suffix: suffixLnegth,
  };
};

export const cancelActiveSubTree = (root: SyntaxNode, offset: number) => {
  let prefixLength = 0;
  let suffixLength = 0;

  const recur = (cur: VirtualNode) => {
    if (isTextNode(cur)) return;

    const { isActive, children, marker } = cur;
    const { prefix, suffix } = marker;
    if (isActive) {
      if (prefix) {
        cur.children.shift();
        prefixLength += prefix.length;
      }
      if (suffix) {
        cur.children.pop();
        suffixLength += suffix.length;
      }

      cur.isActive = false;
    }

    children.forEach(child => recur(child));
  };

  const newRoot = deepCloneVNode(root);
  recur(newRoot.children[offset]);

  return {
    root: newRoot,
    prefix: prefixLength,
    suffix: suffixLength,
  };
};
