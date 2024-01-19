import { isEmptyNode, isSameNode, isTextNode } from 'lib/model';
import { State, SyntaxNode, VirtualNode } from 'lib/types';
import { min, panicAt } from 'lib/utils';
import { getFenceInfo } from './getFenceInfo';
import { initPatchBuffer } from './patchBuffer';

export const updateContent = (
  prevState: State,
  offset: number,
  newVNode: SyntaxNode
): State => {
  const { addTarget, flushBuffer } = initPatchBuffer();
  const { block, cursor } = prevState;
  const oldVNode = block.vNode as SyntaxNode;

  if (newVNode.children.length) {
    let finalOffset = offset;
    const maxUnchangeLength = findSamePart(oldVNode, newVNode);

    // Flag of the node which gona to be actived
    let ancestorIdxToBeActived = maxUnchangeLength + 1;
    // TODO ?
    if (oldVNode.children.length === 0) {
      ancestorIdxToBeActived = maxUnchangeLength;
    }

    // `**hello*` -> `**hello**`
    else if (oldVNode.children.length === newVNode.children.length) {
      ancestorIdxToBeActived = maxUnchangeLength;
    }

    // `#hello` -> `# hello`
    else if (oldVNode.children.length === newVNode.children.length - 1) {
      ancestorIdxToBeActived = maxUnchangeLength;
    }

    const { fenceInfoList } = getFenceInfo({
      block,
      offset: prevState.offset,
    });
    const prevFenceInfo = fenceInfoList.find(
      ({ ancestorIdx }) => ancestorIdx !== ancestorIdxToBeActived
    );
    if (prevFenceInfo) {
      finalOffset -= prevFenceInfo.prefixChange;
    }

    addTarget(block, ancestorIdxToBeActived);
    flushBuffer(true, newVNode);

    const { textOffset } = getFenceInfo({ block, offset: finalOffset });

    return {
      block,
      vNode: block.vNode,
      fence: block.fence,

      cursor,
      offset: finalOffset,
      textOffset,
      actived: [ancestorIdxToBeActived],
    };
  } else {
    block.patch(newVNode);
    return {
      block,
      vNode: block.vNode,
      fence: block.fence,

      cursor,
      offset,
      textOffset: 0,
      actived: [],
    };
  }
};

const findSamePart = (node1: VirtualNode, node2: VirtualNode): number => {
  if (isTextNode(node1) || isTextNode(node2)) {
    return panicAt('');
  }

  if (isEmptyNode(node1)) {
    return 0;
  }

  const { children: children1 } = node1;
  const { children: children2 } = node2;

  for (let i = 0; i < min(children1.length, children2.length); i++) {
    const n1 = children1[i];
    const n2 = children2[i];
    if (!isSameNode(n1, n2)) {
      return i;
    }
  }

  return panicAt('try to diff two identical nodes');
};
