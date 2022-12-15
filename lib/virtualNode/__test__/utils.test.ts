import { VirtualNode, VirtualNodeChildren } from '../../types';
import { textContent, trackNode } from '../utils';

const vn = (children: VirtualNodeChildren = []) => {
  return {
    tagName: 'div',
    props: {},
    children,
    events: [],
    el: null,
  };
};
const getVNode = (): Array<VirtualNode> => {
  const plainText = {
    tagName: 'span',
    props: {},
    children: 'this is a ',
    events: [],
    el: null,
  };
  const strong = {
    tagName: 'strong',
    props: {},
    children: 'Hello ',
    events: [],
    el: null,
  };
  const em = {
    tagName: 'em',
    props: {},
    children: 'World',
    events: [],
    el: null,
  };

  return [
    {
      tagName: 'div',
      props: {},
      children: [plainText, strong, em],
      events: [],
      el: null,
    },
    plainText,
    strong,
    em,
  ];
};

describe('utils', () => {
  describe('textContent', () => {
    test('smoke', () => {
      const [root, pt, st, em] = getVNode();
      expect(textContent(pt)).toBe('this is a ');
      expect(textContent(st)).toBe('Hello ');
      expect(textContent(em)).toBe('World');
      expect(textContent(root)).toBe('this is a Hello World');
    });
  });

  describe('trackNode', () => {
    test('smoke', () => {
      const [root, child1, child2, child3] = getVNode();
      expect(trackNode(root, child1)).toStrictEqual([0]);
      expect(trackNode(root, child2)).toStrictEqual([1]);
      expect(trackNode(root, child3)).toStrictEqual([2]);
    });

    test('nested structure', () => {
      const [root, child1, child2, child3] = getVNode();
      const nestedVNode = vn([vn([vn(), vn([vn(), vn(), root])])]);
      expect(trackNode(nestedVNode, root)).toStrictEqual([0, 1, 2]);
      expect(trackNode(nestedVNode, child1)).toStrictEqual([0, 1, 2, 0]);
      expect(trackNode(nestedVNode, child2)).toStrictEqual([0, 1, 2, 1]);
      expect(trackNode(nestedVNode, child3)).toStrictEqual([0, 1, 2, 2]);
    });
  });
});
