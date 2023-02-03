import { isTextNode, walkTextNodeWithMoreInformation } from 'lib/model';
import {
  ClientRect,
  Fence,
  FenceRoot,
  Rect,
  VirtualNode,
  VirtualNodeBehavior,
} from 'lib/types';
import { panicAt } from 'lib/utils';

export const calcFence = (
  vNode: VirtualNode,
  rectList: Array<ClientRect>
): Fence => {
  if (isTextNode(vNode)) {
    return panicAt('try to calculate the fence of a text node');
  }

  const fence: Fence = [];

  let fenceList: FenceRoot['fenceList'] = [];
  let prevPrefixChange = 0;
  let curTotalTextLength = 0;
  let curTotalChange = 0;
  let prefixChange = 0;
  let prefixLength = 0;
  let textLength = 0;
  let curAncestor: VirtualNode | null = null;
  let prevAncestor: VirtualNode | null = null;

  walkTextNodeWithMoreInformation(
    vNode,
    (textNode, parent, ancestor, i, contentFlag) => {
      const { isActive } = parent;
      const { behavior, text } = textNode;

      // content -> children
      if (contentFlag === 0) {
        if (prevAncestor) {
          fence.push({
            totalLength: curTotalTextLength,
            totalChange: curTotalChange,
            fenceList: [...fenceList],
            prefixLength,
          });

          curTotalTextLength = 0;
          curTotalChange = 0;
          fenceList = [];
        }

        if (!isHidden(behavior)) {
          prevPrefixChange = prefixChange;
          prefixChange = 0;

          Array.from(text).forEach((_, j) => {
            const rect = rectList[prefixLength];
            const textOffset = textLength;
            let curPrefixChange = 0;

            if (j === 0) {
              if (textNode === ancestor) {
                curPrefixChange = prevPrefixChange;
              } else if (i === 0) {
                curPrefixChange = prefixChange;
              } else {
                curPrefixChange = 0;
              }
            } else {
              curPrefixChange = prefixChange;
            }

            fenceList.push({
              rect,
              prefixChange: curPrefixChange,
              textOffset,
            });

            textLength++;
            prefixLength++;
          });
        } else {
          if (!isActive) {
            prevPrefixChange = prefixChange;
            prefixChange = text.length;

            textLength += text.length;
          } else {
            prevPrefixChange = prefixChange;
            prefixChange = 0;
            Array.from(text).forEach((_, j) => {
              const rect = rectList[prefixLength];
              const textOffset = textLength;
              let curPrefixChange = 0;

              if (j === 0) {
                if (textNode === ancestor) {
                  curPrefixChange = prevPrefixChange;
                } else {
                  curPrefixChange = prefixChange;
                }
              } else {
                curPrefixChange = prefixChange;
              }

              fenceList.push({
                rect,
                textOffset,
                prefixChange: curPrefixChange,
              });

              textLength++;
              prefixLength++;
              prefixChange++;
            });
          }
        }
      }

      // ancestor1 -> ancestor2
      else if (curAncestor !== ancestor) {
        prevAncestor = curAncestor;
        curAncestor = ancestor;

        if (prevAncestor) {
          fence.push({
            totalLength: curTotalTextLength,
            totalChange: curTotalChange,
            fenceList: [...fenceList],
            prefixLength,
          });

          curTotalTextLength = 0;
          curTotalChange = 0;
          fenceList = [];
        }

        if (!isHidden(behavior)) {
          Array.from(text).forEach((_, j) => {
            const rect = rectList[prefixLength];
            const textOffset = textLength;
            let curPrefixChange = 0;

            if (j === 0) {
              if (textNode === ancestor) {
                curPrefixChange = prefixChange;
                prefixChange = 0;
              } else if (i === 0) {
                curPrefixChange = prefixChange;
              } else {
                curPrefixChange = 0;
              }
            } else {
              curPrefixChange = prefixChange;
            }

            fenceList.push({
              rect,
              textOffset,
              prefixChange: curPrefixChange,
            });

            textLength++;
            prefixLength++;
          });
        } else {
          if (!isActive) {
            prevPrefixChange = prefixChange;
            prefixChange = text.length;
            curTotalChange += text.length;
            textLength += text.length;
          } else {
            Array.from(text).forEach((_, j) => {
              const rect = rectList[prefixLength];
              const textOffset = textLength;
              let curPrefixChange = 0;

              if (j === 0) {
                if (textNode === ancestor) {
                  curPrefixChange = prefixChange;
                } else {
                  curPrefixChange = prefixChange;
                }
                prefixChange = 0;
              } else {
                curPrefixChange = prefixChange;
              }

              fenceList.push({
                rect,
                textOffset,
                prefixChange: curPrefixChange,
              });

              curTotalChange++;
              textLength++;
              prefixChange++;
            });

            prevPrefixChange = prefixChange;
          }
        }
      }

      // ancestor1 -> ancestor1
      else if (curAncestor === ancestor) {
        if (!isHidden(behavior)) {
          Array.from(text).forEach((_, j) => {
            const rect = rectList[prefixLength];
            const textOffset = textLength;
            let curPrefixChange = 0;

            if (j === 0) {
              if (i === 0) {
                curPrefixChange = prefixChange;
              } else {
                curPrefixChange = prevPrefixChange;
              }
            } else {
              curPrefixChange = prefixChange;
            }

            fenceList.push({
              rect,
              textOffset,
              prefixChange: curPrefixChange,
            });

            textLength++;
            prefixLength++;
          });
        } else {
          if (!isActive) {
            prevPrefixChange = prefixChange;
            prefixChange += text.length;
            curTotalChange += text.length;
            textLength += text.length;
          } else {
            Array.from(text).forEach((_, j) => {
              const rect = rectList[prefixLength];
              const textOffset = textLength;
              let curPrefixChange = 0;

              if (j === 0) {
                curPrefixChange = prevPrefixChange;
              } else {
                curPrefixChange = prefixChange;
              }

              fenceList.push({
                rect,
                textOffset,
                prefixChange: curPrefixChange,
              });

              curTotalChange++;
              textLength++;
              prefixChange++;
            });
            prevPrefixChange = prefixChange;
          }
        }
      }

      curTotalTextLength += text.length;
    }
  );

  fence.push({
    totalLength: curTotalTextLength,
    totalChange: curTotalChange,
    fenceList: [
      ...fenceList,
      {
        rect: rectList[prefixLength],
        textOffset: textLength,
        prefixChange,
      },
    ],
    prefixLength,
  });

  return fence;
};

const isHidden = (behavior?: VirtualNodeBehavior) => {
  return behavior?.beforeActived?.show === false;
};
