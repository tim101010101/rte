const line = {
  type: 'line',
  tagName: 'div',
  props: { classList: ['r-line-test'] },
  children: [
    {
      type: 'bold',
      tagName: 'strong',
      props: { classList: ['r-bold'] },
      children: [
        {
          type: 'prefix',
          tagName: 'span',
          props: { classList: ['r-hide'] },
          text: '**',
        },
        {
          type: 'plain-text',
          tagName: 'span',
          props: { classList: ['r-plain-text'] },
          text: 'this ',
        },
        {
          type: 'em',
          tagName: 'em',
          children: [
            {
              type: 'prefix',
              tagName: 'span',
              props: { classList: ['r-hide'] },
              text: '*',
            },
            {
              type: 'plain-text',
              tagName: 'span',
              props: { classList: ['r-plain-text'] },
              text: 'is ',
            },
            {
              type: 'suffix',
              tagName: 'span',
              props: { classList: ['r-hide'] },
              text: '*',
            },
          ],
        },
        {
          type: 'suffix',
          tagName: 'span',
          props: { classList: ['r-hide'] },
          text: '**',
        },
      ],
    },
    {
      type: 'plain-text',
      tagName: 'span',
      props: { classList: ['r-plain-text'] },
      text: 'a ',
    },
    {
      type: 'em',
      tagName: 'em',
      props: { classList: ['r-italic'] },
      children: [
        {
          type: 'prefix',
          tagName: 'span',
          props: { classList: ['r-hide'] },
          text: '*',
        },
        {
          type: 'plain-text',
          tagName: 'span',
          props: { classList: ['r-plain-text'] },
          text: 'hello world',
        },
        {
          type: 'suffix',
          tagName: 'span',
          props: { classList: ['r-hide'] },
          text: '*',
        },
      ],
    },
  ],
};

const content = document.querySelector('#content');

const render = (container, vNode) => {
  const node = materialize(vNode);
  appendChild(container, node);
};

const materialize = vNode => {
  const { tagName, children, text } = vNode;
  vNode.el = createDomNode(tagName);

  mountProps(vNode);
  mountListener(vNode);

  if (text) {
    appendChild(vNode.el, createTextNode(text));
  } else {
    appendChild(vNode.el, materializeChildren(children));
  }

  Reflect.set(vNode.el, 'vNode', vNode);

  return vNode.el;
};

const materializeChildren = children => {
  return children.reduce(
    (fragment, child) => appendChild(fragment, materialize(child)),
    createFragment()
  );
};

const mountProps = vNode => {
  const { el, props } = vNode;
  if (el && props) {
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'classList') {
        v.forEach(className => el.classList.add(className));
      } else {
        el.setAttribute(k, v);
      }
    });
  }
};

const mountListener = vNode => {
  const { el, events } = vNode;
  if (el && events) {
    events.forEach(([event, listener, capture]) =>
      el.addEventListener(event, listener, capture)
    );
  }
};

const appendChild = (parent, ...children) => {
  children.forEach(child => parent.appendChild(child));
  return parent;
};

const removeChild = (parent, child) => {
  parent.removeChild(child);
};

const createFragment = () => {
  return document.createDocumentFragment();
};

const createTextNode = text => {
  return document.createTextNode(text);
};

const createDomNode = (tagName, classList = [], attributes = {}) => {
  const dom = document.createElement(tagName);
  dom.classList.add(...classList);
  Object.entries(attributes).forEach(([k, v]) => dom.setAttribute(k, v));
  return dom;
};

render(content, line);
