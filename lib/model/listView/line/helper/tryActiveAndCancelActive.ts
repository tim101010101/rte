import { deepCloneVNode, isTextNode } from 'lib/model';
import {
  ActivePos,
  FeedbackPos,
  FenceInfoItem,
  Operable,
  Pos,
} from 'lib/types';

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

const diffFence = (
  prevPos: Pos | null,
  { block: curBlock, offset: curOffset }: Pos,
  actived: Array<ActivePos>
): {
  finalOffset: number;
  toBeDeactived: Array<ActivePos>;
  toBeActived: Array<ActivePos>;
  finalActive: Array<ActivePos>;
} => {
  const finalActive: Array<ActivePos> = [];
  const toBeDeactived: Array<ActivePos> = [];
  const toBeActived: Array<ActivePos> = [];
  let finalOffset = curOffset;

  const { fenceInfoList: curFenceInfo } = curBlock.getFenceInfo(curOffset);

  if (prevPos) {
    const { block: prevBlock, offset: prevOffset } = prevPos;
    const { fenceInfoList: prevFenceInfo } = prevBlock.getFenceInfo(prevOffset);

    prevFenceInfo.forEach(({ ancestorIdx: prevIdx, prefixChange }) => {
      const finder = ({ ancestorIdx: curIdx }: FenceInfoItem) => {
        return curBlock === prevBlock && prevIdx === curIdx;
      };

      if (!curFenceInfo.find(finder)) {
        toBeDeactived.push({ block: prevBlock, ancestorIdx: prevIdx });
        if (curBlock === prevBlock && curOffset >= prevOffset) {
          finalOffset -= prefixChange;
        }
      } else {
        finalActive.push({ block: prevBlock, ancestorIdx: prevIdx });
      }
    });
  }

  curFenceInfo.forEach(({ ancestorIdx: curIdx, prefixChange }) => {
    const finder = ({
      block: activedBlock,
      ancestorIdx: activedIdx,
    }: ActivePos) => {
      return curIdx === activedIdx && curBlock === activedBlock;
    };

    if (!actived.find(finder)) {
      toBeActived.push({ block: curBlock, ancestorIdx: curIdx });
      finalActive.push({ block: curBlock, ancestorIdx: curIdx });
      finalOffset += prefixChange;
    }
  });

  return {
    finalOffset,
    toBeDeactived,
    toBeActived,
    finalActive,
  };
};

export const tryActiveAndCancelActive = (
  prevPos: Pos | null,
  curPos: Pos | null,
  prevActive: Array<ActivePos>
): FeedbackPos => {
  const { addTarget, flushBuffer } = initPatchBuffer();

  if (curPos) {
    const { finalOffset, toBeDeactived, toBeActived, finalActive } = diffFence(
      prevPos,
      curPos,
      prevActive
    );

    toBeDeactived.forEach(({ block, ancestorIdx }) => {
      addTarget(block, ancestorIdx);
    });
    flushBuffer(false);

    toBeActived.forEach(({ block, ancestorIdx }) => {
      addTarget(block, ancestorIdx);
    });
    flushBuffer(true);

    return {
      pos: { block: curPos.block, offset: finalOffset },
      active: finalActive,
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
