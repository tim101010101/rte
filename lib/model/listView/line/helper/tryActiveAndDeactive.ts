import { ActivePos, FenceInfoItem, Pos, Snapshot } from 'lib/types';
import { getFenceInfo } from './getFenceInfo';
import { initPatchBuffer } from './patchBuffer';

export function tryActiveAndDeactive(
  curPos: Pos,
  prevState: Snapshot | null
): Snapshot;
export function tryActiveAndDeactive(
  curPos: null,
  prevState: Snapshot | null
): void;
export function tryActiveAndDeactive(
  curPos: Pos | null,
  prevState: Snapshot | null
): Snapshot | void {
  const { addTarget, flushBuffer } = initPatchBuffer();

  if (curPos) {
    const { finalOffset, toBeDeactived, toBeActived, finalActive } = diffFence(
      curPos,
      prevState
    );

    toBeDeactived.forEach(({ block, ancestorIdx }) => {
      addTarget(block, ancestorIdx);
    });
    flushBuffer(false);

    toBeActived.forEach(({ block, ancestorIdx }) => {
      addTarget(block, ancestorIdx);
    });
    flushBuffer(true);

    const { block } = curPos;
    const { rect } = getFenceInfo({ block, offset: finalOffset });

    return {
      block,
      vNode: block.vNode,
      fence: block.fence,

      cursor: { ...prevState?.cursor, rect },
      offset: finalOffset,
      actived: finalActive,
    };
  } else if (prevState) {
    snapshotToActived(prevState).forEach(({ block, ancestorIdx }) => {
      addTarget(block, ancestorIdx);
    });
    flushBuffer(false);
  }
}

const snapshotToActived = ({ block, actived }: Snapshot): Array<ActivePos> => {
  return actived.map(ancestorIdx => ({ block, ancestorIdx }));
};

const diffFence = (
  curPos: Pos,
  prevState: Snapshot | null
): {
  finalOffset: number;
  toBeDeactived: Array<ActivePos>;
  toBeActived: Array<ActivePos>;
  finalActive: Array<number>;
} => {
  const finalActive: Array<number> = [];
  const toBeDeactived: Array<ActivePos> = [];
  const toBeActived: Array<ActivePos> = [];

  const { block: curBlock, offset: curOffset } = curPos;
  const { fenceInfoList: curFenceInfo } = getFenceInfo(curPos, prevState);

  let finalOffset = curOffset;

  if (prevState) {
    const { block: prevBlock, offset: prevOffset } = prevState;
    const { fenceInfoList: prevFenceInfo } = getFenceInfo(prevState);

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

  const actived = prevState ? snapshotToActived(prevState) : null;
  curFenceInfo.forEach(({ ancestorIdx: curIdx, prefixChange }) => {
    const finder = ({
      ancestorIdx: activedIdx,
      block: activedBlock,
    }: ActivePos) => {
      return curIdx === activedIdx && curBlock === activedBlock;
    };

    if (!actived || !actived.find(finder)) {
      toBeActived.push({ block: curBlock, ancestorIdx: curIdx });
      finalOffset += prefixChange;
    }

    finalActive.push(curIdx);
  });

  return {
    finalOffset,
    toBeDeactived,
    toBeActived,
    finalActive,
  };
};
