import { s, t } from 'lib/model';
import { ExportedTextFunction } from 'lib/types';

export const mockSyntax = s;

export const mockText: ExportedTextFunction = (
  children,
  props,
  meta,
  fontInfo?
) => {
  return t(
    { family: '', size: 0, bold: false, italic: false },
    children,
    props || { classList: [] },
    [],
    meta || {}
  );
};
