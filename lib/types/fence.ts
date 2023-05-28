import { ClientRect } from 'lib/types';

/**
 * Fence is a special data structure used to flatten vNode.
 *
 * It is essentially a forest of trees fixed to 2 in height.
 *
 * The root node of each tree represents a page element.
 *
 * The leaf nodes of each tree represents a position that can be inserted by the cursor.
 */
export type Fence = Array<FenceRoot>;

/**
 * The abstract of page element, one `FenceRoot` represents one page element.
 *
 * @example
 *
 * Such as `a*b*`, there are 2 `FenceRoot` here.
 *
 * ```text
 *  a *b*
 *  1  2
 * ```
 */
export interface FenceRoot {
  /**
   * Array of the leaf nodes, one item represents one position that can be inserted by the cursor.
   */
  fenceList: Array<FenceLeaf>;

  /**
   * The sum of the number of all leaf nodes in front of the current root node.
   */
  prefixLength: number;

  /**
   * The sum of the number of all leaf nodes under the current root node.
   */
  totalLength: number;
  /**
   * The sum of the number of leaf nodes that may change under the current node.
   */
  totalChange: number;
}

/**
 * One `FenceLeaf` represents a position that can be inserted by the cursor.
 *
 * Note that there is an overlap between the adjacent positions of the root.
 *
 * For this overlapping position, there will be a corresponding leaf in each of the two roots.
 *
 * @example
 *
 * Look at the text `a*b*`, there are 2 `FenceRoot` and 6 `FenceLeaf`.
 *
 * ```text
 *  a * b *
 * 1 2
 *   3 4 5 6
 * ```
 */
export interface FenceLeaf {
  /**
   * The amount of space occupied by the characters of the current position.
   */
  rect: ClientRect;
  /**
   * The number of characters that may change in front of this position.
   *
   * The change mentioned here refers to all behaviors that cause character displacement during rendering.
   *
   * @example
   *
   * `a**b**`
   *
   * ```text
   *  a * * b * *
   * 0 0
   *   0 1 2 2 3 4
   * ```
   */
  prefixChange: number;
  /**
   * The offset of the current position in the entire string.
   */
  textOffset: number;
}

export interface FenceInfoItem {
  ancestorIdx: number;
  totalLength: number;
  totalChange: number;
  prefixChange: number;
}

export interface FenceInfo {
  rect: ClientRect;
  textOffset: number;

  fenceInfoList: Array<FenceInfoItem>;
}
