import { isTextNode, textContent } from 'lib/model/virtualNode';
import { ActivePos, Operable, Pos, SyntaxNode, VirtualNode } from 'lib/types';
import { min, panicAt } from 'lib/utils';
import { initPatchBuffer } from './patchBuffer';

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

  return panicAt('');
};

export const updateContent = (
  { block, offset }: Pos,
  newVNode: VirtualNode
): { active: Array<ActivePos>; offset: number } => {
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
    active: [{ block, ancestorIdx: ancestorIdxToBeActived }],
    offset,
  };
};

export const updateContent1 = (
  { block, offset }: Pos,
  newVNode: VirtualNode
): { active: Array<ActivePos>; offset: number } => {
  const { addTarget, flushBuffer } = initPatchBuffer();
  const oldVNode = block.vNode;

  let finalOffset = offset + 1;
  let finalAncestor = null;

  // 2. 激活指定 ancestor
  const a = diffNode(oldVNode, newVNode);
  if (
    (oldVNode as SyntaxNode).children.length ===
    (newVNode as SyntaxNode).children.length
  ) {
    finalAncestor = a;
  } else {
    finalAncestor = a + 1;
  }

  if (finalAncestor) {
    addTarget(block, finalAncestor);
    flushBuffer(true, newVNode);
  } else {
    // 3. patch newVNode
    block.patch(newVNode);
  }

  // 4. 将光标重新插入到正确的位置

  return {
    active: [{ block, ancestorIdx: finalAncestor }],
    offset: finalOffset,
  };
};
