import {
  ClientRect,
  FontInfo,
  Point,
  Rect,
  SyntaxNode,
  SyntaxNodeWithLayerActivation,
  TextNode,
  VirtualNode,
} from 'lib/types';
import { NodeType } from 'lib/static';
import { entries, get, has, panicAt, set } from 'lib/utils';

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

export const isSyntaxNodeWithLayerActivation = (
  vNode: VirtualNode
): vNode is SyntaxNodeWithLayerActivation =>
  vNode.type !== PLAIN_TEXT && has(vNode, 'content');

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

  const getAncestor = (
    vNode: SyntaxNode | SyntaxNodeWithLayerActivation,
    idx: number
  ) => {
    const { children } = vNode;
    const childrenLength = children.length;

    if (isSyntaxNodeWithLayerActivation(vNode)) {
      const { content } = vNode;
      const contentLength = content.length;
      return idx < 0 || idx >= contentLength + childrenLength
        ? panicAt(`index of ancestor is out of bound: ${idx}`)
        : idx < contentLength
        ? content[idx]
        : children[idx - contentLength];
    } else {
      return idx >= childrenLength
        ? panicAt(`index of ancestor is out of bound: ${idx}`)
        : children[idx];
    }
  };

  if (indexes.length === 1) {
    return getAncestor(vNode, indexes[0]);
  } else {
    return indexes.map(idx => getAncestor(vNode, idx));
  }
}

export const walkTextNode = (
  vNode: VirtualNode,
  callback: (
    textNode: TextNode,
    parent: SyntaxNode | SyntaxNodeWithLayerActivation,
    ancestor: VirtualNode
  ) => void
) => {
  const dfs = (
    cur: VirtualNode,
    parent: SyntaxNode | SyntaxNodeWithLayerActivation | null,
    ancestor: VirtualNode | null
  ) => {
    if (!cur) return;

    if (isTextNode(cur)) {
      if (parent && ancestor) {
        callback(cur, parent, ancestor);
      } else {
        panicAt('try to manipulate a naked text node');
      }
    } else {
      const { children } = cur;
      if (isSyntaxNodeWithLayerActivation(cur)) {
        const { content } = cur;
        let i = 0;
        content.forEach(child => {
          dfs(child, cur, ancestor || child);
          i++;
        });
        children.forEach((child, j) => {
          dfs(child, cur, ancestor || child);
        });
      } else {
        children.forEach((child, i) => {
          dfs(child, cur, ancestor || child);
        });
      }
    }
  };

  dfs(vNode, null, null);
};

export const walkTextNodeWithMoreInformation = (
  vNode: VirtualNode,
  callback: (
    textNode: TextNode,
    parent: SyntaxNode | SyntaxNodeWithLayerActivation,
    ancestor: VirtualNode,
    idxInAncestor: number,
    juncFlag: -1 | 0 | 1
  ) => void
) => {
  let idx = 0;
  let prevAncestor: VirtualNode | null = null;

  const dfs = (
    cur: VirtualNode,
    parent: SyntaxNode | SyntaxNodeWithLayerActivation | null,
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
      if (isSyntaxNodeWithLayerActivation(cur)) {
        cur.content.forEach(child => dfs(child, cur, ancestor || child, -1));
        children.forEach((child, j) => {
          dfs(child, cur, ancestor || child, j === 0 ? 0 : 1);
        });
      } else {
        children.forEach(child => dfs(child, cur, ancestor || child, 1));
      }
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
  callback?: (vNode: VirtualNode) => void
): T => {
  if (!vNode) return vNode;

  const dfs = (vNode: T) => {
    const newVNode = entries(vNode).reduce((newVNode, [k, v]) => {
      switch (k) {
        case 'content':
        case 'children':
          set(
            newVNode,
            k,
            (v as Array<VirtualNode>).map(sub => deepCloneVNode(sub, callback))
          );
          break;
        default:
          set(newVNode, k, v);
          break;
      }

      return newVNode;
    }, {} as VirtualNode);

    callback && callback(newVNode);

    return newVNode as T;
  };

  return dfs(vNode);
};

export const walkSubtreeWithEffect = (
  vNode: VirtualNode,
  ancestorIdx: number,
  effectFn: (vNode: VirtualNode) => void
): SyntaxNode | SyntaxNodeWithLayerActivation => {
  if (isTextNode(vNode)) {
    return panicAt('try to walk a single textNode');
  }

  const dfs = (cur: VirtualNode) => {
    if (isTextNode(cur)) return;

    effectFn(vNode);

    if (isSyntaxNodeWithLayerActivation(cur)) {
      cur.content.forEach(dfs);
    }
    cur.children.forEach(dfs);
  };

  dfs(getAncestorByIdx(vNode, ancestorIdx));

  return vNode;
};
