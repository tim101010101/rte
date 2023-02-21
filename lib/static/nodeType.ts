export enum NodeType {
  EMPTY,

  // line
  LINE,
  PLAIN_TEXT,
  BOLD,
  ITALIC,
  PREFIX,
  SUFFIX,

  HEADING,
  HEADING_MARKER,

  DIVIDE,

  // block
  LIST_BLOCK,
  LIST_ITEM,
}
