import { deepCloneVNode, getAncestorByIdx, isTextNode } from 'lib/model';
import { ActivePos, FeedbackPos, Operable, Pos, VirtualNode } from 'lib/types';

const initPatchBuffer = () => {
  const buffer = new Map<Operable, Array<number>>();

  const addTarget = (block: Operable, target: number) => {
    if (buffer.has(block)) {
      buffer.set(block, [...buffer.get(block)!, target]);
    } else {
      buffer.set(block, [target]);
    }
  };

  const flushBuffer = (active: boolean) => {
    Array.from(buffer.entries()).forEach(([block, activeTargets]) => {
      block.patch(
        deepCloneVNode(block.vNode, (cur, i) => {
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

export const tryActiveAndCancelActive = (
  prevPos: Pos | null,
  curPos: Pos | null,
  prevActive: Array<ActivePos>
): FeedbackPos => {
  const { addTarget, flushBuffer } = initPatchBuffer();

  if (curPos) {
    const { block: curBlock, offset: curOffset } = curPos;
    let finalOffset = curOffset;
    const { vNodes: curActive } = curBlock.getFenceInfo(curOffset);

    const curActiveVNode = curActive.map(ancestorIdx =>
      getAncestorByIdx(curBlock.vNode, ancestorIdx)
    );
    const prevActiveVNode = prevActive.map(({ block, ancestorIdx }) =>
      getAncestorByIdx(block.vNode, ancestorIdx)
    );

    if (prevPos) {
      const { block: prevBlock, offset: prevOffset } = prevPos;

      // TODO bad design, to be refactored
      let needToFixOffset = false;

      // cross line, dump curActive
      if (prevBlock !== curBlock) {
        prevActive.forEach(({ block, ancestorIdx }) => {
          addTarget(block, ancestorIdx);
          needToFixOffset = true;
        });
      }

      // same line, deactive which not exist in curActive
      else {
        prevActive.forEach(({ block, ancestorIdx }, i) => {
          if (
            !curActiveVNode.includes(getAncestorByIdx(block.vNode, ancestorIdx))
          ) {
            addTarget(block, ancestorIdx);
            needToFixOffset = true;
          }
        });
      }

      flushBuffer(false);

      // fix the offset only when the cursor moves to the right and needs to be deactivated
      if (needToFixOffset && curOffset > prevOffset) {
        const { prefixChange } = prevBlock.getFenceInfo(prevOffset);
        finalOffset -= prefixChange;
      }
    }

    // active
    curActiveVNode.forEach((vNodeToBeActive, i) => {
      if (!prevActiveVNode.includes(vNodeToBeActive)) {
        addTarget(curBlock, curActive[i]);
        const { prefixChange } = curBlock.getFenceInfo(curOffset);
        //! ERROR prefixChange === 1
        finalOffset += prefixChange;
      }
    });
    flushBuffer(true);

    return {
      pos: { block: curBlock, offset: finalOffset },
      active: curActive.map(ancestorIdx => ({
        block: curBlock,
        ancestorIdx,
      })),
    };
  } else {
    prevActive.forEach(({ block, ancestorIdx }) => {
      addTarget(block, ancestorIdx);
    });
    flushBuffer(false);

    return {
      pos: null,
      active: [],
    };
  }
};
