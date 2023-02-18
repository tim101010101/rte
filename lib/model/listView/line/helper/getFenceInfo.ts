import { isEmptyNode } from 'lib/model';
import { Fence, FenceInfo, Pos, Snapshot, SyntaxNode } from 'lib/types';
import { lastItem, panicAt, applyStrategy, Strategy } from 'lib/utils';

export const getFenceLength = (fence: Fence): number => {
  if (fence.length) {
    const { prefixLength, fenceList } = lastItem(fence);
    return prefixLength + fenceList.length - fence.length;
  } else {
    return 0;
  }
};

export const getFenceInterval = (
  fence: Fence,
  ancestorIdx: number
): [number, number] => {
  const { prefixLength, fenceList } = fence[ancestorIdx];
  const start = prefixLength - ancestorIdx;
  const end = start + fenceList.length - 1;
  return [start, end];
};

export const getFenceInfo = (
  curPos: Pos,
  prevState?: Snapshot | null
): FenceInfo => {
  const { block } = curPos;
  if (isEmptyNode(block.vNode)) {
    return {
      rect: block.rect,
      textOffset: 0,
      fenceInfoList: [
        {
          ancestorIdx: 0,
          totalChange: 0,
          totalLength: 0,
          prefixChange: 0,
        },
      ],
    };
  }

  const [ancestorIdx, specificIdx] = findFenceTarget(
    curPos.block.fence,
    curPos.offset
  );

  return applyStrategy(
    dispatchStrategies(curPos, ancestorIdx, specificIdx, prevState)
  );
};

const findFenceTarget = (fence: Fence, offset: number): [number, number] => {
  let left = 0;
  let right = fence.length - 1;

  while (left <= right) {
    const mid = ~~((left + right) / 2);
    const cur = fence[mid];
    const start = cur.prefixLength - mid;
    const end = start + cur.fenceList.length - 1;

    if (offset > end) {
      left = mid + 1;
    } else if (offset < start) {
      right = mid - 1;
    } else {
      let ancestorIdx = mid;
      let idx = offset - start;
      while (
        idx === 0 &&
        ancestorIdx - 1 >= 0 &&
        fence[ancestorIdx - 1].fenceList.length === 1
      ) {
        ancestorIdx--;
      }
      return [ancestorIdx, idx];
    }
  }

  return panicAt('offset out of bound');
};

const dispatchStrategies = (
  curPos: Pos,
  ancestorIdx: number,
  specificIdx: number,
  prevState?: Snapshot | null
): Array<Strategy<FenceInfo>> => {
  const { block: curBlock, offset: curOffset } = curPos;
  const { fence } = curBlock;

  const hitEmptyHead = {
    condition: () =>
      ancestorIdx === 0 &&
      specificIdx === 0 &&
      fence[ancestorIdx].fenceList.length === 1,
    callback: () => {
      const { totalChange, totalLength, fenceList } = fence[ancestorIdx];
      const { rect, textOffset } = fenceList[0];
      return {
        rect,
        textOffset,
        fenceInfoList: [
          { ancestorIdx, totalChange, totalLength, prefixChange: 0 },
        ],
      };
    },
  };
  const hitOverlapHead = {
    condition: () => ancestorIdx !== 0 && specificIdx === 0,
    callback: () => {
      const prev = fence[ancestorIdx - 1];
      const cur = fence[ancestorIdx];
      const { rect, textOffset } = cur.fenceList[specificIdx];

      return {
        rect,
        textOffset,
        fenceInfoList: [
          {
            ancestorIdx: ancestorIdx - 1,
            totalLength: prev.totalLength,
            totalChange: prev.totalChange,
            prefixChange: lastItem(prev.fenceList).prefixChange,
          },
          {
            ancestorIdx,
            totalLength: cur.totalLength,
            totalChange: cur.totalChange,
            prefixChange: cur.fenceList[0].prefixChange,
          },
        ],
      };
    },
  };
  const hitOverlapTail = {
    condition: () =>
      ancestorIdx !== fence.length - 1 &&
      specificIdx === fence[ancestorIdx].fenceList.length - 1,
    callback: () => {
      const cur = fence[ancestorIdx];
      const next = fence[ancestorIdx + 1];
      const { rect, textOffset } = cur.fenceList[specificIdx];

      return {
        rect,
        textOffset,
        fenceInfoList: [
          {
            ancestorIdx,
            totalLength: cur.totalLength,
            totalChange: cur.totalChange,
            prefixChange: cur.fenceList[specificIdx].prefixChange,
          },
          {
            ancestorIdx: ancestorIdx + 1,
            totalLength: next.totalLength,
            totalChange: next.totalChange,
            prefixChange: next.fenceList[0].prefixChange,
          },
        ],
      };
    },
  };
  const hitBody = {
    condition: () => true,
    callback: () => {
      const cur = fence[ancestorIdx];
      const { totalLength, totalChange, fenceList } = cur;
      const { rect, textOffset, prefixChange } = fenceList[specificIdx];

      return {
        rect,
        textOffset,
        fenceInfoList: [
          { ancestorIdx, totalLength, totalChange, prefixChange },
        ],
      };
    },
  };

  if (!prevState || (prevState && prevState.block !== curBlock)) {
    return [hitEmptyHead, hitOverlapHead, hitOverlapTail, hitBody];
  } else {
    const { block: prevBlock, offset: prevOffset } = prevState;
    const step = curOffset - prevOffset;
    const [prevStart, prevEnd] = getFenceInterval(
      prevBlock.fence,
      findFenceTarget(prevBlock.fence, prevOffset)[0]
    );

    const moveRightToEmpty = {
      condition: () =>
        ancestorIdx !== 0 &&
        step === 1 &&
        prevOffset === prevEnd &&
        fence[ancestorIdx].fenceList.length === 1,
      callback: () => {
        const prev = fence[ancestorIdx - 1];
        const cur = fence[ancestorIdx];
        const { rect, textOffset, prefixChange } = cur.fenceList[0];

        return {
          rect,
          textOffset,
          fenceInfoList: [
            {
              ancestorIdx: ancestorIdx - 1,
              totalLength: prev.totalLength,
              totalChange: prev.totalChange,
              prefixChange: lastItem(prev.fenceList).prefixChange,
            },
            {
              ancestorIdx,
              totalLength: cur.totalLength,
              totalChange: cur.totalChange,
              prefixChange,
            },
          ],
        };
      },
    };
    const moveLeftToEmpty = {
      condition: () =>
        ancestorIdx !== fence.length - 1 &&
        step === -1 &&
        prevOffset === prevStart &&
        fence[ancestorIdx].fenceList.length === 1,
      callback: () => {
        const cur = fence[ancestorIdx];
        const next = fence[ancestorIdx + 1];
        const { rect, textOffset, prefixChange } = cur.fenceList[0];

        return {
          rect,
          textOffset,
          fenceInfoList: [
            {
              ancestorIdx,
              totalLength: cur.totalLength,
              totalChange: cur.totalChange,
              prefixChange,
            },
            {
              ancestorIdx: ancestorIdx + 1,
              totalLength: next.totalLength,
              totalChange: next.totalChange,
              prefixChange: next.fenceList[0].prefixChange,
            },
          ],
        };
      },
    };

    return [
      moveRightToEmpty,
      moveLeftToEmpty,
      hitOverlapHead,
      hitOverlapTail,
      hitBody,
    ];
  }
};
