export enum ShapeTypes {
  INLINE_BLOCK,
  BLOCK,
  LINE,
}

export enum NodeTypes {
  PLAIN_TEXT = 1,

  // inline
  BOLD = 1 << 1,
  ITALIC = 1 << 2,

  // block
  LIST = 1 << 3,
  CODE_BLOCK = 1 << 4,

  // line
  LIST_ITEM = 1 << 5,
}
