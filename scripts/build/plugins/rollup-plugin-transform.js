/**
 *
 * @param {*} filterList
 * @returns {import('rollup').Plugin'}
 */
export const transform = filterList => {
  return {
    name: 'transform-code',
    transform: (code, id) => {
      if (!filterList || !filterList.length) return code;

      return filterList.reduce((generatedCode, filter) => {
        if (filter.reg) {
          return filter.reg.test(generatedCode)
            ? filter.filter(generatedCode, id)
            : generatedCode;
        }
        return filter(generatedCode, id);
      }, code);
    },
  };
};
