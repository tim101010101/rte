const h = (type, children, marker = {}) => {
  return { type, children, marker };
};
const text = src => {
  return h('plain-text', src);
};

const config = {
  block: {},
  line: {
    hr: {
      reg: /^(?<content>\*{3,}|-{3,}|_{3,})$/,
      render(_, children) {
        return h('hr', children);
      },
    },
    heading: {
      reg: /^(?<prefix>#{1,6}) (?<content>[\s\S]+)$/,
      render(groups, children) {
        const { prefix } = groups;
        return h('heading', children, {
          prefix,
        });
      },
    },
  },
  inline: {
    bold: {
      reg: /(?<prefix>\*\*|__)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!(\*|_))/,
      render(groups, children) {
        const { prefix } = groups;
        return h('bold', children, {
          prefix,
          suffix: prefix,
        });
      },
    },
    italic: {
      reg: /(?<prefix>\*|_)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!\k<prefix>)/,
      render(groups, children) {
        const { prefix } = groups;
        return h('em', children, {
          prefix,
          suffix: prefix,
        });
      },
    },
  },
};

const findFirstMatched = (src, schemaConfigs) => {
  let firstIndex = src.length;

  const res = schemaConfigs.reduce((res, { reg, render }) => {
    const matched = src.match(reg);
    if (firstIndex && matched && matched.index <= firstIndex) {
      firstIndex = matched.index;
      res = { matched, render };
    }
    return res;
  }, null);

  return res;
};

const parseInline = (src, inlineConfig, text) => {
  const recur = cur => {
    if (!cur) return [];

    const nereastMatched = findFirstMatched(cur, Object.values(inlineConfig));
    if (!nereastMatched) {
      return [text(cur)];
    }

    const children = [];
    const { matched, render } = nereastMatched;
    const { index } = matched;
    const content = matched[2];
    if (index) {
      children.push(text(cur.slice(0, index)));
      children.push(...recur(cur.slice(index)));
    } else {
      children.push(render(matched.groups, recur(content)));
      children.push(...recur(cur.slice(matched[0].length)));
    }

    return children;
  };

  return recur(src);
};

const parseLine = (src, lineConfig, text) => {
  const target = Object.values(lineConfig)
    .filter(({ reg }) => reg.test(src))
    .at(0);

  if (target) {
    const { reg, render } = target;
    const matched = src.match(reg);
    const { groups } = matched;
    const { content } = groups;

    const children = parseInline(content, config.inline, text);
    return render(groups, children);
  } else {
    const children = parseInline(content, config.inline, text);
    return h('line', children);
  }
};

const generator = root => {
  if (!root) return '';

  if (root.type === 'plain-text') {
    return root.children;
  } else {
    let subRes = '';
    const { marker, children } = root;
    const { prefix, suffix } = marker;
    if (prefix) subRes += prefix;
    subRes += children.reduce((content, cur) => {
      content += generator(cur);
      return content;
    }, '');
    if (suffix) subRes += suffix;

    return subRes;
  }
};

// const src = '__This__ *is* **Hello _World_** yes **i_t_** _is_';
// const children = parseInline(src, config.inline, text);
// document.querySelector('#result').innerHTML = JSON.stringify(children);
// console.log(generator(h('line', children)));

const src = '## Hello **World**';
const headingLine = parseLine(src, config.line, text);
document.querySelector('#result').innerHTML = JSON.stringify(headingLine);

document.querySelector('#source').innerHTML = src;
