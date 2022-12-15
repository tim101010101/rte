const cursorBtn = document.querySelector('#cursorBtn');
const div = document.querySelector('#content');
const range = document.createRange();
range.selectNode(div);
const rectList = range.getClientRects();

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

const getTextWidth = (text, font) => {
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

const flatDOMTree = () => {
  const el = div;
  const res = [];
  const nodeList = [...el.childNodes];

  while (nodeList.length) {
    const node = nodeList.shift();
    if (node.nodeType === 3) {
      res.push(node.data);
    } else {
      nodeList.unshift(...node.childNodes);
    }
  }

  return res;
};

const getFence = (textList, rectList) => {
  const { left } = rectList.shift();
  const res = [left];

  let len = textList.length;
  let prev = left;

  while (len--) {
    const text = textList.shift();
    const _ = rectList.shift();
    const font =
      len === 0
        ? 'italic 20px arial'
        : len === 1
        ? 'bold 20px arial'
        : '20px arial';

    Array.from(text).forEach(char => {
      const width = getTextWidth(char, font) + prev;
      res.push(width);
      prev = width;
    });

    if (len) {
      const width = rectList.shift().width + prev;
      res.push(width);
      prev = width;
    }
  }

  return res;
};

const fence = getFence(
  flatDOMTree().filter(v => !/^[\n ]*$/.test(v)),
  Array.from(rectList)
);

const renderCursor = fence => {
  const render = (left, height, top) => {
    const dom = document.createElement('span');
    dom.classList.add('cursor');
    dom.style.width = `${1}px`;
    dom.style.height = `${height}px`;
    dom.style.left = `${left}px`;
    dom.style.top = `${top}px`;
    document.body.appendChild(dom);
  };

  const { height, top } = Array.from(rectList)[0];
  fence.forEach(left => render(left, height, top));
};

cursorBtn.addEventListener('click', () => renderCursor(fence));
