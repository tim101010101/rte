import { FontInfo, Rect, SyntaxNode, VirtualNode } from 'lib/types';
import { NodeType, TagName } from 'lib/static';
import {
  ActivePos,
  Block,
  deepCloneWithTrackNode,
  getAncestor,
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

// TODO
const getHitPos = ({ block, fenceOffset }: Pos) => {
  const { fence } = block;
  for (let i = 0; i < fence.length; i++) {
    const { fenceList } = fence[i];
    const len = fenceList.length;
    if (fenceOffset >= len) {
      fenceOffset -= len;
    } else {
      return fenceOffset === 0 ? -1 : fenceOffset === len - 1 ? 1 : 0;
    }
  }
};

const tryCancelActiveSyntaxNode = (
  prevPos: Pos | null,
  curPos: Pos,
  active: ActivePos | null,
  isCrossLine: boolean
) => {
  let resPos = curPos;
  let resActive = active;

  const { block: posBlock, fenceOffset: posFenceOffset } = curPos;
  const { ancestorOffset } = getCorrectPos(posBlock, posFenceOffset)!;

  if (isCrossLine && active) {
    console.log('cancel active');
    const [newRoot] = deepCloneWithTrackNode(active.block.vNode!);
    cancelActiveSubTree(getAncestor(newRoot, [active.offset]));

    console.log('patch prev line');
    active.block.patch(newRoot);

    resActive = null;
  } else if (active && ancestorOffset !== active.offset) {
    console.log('cancel active');

    const [newRoot] = deepCloneWithTrackNode(active.block.vNode!);
    const { prefix, suffix } = cancelActiveSubTree(
      getAncestor(newRoot, [active.offset])
    );

    if (prevPos) {
      const prevHit = getHitPos(prevPos);
      if (prevHit === 1) {
        console.log('offset - prefix - suffix');
        resPos = {
          block: posBlock,
          fenceOffset: posFenceOffset - prefix - suffix,
        };
      }
    }

    active.block.patch(newRoot);
    resActive = null;
  }

  return {
    pos: resPos,
    active: resActive,
  };
};

const tryActiveSyntaxNode = (curPos: Pos, active: ActivePos | null) => {
  const { block: posBlock, fenceOffset: posFenceOffset } = curPos;
  const { vNode, ancestorOffset } = getCorrectPos(posBlock, posFenceOffset)!;

  let resPos = curPos;
  let resActive = active;

  if (!isTextNode(vNode) && !resActive) {
    console.log('active');

    const [newRoot] = deepCloneWithTrackNode(curPos.block.vNode!);
    const { prefix, suffix } = activeSubTree(
      getAncestor(newRoot, [ancestorOffset])
    );

    resActive = {
      block: posBlock,
      offset: ancestorOffset,
    };

    const hitPos = getHitPos(curPos);
    if (hitPos === 0) {
      console.log('offset + prefix');
      resPos = {
        block: curPos.block,
        fenceOffset: posFenceOffset + prefix,
      };
    } else if (hitPos === 1) {
      console.log('offset + prefix + suffix');
      resPos = {
        block: curPos.block,
        fenceOffset: posFenceOffset + prefix + suffix,
      };
    } else {
      resPos = {
        block: curPos.block,
        fenceOffset: posFenceOffset,
      };
    }

    console.log('patch cur line');
    posBlock.patch(newRoot);
  }

  return {
    pos: resPos,
    active: resActive,
  };
};

export const trySwitchActiveSyntaxNode = (
  prevPos: Pos | null,
  curPos: Pos,
  active: ActivePos | null,
  isCrossLine: boolean
) => {
  const { pos, active: curActive } = tryCancelActiveSyntaxNode(
    prevPos,
    curPos,
    active,
    isCrossLine
  );

  return tryActiveSyntaxNode(pos, curActive);
};

const getCorrectPos = (block: Block, fenceOffset: number) => {
  const fence = block.fence;
  for (let i = 0; i < fence.length; i++) {
    const { fenceList, vNode, rect } = fence[i];
    const len = fenceList.length;
    if (fenceOffset >= len) {
      fenceOffset -= len;
    } else {
      return {
        vNode,
        rect,
        ancestorOffset: i,
        cursorInfo: fenceList[fenceOffset],
        fenceList,
      };
    }
  }
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

    children.forEach(child => recur(child));
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
