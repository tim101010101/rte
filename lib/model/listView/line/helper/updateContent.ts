import { isEmptyNode, isTextNode, textContent } from 'lib/model';
import { Snapshot, SyntaxNode, VirtualNode } from 'lib/types';
import { min, panicAt } from 'lib/utils';
import { getFenceInfo } from './getFenceInfo';
import { initPatchBuffer } from './patchBuffer';

export const updateContent = (
  prevState: Snapshot,
  offset: number,
  newVNode: SyntaxNode
): Snapshot => {
  const { addTarget, flushBuffer } = initPatchBuffer();
  const { block, cursor } = prevState;
  const oldVNode = block.vNode as SyntaxNode;

  if (newVNode.children.length) {
    let finalOffset = offset;
    const maxUnchangeLength = diffNode(oldVNode, newVNode);
    const ancestorIdxToBeActived =
      oldVNode.children.length === 0 ||
      oldVNode.children.length === newVNode.children.length
        ? maxUnchangeLength
        : maxUnchangeLength + 1;

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

const diffAncestor = (
  oldVNode: VirtualNode,
  newVNode: VirtualNode
): boolean => {
  if (isTextNode(oldVNode) !== isTextNode(newVNode)) {
    return false;
  }

  if (isTextNode(oldVNode) && isTextNode(newVNode)) {
    return oldVNode.text === newVNode.text;
  } else {
    return (
      (oldVNode as SyntaxNode).isActive === (newVNode as SyntaxNode).isActive &&
      textContent(oldVNode) === textContent(newVNode)
    );
  }
};

const diffNode = (oldVNode: VirtualNode, newVNode: VirtualNode): number => {
  if (isTextNode(oldVNode) || isTextNode(newVNode)) {
    return panicAt('');
  }

  if (isEmptyNode(oldVNode)) {
    return 0;
  }

  const { children: oldChildren } = oldVNode;
  const { children: newChildren } = newVNode;

  for (let i = 0; i < min(oldChildren.length, newChildren.length); i++) {
    const c1 = oldChildren[i];
    const c2 = newChildren[i];
    if (!diffAncestor(c1, c2)) {
      return i;
    }
  }

  return panicAt('try to diff two identical nodes');
};
