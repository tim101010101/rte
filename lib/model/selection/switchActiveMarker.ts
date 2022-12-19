import { SetterFunction, SyntaxNode, TextNode, VirtualNode } from 'lib/types';
import { NodeType, TagName } from 'lib/static';
import {
  Block,
  deepCloneWithTrackNode,
  getParent,
  isActive,
  isMarkerTextNode,
  isPureTextNode,
  isTextNode,
  textContent,
} from 'lib/model';
import { get, has } from 'lib/utils';

const { SPAN } = TagName;
const { PLAIN_TEXT, PREFIX, SUFFIX, BOLD } = NodeType;

const marker = (
  text: string,
  isPrefix: boolean,
  path: Array<number>
): SyntaxNode => {
  return {
    type: isPrefix ? PREFIX : SUFFIX,
    isActive: false,
    tagName: SPAN,
    props: {},
    el: null,
    meta: {},
    events: [],

    children: [
      {
        type: PLAIN_TEXT | (isPrefix ? PREFIX : SUFFIX),
        tagName: SPAN,
        props: {},
        el: null,
        meta: { path },
        font: '',
        isActive: false,
        text,
      },
    ],
  };
};

export const tryActiveNode = (
  activeBlock: Block,
  target: VirtualNode,
  textOffset: number
): SetterFunction<number> | null => {
  const textLength = textContent(target).length;

  // active target
  if (
    !isActive(target) &&
    !isPureTextNode(target) &&
    !isMarkerTextNode(target) &&
    (textOffset === 0 || textOffset === textLength)
  ) {
    const newVNode = switchActiveNode(activeBlock.vNode!, target);
    activeBlock.patch(newVNode);
    return v => v + 2;
  }

  // cancel active
  else if (
    isMarkerTextNode(target) &&
    (textOffset === 0 || textOffset === textLength)
  ) {
    const newVNode = switchActiveNode(activeBlock.vNode!, target);
    activeBlock.patch(newVNode);
    console.log(target);

    if (target.type & NodeType.PREFIX) {
      console.log('prefix');
      return v => v;
    } else if (target.type & NodeType.SUFFIX) {
      console.log('suffix');
      return v => v - 4;
    }

    return v => v;
  }

  // cancel active
  else if (
    isActive(target) &&
    !isPureTextNode(target) &&
    !isMarkerTextNode(target) &&
    (textOffset === 1 || textOffset === textLength - 1)
  ) {
    const newVNode = switchActiveNode(activeBlock.vNode!, target);
    activeBlock.patch(newVNode);
    return v => v - 2;
  }

  return null;
};

const switchActiveNode = (root: VirtualNode, target: VirtualNode) => {
  // TODO focus on the marker node

  if (isMarkerTextNode(target) && has(target.meta, 'path')) {
    const [newRoot, _] = deepCloneWithTrackNode(root, target);
    const path = get(target.meta, 'path');

    return (
      path.length === 1 ? newRoot : switchActiveByPath(newRoot, path)
    ) as SyntaxNode;
  }

  const [newRoot, path] = deepCloneWithTrackNode(root, target);
  return (
    path.length === 1 ? newRoot : switchActiveByPath(newRoot, path)
  ) as SyntaxNode;
};

const switchActiveByPath = (root: VirtualNode, path: Array<number>) => {
  if (isTextNode(root)) return root;

  let cur = root;
  let clonePath = [...path];
  while (clonePath.length !== 1) {
    cur = cur.children[clonePath.pop()!] as SyntaxNode;
  }

  const { isActive } = cur;
  if (isActive) {
    cur.isActive = false;
    cur.children[clonePath.pop()!].isActive = false;
    cur.children.pop();
    cur.children.shift();
  } else {
    cur.isActive = true;
    cur.children[clonePath.pop()!].isActive = true;
    const prefix = marker(cur.type & BOLD ? '**' : '*', true, [...path]);
    const suffix = marker(cur.type & BOLD ? '**' : '*', false, [...path]);
    cur.children.unshift(prefix);
    cur.children.push(suffix);
  }

  return root;
};
