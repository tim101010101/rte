import { ActivePos, FeedbackPos, FenceInfoItem, Pos } from 'lib/types';
import { getFenceInfo } from './getFenceInfo';
import { initPatchBuffer } from './patchBuffer';

const diffFence = (
  prevPos: Pos | null,
  curPos: Pos,
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

  const { block: curBlock, offset: curOffset } = curPos;
  const { fenceInfoList: curFenceInfo } = getFenceInfo(curPos, prevPos);

  let finalOffset = curOffset;

  if (prevPos) {
    const { block: prevBlock, offset: prevOffset } = prevPos;
    const { fenceInfoList: prevFenceInfo } = getFenceInfo(prevPos, null);

    prevFenceInfo.forEach(({ ancestorIdx: prevIdx, prefixChange }) => {
      const finder = ({ ancestorIdx: curIdx }: FenceInfoItem) => {
        return curBlock === prevBlock && prevIdx === curIdx;
      };

      if (!curFenceInfo.find(finder)) {
        toBeDeactived.push({ block: prevBlock, ancestorIdx: prevIdx });
        if (curBlock === prevBlock && curOffset >= prevOffset) {
          finalOffset -= prefixChange;
        }
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
      finalOffset += prefixChange;
    }

    finalActive.push({ block: curBlock, ancestorIdx: curIdx });
  });

  return {
    finalOffset,
    toBeDeactived,
    toBeActived,
    finalActive,
  };
};

export const tryActiveAndDeactive = (
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

    const finalPos = { block: curPos.block, offset: finalOffset };
    const { rect } = getFenceInfo(finalPos, null);

    return {
      rect,
      pos: finalPos,
      active: finalActive,
    };
  } else {
    prevActive.forEach(({ block, ancestorIdx }) => {
      addTarget(block, ancestorIdx);
    });
    flushBuffer(false);

    return {
      rect: null,
      pos: null,
      active: [],
    };
  }
};
