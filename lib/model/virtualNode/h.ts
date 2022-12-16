import {
  VirtualNode,
  VirtualNodeChildren,
  VirtualNodeEvents,
  VirtualNodeProps,
} from 'lib/types';

export function h(tagName: string): VirtualNode;
export function h(tagName: string, props: VirtualNodeProps): VirtualNode;
export function h(
  tagName: string,
  props: VirtualNodeProps,
  children: VirtualNodeChildren
): VirtualNode;
export function h(
  tagName: string,
  props: VirtualNodeProps,
  children: VirtualNodeChildren,
  events: VirtualNodeEvents
): VirtualNode;
export function h(
  tagName: string,
  props: VirtualNodeProps = {},
  children: VirtualNodeChildren = [],
  events: VirtualNodeEvents = []
): VirtualNode {
  return {
    tagName,
    props,
    children,

    events,

    el: null,

    marker: null,
  };
}
