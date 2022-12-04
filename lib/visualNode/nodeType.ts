export enum NodeType {
  // inline
  TEXT = 1,
  BOLD = 1 << 1,
  ITALIC = 1 << 2,
  INLINE_CODE = 1 << 3,

  // block
  CODE_BLOCK = 1 << 4,
  LIST = 1 << 5,
}
