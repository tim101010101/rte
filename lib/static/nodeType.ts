export enum NodeType {
  LINE = 1,
  PLAIN_TEXT = 1 << 1,
  BOLD = 1 << 2,
  EM = 1 << 3,
  PREFIX = 1 << 4,
  SUFFIX = 1 << 5,
  HEADING = 1 << 6,
}
