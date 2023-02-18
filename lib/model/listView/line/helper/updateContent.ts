import { isTextNode, textContent } from 'lib/model';
import { Snapshot, SyntaxNode, VirtualNode } from 'lib/types';
import { min, panicAt } from 'lib/utils';
import { initPatchBuffer } from './patchBuffer';

export const updateContent = (
  { block, cursor }: Snapshot,
  offset: number,
  newVNode: VirtualNode
): Snapshot => {
  const { addTarget, flushBuffer } = initPatchBuffer();
  const oldVNode = block.vNode;

  const maxUnchangeLength = diffNode(oldVNode, newVNode);
  const ancestorIdxToBeActived =
    (oldVNode as SyntaxNode).children.length ===
    (newVNode as SyntaxNode).children.length
      ? maxUnchangeLength
      : maxUnchangeLength + 1;

  addTarget(block, ancestorIdxToBeActived);
  flushBuffer(true, newVNode);

  return {
    block,
    vNode: newVNode,
    fence: block.fence,

    cursor,
    offset,
    actived: [ancestorIdxToBeActived],
  };
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
