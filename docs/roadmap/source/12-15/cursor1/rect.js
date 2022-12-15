const rectBtn = document.querySelector('#rectBtn');

const isELementVisiable = el => {
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

const traversalTextNode = (el, callback) => {
  const nodeList = [...el.childNodes];

  while (nodeList.length) {
    const node = nodeList.shift();

    if (node.nodeType === 1 && !isELementVisiable(node)) {
      continue;
    } else if (node.nodeType === 3) {
      callback(node);
    } else {
      nodeList.unshift(...node.childNodes);
    }
  }
};

const renderRect = el => {
  const rectList = [];
  traversalTextNode(el, textNode => {
    if (!/^[ \n]*$/.test(textNode.data)) {
      const range = document.createRange();
      range.selectNode(textNode);
      rectList.push(...range.getClientRects());
    }
  });

  let t = 0;
  const render = (x, y, width, height) => {
    const dom = document.createElement('span');
    dom.classList.add('rect');
    dom.style.width = `${width}px`;
    dom.style.height = `${height}px`;
    dom.style.left = `${x}px`;
    dom.style.top = `${y + height + 20}px`;
    document.body.appendChild(dom);

    t += height;
  };

  Array.from(rectList).forEach(rect => {
    const { left, top, width, height } = rect;
    render(left, top, width, height);
  });
};

rectBtn.addEventListener('click', () =>
  renderRect(document.querySelector('#content'))
);
