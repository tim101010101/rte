import { mixin } from 'lib/utils';
import { s, t } from 'lib/model';
import { NodeType, TagName, ClassName } from 'lib/static';
import {
  ExportedText,
  FontInfo,
  TextNode,
  VirtualNode,
  VirtualNodeMarker,
  VirtualNodeMetaData,
  VirtualNodeProps,
} from 'lib/types';

const { LINE, PLAIN_TEXT, BOLD, ITALIC } = NodeType;
const { DIV, SPAN } = TagName;
const { RTE_LINE, RTE_BOLD, RTE_ITALIC, RTE_PLAIN_TEXT } = ClassName;

export const mockFontInfo = {
  size: 20,
  family: 'arial',
  bold: false,
  italic: false,
};

export const mockSyntax = (
  type: NodeType,
  tagName: TagName,
  children: Array<VirtualNode>,
  props: VirtualNodeProps,
  marker: VirtualNodeMarker = {},
  meta: VirtualNodeMetaData = {}
) => {
  return s(type, tagName, children, props, [], marker, meta);
};

export const mockText = (font: FontInfo, content: string) => {
  return t(font, content, { classList: [RTE_PLAIN_TEXT] }, [], {});
};

export const mockDefaultText = (content: string) =>
  mockText(mockFontInfo, content);

export const mockExportedText: ExportedText = (
  content: string,
  props,
  meta,
  fontInfo
) =>
  t(mixin(mockFontInfo, fontInfo), content, {
    classList: [ClassName.RTE_PLAIN_TEXT],
  });

export const lineWithChildren = (children: Array<VirtualNode>) => {
  return mockSyntax(LINE, DIV, children, { classList: [RTE_LINE] }, {});
};
export const boldWithChildren = (
  prefix: string,
  children: Array<VirtualNode>
) => {
  return mockSyntax(
    BOLD,
    SPAN,
    children,
    { classList: [RTE_BOLD] },
    { prefix, suffix: prefix }
  );
};
export const italicWithChildren = (
  prefix: string,
  children: Array<VirtualNode>
) => {
  return mockSyntax(
    ITALIC,
    SPAN,
    children,
    { classList: [RTE_ITALIC] },
    { prefix, suffix: prefix }
  );
};

export const foo = () =>
  mockText({ size: 20, family: 'arial', bold: false, italic: false }, 'foo');
export const fooBold = (prefix: string) =>
  boldWithChildren(prefix, [
    mockText({ size: 20, family: 'arial', bold: true, italic: false }, 'foo'),
  ]);
export const fooItalic = (prefix: string) =>
  italicWithChildren(prefix, [
    mockText({ size: 20, family: 'arial', bold: false, italic: true }, 'foo'),
  ]);

export const generate = (root: VirtualNode) => {
  if (!root) return '';

  if (root.type === PLAIN_TEXT) {
    return (root as TextNode).text;
  } else {
    let subRes = '';
    const { marker, children } = root;
    const { prefix, suffix } = marker;
    if (prefix) subRes += prefix;
    subRes += children.reduce((content, cur) => {
      content += generate(cur);
      return content;
    }, '');
    if (suffix) subRes += suffix;

    return subRes;
  }
};
