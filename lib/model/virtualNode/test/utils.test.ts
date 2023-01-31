import { NodeType } from 'lib/static';
import {
  SyntaxNode,
  SyntaxNodeWithLayerActivation,
  TextNode,
  VirtualNode,
} from 'lib/types';
import { get } from 'lib/utils';
import { s, sl, t } from '../h';
import { walkTextNodeWithMoreInformation } from '../utils';

const mockFontInfo = {
  size: 0,
  family: '',
  bold: false,
  italic: false,
};

describe('utils', () => {
  describe('walkTextNodeWithMoreInformation', () => {
    const walkTextNodeAndExtract = (
      vNode: VirtualNode,
      k: 'textNode' | 'parent' | 'i'
    ) => {
      const res: Array<{
        textNode: TextNode;
        parent: SyntaxNode | SyntaxNodeWithLayerActivation;
        i: number;
      }> = [];
      walkTextNodeWithMoreInformation(vNode, (textNode, parent, _, i) => {
        res.push({ textNode, parent, i });
      });
      return res.map(item => get(item, k));
    };

    describe('idxInAncestor', () => {
      describe('normal syntax node', () => {
        // __a____b____c____d__
        test('a b c d => [0 0 0 0]', () => {
          const vNode = s(NodeType.LINE, [
            s(NodeType.BOLD, [t(mockFontInfo, 'a')]),
            s(NodeType.BOLD, [t(mockFontInfo, 'b')]),
            s(NodeType.BOLD, [t(mockFontInfo, 'c')]),
            s(NodeType.BOLD, [t(mockFontInfo, 'd')]),
          ]);
          expect(walkTextNodeAndExtract(vNode, 'i')).toStrictEqual([
            0, 0, 0, 0,
          ]);
        });

        // __ab____cd__
        test('ab cd => [0 1 0 1]', () => {
          const vNode = s(NodeType.LINE, [
            s(NodeType.BOLD, [t(mockFontInfo, 'a'), t(mockFontInfo, 'b')]),
            s(NodeType.BOLD, [t(mockFontInfo, 'c'), t(mockFontInfo, 'd')]),
          ]);
          expect(walkTextNodeAndExtract(vNode, 'i')).toStrictEqual([
            0, 1, 0, 1,
          ]);
        });

        // __abc____def__
        test('abc def => [0 1 2 0 1 2]', () => {
          const vNode = s(NodeType.LINE, [
            s(NodeType.BOLD, [
              t(mockFontInfo, 'a'),
              t(mockFontInfo, 'b'),
              t(mockFontInfo, 'c'),
            ]),
            s(NodeType.BOLD, [
              t(mockFontInfo, 'd'),
              t(mockFontInfo, 'e'),
              t(mockFontInfo, 'f'),
            ]),
          ]);
          expect(walkTextNodeAndExtract(vNode, 'i')).toStrictEqual([
            0, 1, 2, 0, 1, 2,
          ]);
        });
      });

      describe('syntax node with layer activation', () => {
        // # __a__
        test('# a => [0 0]', () => {
          const vNode = sl(
            NodeType.HEADING,
            [t(mockFontInfo, '# ')],
            [s(NodeType.BOLD, [t(mockFontInfo, 'a')])]
          );
          expect(walkTextNodeAndExtract(vNode, 'i')).toStrictEqual([0, 0]);
        });

        // # __ab__
        test('# ab => [0 0 1]', () => {
          const vNode = sl(
            NodeType.HEADING,
            [t(mockFontInfo, '# ')],
            [s(NodeType.BOLD, [t(mockFontInfo, 'a'), t(mockFontInfo, 'b')])]
          );
          expect(walkTextNodeAndExtract(vNode, 'i')).toStrictEqual([0, 0, 1]);
        });
      });
    });
  });
});
