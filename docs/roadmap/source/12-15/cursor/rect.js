const rectBtn = document.querySelector('#rectBtn');

const renderRect = () => {
  const range = document.createRange();
  range.selectNode(document.querySelector('#content'));
  const rectList = range.getClientRects();

  let t = 0;
  const render = (x, y, width, height) => {
    const dom = document.createElement('span');
    dom.classList.add('rect');
    dom.style.width = `${width}px`;
    dom.style.height = `${height + t}px`;
    dom.style.left = `${x}px`;
    dom.style.top = `${y + height}px`;
    document.body.appendChild(dom);

    t += height;
  };

  Array.from(rectList).forEach(rect => {
    const { left, top, width, height } = rect;
    render(left, top, width, height);
  });
};

rectBtn.addEventListener('click', () => renderRect());
