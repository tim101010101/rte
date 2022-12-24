const h = (type, children) => {
  return { type, children, marker: {} };
};

const inline = {
  bold: {
    // reg: /^(\*\*|__)(?=\S)([\s\S]+?)(\\*)\1(?!(\*|_))/,
    reg: /^(?<prefix>\*\*|__)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!(\*|_))/,
    render(matched, children) {
      const vNode = h('bold', children);
      const { prefix } = matched.groups;
      vNode.marker.prefix = prefix;
      vNode.marker.suffix = prefix;
      return vNode;
    },
  },
  italic: {
    // reg: /(\*|_)(?=\S)([\s\S]+?)(\\*)\1(?!\1)/,
    reg: /(?<prefix>\*|_)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!\k<prefix>)/,
    render(matched, children) {
      const vNode = h('italic', children);
      const { prefix } = matched.groups;
      vNode.marker.prefix = prefix;
      vNode.marker.suffix = prefix;
      return vNode;
    },
  },
  inlineCode: {
    reg: /(`{1})([^`]+?|.{2,})\1/,
    render(matched, children) {},
  },
};
const config = {
  line: {},
  block: {},
  inline,
};

const findFirstMatched = (src, regPairs) => {
  let firstIndex = src.length;

  const res = regPairs.reduce((res, { reg, type, render }) => {
    const matched = src.match(reg);
    if (firstIndex && matched && matched.index <= firstIndex) {
      firstIndex = matched.index;
      res = [matched, type, render];
    }
    return res;
  }, null);

  return res;
};

const parse = (src, config) => {
  const recur = src => {
    if (!src) return [];

    const nereastMatched = findFirstMatched(src, Object.values(config.inline));
    if (!nereastMatched) {
      return [h('plain-text', src)];
    }

    const [matched, _, render] = nereastMatched;
    const children = [];
    const { index } = matched;
    const content = matched[2];
    if (index) {
      children.push({ type: 'plain-text', children: src.slice(0, index) });
      children.push(...recur(src.slice(index)));
    } else {
      children.push(render(matched, recur(content)));
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

const src = '__This__ *is* **Hello _World_** yes **i_t_** _is_';
const children = parse(src, config);
document.querySelector('#source').innerHTML = src;
document.querySelector('#result').innerHTML = JSON.stringify(children);

console.log(generate(h('line', children)));
