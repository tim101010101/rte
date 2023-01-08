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
  DIVIDE,

  // block
  LIST_BLOCK,
  LIST_ITEM,
}
