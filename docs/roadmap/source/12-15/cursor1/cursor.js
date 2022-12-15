const cursorBtn = document.querySelector('#cursorBtn');
const div = document.querySelector('#content');

const isELementVisiable1 = el => {
  const rect = el.getBoundingClientRect();
  const { top, left, width, height, bottom, right } = rect;

  if (!width && !height) return false;

  return (
    top >= 0 &&
    left >= 0 &&
    bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const traversalTextNode1 = (el, callback) => {
  const nodeList = [...el.childNodes];

  while (nodeList.length) {
    const node = nodeList.shift();

    if (node.nodeType === 1 && !isELementVisiable1(node)) {
      continue;
    } else if (node.nodeType === 3) {
      callback(node);
    } else {
      nodeList.unshift(...node.childNodes);
    }
  }
};

const getRectList = el => {
  const rectList = [];
  traversalTextNode1(el, textNode => {
    if (!/^[ \n]*$/.test(textNode.data)) {
      const range = document.createRange();
      range.selectNode(textNode);
      rectList.push(...range.getClientRects());
    }
  });

  return rectList;
};

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

const getTextWidth = (text, font) => {
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

const flatDOMTree = el => {
  const res = [];

  traversalTextNode1(el, node => {
    if (!/^[\n ]*$/.test(node.data)) {
      res.push(node.data);
    }
  });

  return res;
};

const getFence = (textList, rectList) => {
  let prev = rectList[0].left;
  const res = [prev];

  while (textList.length) {
    const text = textList.shift();
    Array.from(text).forEach(char => {
      const width = getTextWidth(char, '20px arial') + prev;
      res.push(width);
      prev = width;
    });
  }

  return res;
};

const renderCursor = fence => {
  const render = (left, height, top) => {
    const dom = document.createElement('span');
    dom.classList.add('cursor');
    dom.style.width = `${1}px`;
    dom.style.height = `${height + 20}px`;
    dom.style.left = `${left}px`;
    dom.style.top = `${top}px`;
    document.body.appendChild(dom);
  };

  const { height, top } = Array.from(getRectList(div))[0];
  fence.forEach(left => render(left, height, top));
};

cursorBtn.addEventListener('click', () => {
  const fence = getFence(flatDOMTree(div), getRectList(div));

  renderCursor(fence);
});
