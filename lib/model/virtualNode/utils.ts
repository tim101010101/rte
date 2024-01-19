import {
  ClientRect,
  FontInfo,
  Point,
  Rect,
  SyntaxNode,
  TextNode,
  VirtualNode,
} from 'lib/types';
import { NodeType } from 'lib/static';
import { entries, get, has, panicAt, set } from 'lib/utils';

const { PLAIN_TEXT } = NodeType;

export const getFont = (fontInfo: FontInfo) => {
  const { size, family, bold, italic } = fontInfo;
  return `${italic ? 'italic' : 'normal'} ${
    bold ? 'bold' : 'normal'
  } ${size}px ${family}`;
};

// export const isMarkerNode = (vNode: VirtualNode): vNode is SyntaxNode =>
//   vNode.type === PREFIX || vNode.type === SUFFIX;

export const isTextNode = (vNode: VirtualNode): vNode is TextNode =>
  vNode.type === PLAIN_TEXT;

export const isEmptyNode = (vNode: VirtualNode) => {
  if (isTextNode(vNode)) {
    return vNode.text === '';
  } else {
    return vNode.children.length === 0;
  }
};

export const isHitRect = (pos: Point, rect: Rect | ClientRect) => {
  const [x, y] = pos;
  const { width, height } = rect;
  const xr = has(rect, 'x') ? get(rect, 'x') : get(rect, 'clientX');
  const yr = has(rect, 'y') ? get(rect, 'y') : get(rect, 'clientY');
  return x >= xr && y >= yr && x <= xr + width && y <= yr + height;
};

export function getAncestorByIdx(vNode: VirtualNode, idx: number): VirtualNode;
export function getAncestorByIdx(
  vNode: VirtualNode,
  ...indexes: Array<number>
): Array<VirtualNode>;
export function getAncestorByIdx(
  vNode: VirtualNode,
  ...indexes: Array<number>
): VirtualNode | Array<VirtualNode> {
  if (isTextNode(vNode)) {
    return panicAt('try to get ancestor from a single textNode');
  }

  const getAncestor = (vNode: SyntaxNode, idx: number) => {
    const { children } = vNode;
    const childrenLength = children.length;

    return idx >= childrenLength
      ? panicAt(`index of ancestor is out of bound: ${idx}`)
      : children[idx];
  };

  if (indexes.length === 1) {
    return getAncestor(vNode, indexes[0]);
  } else {
    return indexes.map(idx => getAncestor(vNode, idx));
  }
}

export const isSameNode = (node1: VirtualNode, node2: VirtualNode): boolean => {
  if (isTextNode(node1) !== isTextNode(node2)) {
    return false;
  }

  if (isTextNode(node1) && isTextNode(node2)) {
    return node1.text === node2.text;
  } else {
    return (
      (node1 as SyntaxNode).isActive === (node2 as SyntaxNode).isActive &&
      textContent(node1) === textContent(node2)
    );
  }
};

export function walkTextNode(
  vNode: VirtualNode,
  callback: (
    textNode: TextNode,
    i: number,
    parent: SyntaxNode | null,
    ancestor: VirtualNode | null
  ) => void
): void {
  const idx = 0;
  const dfs = (
    cur: VirtualNode,
    parent: SyntaxNode | null,
    ancestor: VirtualNode | null
  ) => {
    if (!cur) return;

    if (isTextNode(cur)) {
      if (parent && ancestor) {
        callback(cur, idx, parent, ancestor);
      } else {
        callback(cur, idx, null, null);
      }
    } else {
      const { children } = cur;
      children.forEach(child => {
        dfs(child, cur, ancestor || child);
      });
    }
  };

  dfs(vNode, null, null);
}

export const walkTextNodeWithMoreInformation = (
  vNode: VirtualNode,
  callback: (
    textNode: TextNode,
    parent: SyntaxNode,
    ancestor: VirtualNode,
    idxInAncestor: number,
    juncFlag: -1 | 0 | 1
  ) => void
) => {
  let idx = 0;
  let prevAncestor: VirtualNode | null = null;

  const dfs = (
    cur: VirtualNode,
    parent: SyntaxNode | null,
    ancestor: VirtualNode | null,
    juncFlag: -1 | 0 | 1
  ) => {
    if (!cur) return;

    if (ancestor !== prevAncestor) {
      prevAncestor = ancestor;
      idx = 0;
    }

    if (isTextNode(cur)) {
      if (parent && ancestor) {
        callback(cur, parent, ancestor, idx, juncFlag);
        idx++;
      } else {
        panicAt('try to manipulate a naked text node');
      }
    } else {
      const { children } = cur;
      children.forEach(child => dfs(child, cur, ancestor || child, 1));
    }
  };

  dfs(vNode, null, null, 1);
};

export const textContent = (vNode: VirtualNode): string => {
  let res = '';
  walkTextNode(vNode, ({ text }) => (res += text));
  return res;
};

export const deepCloneVNode = <T extends VirtualNode>(
  vNode: T,
  callback?: (vNode: VirtualNode, ancestorIdx: number) => VirtualNode
): T => {
  const dfs = (vNode: VirtualNode, ancestorIdx: number) => {
    const newVNode = entries(vNode).reduce((newVNode, [k, v]) => {
      switch (k) {
        case 'children':
          set(
            newVNode,
            k,
            (v as Array<VirtualNode>).map(sub => dfs(sub, ancestorIdx))
          );
          break;
        default:
          set(newVNode, k, v);
          break;
      }

      return newVNode;
    }, {} as VirtualNode);

    return callback ? callback(newVNode, ancestorIdx) : newVNode;
  };

  const newRoot = { ...vNode };
  if (isTextNode(vNode)) {
    return newRoot;
  } else {
    const { children } = vNode;
    set(
      newRoot,
      'children',
      children.map((cur, i) => dfs(cur, i))
    );
  }

  return newRoot;
};

export const walkSubtreeWithEffect = (
  vNode: VirtualNode,
  ancestorIdx: number,
  effectFn: (vNode: VirtualNode) => void
): SyntaxNode => {
  if (isTextNode(vNode)) {
    return panicAt('try to walk a single textNode');
  }

  const dfs = (cur: VirtualNode) => {
    if (isTextNode(cur)) return;

    effectFn(vNode);

    cur.children.forEach(dfs);
  };

  dfs(getAncestorByIdx(vNode, ancestorIdx));

  return vNode;
};
