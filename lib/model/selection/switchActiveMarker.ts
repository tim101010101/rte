import { FontInfo, SetterFunction, SyntaxNode, VirtualNode } from 'lib/types';
import { NodeType, TagName } from 'lib/static';
import {
  ActivePos,
  deepCloneWithTrackNode,
  getAncestor,
  isMarkerNode,
  isPureTextAncestor,
  isTextNode,
  Pos,
} from 'lib/model';

const { SPAN } = TagName;
const { PLAIN_TEXT, PREFIX, SUFFIX } = NodeType;

const syntaxMarker = (
  text: string,
  isPrefix: boolean,
  fontInfo: FontInfo
): SyntaxNode => {
  return {
    type: isPrefix ? PREFIX : SUFFIX,
    isActive: true,
    tagName: SPAN,
    props: {},
    el: null,
    meta: {},
    events: [],
    marker: {},

    children: [
      {
        type: PLAIN_TEXT,
        tagName: SPAN,
        props: {},
        el: null,
        meta: {},
        font: fontInfo,
        text,
        events: [],
      },
    ],
  };
};

export const trySwitchActiveSyntaxNode = (
  pos: Pos,
  isCrossLine: boolean,
  active?: ActivePos | null
) => {
  const { block: posBlock, fenceOffset: posFenceOffset } = pos;
  const posFenceList = posBlock.fence.fenceList;
  const posPath = posFenceList[posFenceOffset].path;

  let resActive = active;
  let resPos = pos;

  // move cursor across line
  if (active) {
    const { block: activeBlock, offset: activeRootOffset } = active;

    if (activeBlock !== posBlock) {
      const [prevActive] = deepCloneWithTrackNode(active.block.vNode!);
      cancelActiveSubTree(getAncestor(prevActive, [activeRootOffset]));

      active.block.patch(prevActive);

      resActive = null;
    }

    // move cursor in the same line from left
    else if (activeRootOffset > posPath[0]) {
      const [newRoot] = deepCloneWithTrackNode(posBlock.vNode!);
      cancelActiveSubTree(getAncestor(newRoot, [activeRootOffset]));

      posBlock.patch(newRoot);

      resActive = null;
    }

    // move cursor in the same line from right
    else if (!isFollowingSyntaxNode(pos) && activeRootOffset < posPath[0]) {
      const [newRoot] = deepCloneWithTrackNode(posBlock.vNode!);
      const { prefix, suffix } = cancelActiveSubTree(
        getAncestor(newRoot, [activeRootOffset])
      );

      resPos = {
        block: posBlock,
        fenceOffset: posFenceOffset - prefix - suffix,
      };

      posBlock.patch(newRoot);

      resActive = null;
    }
  }

  if (!resActive) {
    if (!isPureTextAncestor(posBlock.vNode!, posPath)) {
      const [newRoot] = deepCloneWithTrackNode(posBlock.vNode!);
      const { prefix, suffix } = activeSubTree(getAncestor(newRoot, posPath));

      resActive = { block: posBlock, offset: posPath[0] };
      if (isCrossLine) {
        resPos = {
          block: posBlock,
          fenceOffset: posFenceOffset + prefix + suffix,
        };
      }

      posBlock.patch(newRoot);
    } else if (isFollowingSyntaxNode(pos)) {
      //! ERROR
      const [newRoot] = deepCloneWithTrackNode(posBlock.vNode!);
      const prevSyntaxNode = getAncestorPrevSibling(pos);
      const { prefix, suffix } = activeSubTree(prevSyntaxNode);

      resPos = {
        block: posBlock,
        fenceOffset: posFenceOffset + prefix + suffix,
      };
      resActive = { block: posBlock, offset: posPath[0] - 1 };

      posBlock.patch(newRoot);
    }
  }

  return {
    pos: resPos,
    active: resActive,
  };
};

const activeSubTree = (root: VirtualNode) => {
  let prefixLength = 0;
  let suffixLnegth = 0;

  const recur = (cur: VirtualNode) => {
    if (isTextNode(cur)) return;

    const { isActive, children, marker } = cur;
    const { prefix, suffix } = marker;
    if (!isActive) {
      // TODO font info
      if (prefix) {
        cur.children.unshift(
          syntaxMarker(prefix, true, {
            size: 20,
            family: 'Arial, Helvetica, sans-serif',
            bold: false,
            italic: false,
          })
        );
        prefixLength += prefix.length;
      }

      if (suffix) {
        cur.children.push(
          syntaxMarker(suffix, false, {
            size: 20,
            family: 'Arial, Helvetica, sans-serif',
            bold: false,
            italic: false,
          })
        );
        suffixLnegth += suffix.length;
      }

      cur.isActive = true;
    }

    children.forEach(child => activeSubTree(child));
  };

  recur(root);

  return {
    prefix: prefixLength,
    suffix: suffixLnegth,
  };
};

const cancelActiveSubTree = (root: VirtualNode) => {
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

  recur(root);

  return {
    prefix: prefixLength,
    suffix: suffixLength,
  };
};

const isFollowingSyntaxNode = ({ block, fenceOffset }: Pos) => {
  const root = block.vNode!;
  const {
    vNode: target,
    textOffset,
    path,
  } = block.fence.fenceList[fenceOffset];

  if (textOffset) return false;
  if (isMarkerNode(target)) return false;

  const ancestorSiblings = root.children;
  const prevSibling = ancestorSiblings[path[0] - 1];

  return !!prevSibling && !isTextNode(prevSibling);
};

const getAncestorPrevSibling = ({ block, fenceOffset }: Pos) => {
  const root = block.vNode!;
  const { path } = block.fence.fenceList[fenceOffset];

  const ancestorSiblings = root.children;
  const prevSibling = ancestorSiblings[path[0] - 1];

  return prevSibling;
};
