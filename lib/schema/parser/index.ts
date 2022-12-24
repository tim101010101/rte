const inline = {
  bold: {
    reg: /^(\*\*|__)(?=\S)([\s\S]+?)(\\*)\1(?!(\*|_))/,
    type: 'bold',
  },
  italic: {
    reg: /(\*|_)(?=\S)([\s\S]+?)(\\*)\1(?!\1)/,
    type: 'italic',
  },
  inlineCode: {
    reg: /(`{1})([^`]+?|.{2,})\1/,
    type: 'inline-code',
  },
};
const config = {
  line: {},
  block: {},
  inline,
};

const findFirstMatched = (src, regPairs) => {
  let firstIndex = src.length;

  const res = regPairs.reduce((res, { reg, type }) => {
    const matched = src.match(reg);
    if (firstIndex && matched && matched.index <= firstIndex) {
      firstIndex = matched.index;
      res = [matched, type];
    }
    return res;
  }, null);

  return res;
};

const parse = (src, config) => {
  const recur = src => {
    if (!src) return [];

    const nereastMatched = findFirstMatched(src, Object.values(config.inline));
    console.log(nereastMatched);
    if (!nereastMatched) {
      return [h('plain-text', src)];
    }

    const [matched, type] = nereastMatched;
    const children = [];
    const { index } = matched;
    const content = matched[2];
    if (index) {
      children.push({ type: 'plain-text', children: src.slice(0, index) });
      children.push(...recur(src.slice(index)));
    } else {
      children.push(h(type, recur(content)));
      children.push(...recur(src.slice(matched[0].length)));
    }

    return children;
  };

  return recur(src);
};

const generate = vNode => {
  let res = '';

  const backTrack = root => {
    if (!root) return;

    const { children } = root;
    if (typeof children === 'string') {
      res += children;
    } else if (Array.isArray(children)) {
      children.forEach(child => backTrack(child));
    }
  };

  backTrack(vNode);

  return res;
};
