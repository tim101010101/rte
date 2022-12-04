export const trim = (s: string): string => {
  return (s || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};
