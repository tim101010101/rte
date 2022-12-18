// const walkNode = (vNode, handler) => {
//   let prevNode = null;

//   const dfs = (cur, idx) => {
//     if (!cur) return cur;

//     const { nodeType, tagName, isActive, children } = cur;
//     const newObj = {
//       nodeType,
//       tagName,
//       isActive,
//     };

//     isActive === undefined || Reflect.set(newObj, 'isActive', isActive);

//     handler(cur, prevNode, idx);

//     if (typeof children === 'string') {
//       newObj['children'] = children;
//       return newObj;
//     } else {
//       const newChildren = [];
//       children.forEach((child, i) => {
//         prevNode = cur;
//         newChildren.push(dfs(child, i));
//         prevNode = child;
//       });

//       newObj['children'] = newChildren;

//       return newObj;
//     }
//   };

//   return dfs(vNode, 0);
// };

const target1 = {
  nodeType: 'plain-text',
  tagName: 'span',
  children: 'this is ',
};
const target = {
  nodeType: 'plain-text',
  tagName: 'span',
  children: 'hello world',
};
// const sourceVNode = {
//   nodeType: 'bold',
//   tagName: 'span',
//   isActive: true,
//   children: [
//     {
//       nodeType: 'prefix',
//       tagName: 'span',
//       children: '**',
//     },
//     target1,
//     {
//       nodeType: 'em',
//       tagName: 'em',
//       isActive: false,
//       children: [target],
//     },
//     {
//       nodeType: 'suffix',
//       tagName: 'span',
//       children: '**',
//     },
//   ],
// };
const sourceVNode = {
  nodeType: 'bold',
  tagName: 'span',
  isActive: false,
  children: [
    target1,
    {
      nodeType: 'em',
      tagName: 'em',
      isActive: true,
      children: [
        {
          nodeType: 'prefix',
          tagName: 'span',
          children: '*',
        },
        target,
        {
          nodeType: 'suffix',
          tagName: 'span',
          children: '*',
        },
      ],
    },
  ],
};

const walkNodeWithTrackNode = (vNode, target) => {
  const path = [];
  let hasFound = false;

  const dfs = cur => {
    if (!cur) return cur;
    if (cur === target) hasFound = true;

    const { nodeType, tagName, isActive, children } = cur;
    const newObj = {
      nodeType,
      tagName,
      isActive,
    };
    isActive === undefined || Reflect.set(newObj, 'isActive', isActive);

    if (typeof children === 'string') {
      newObj['children'] = children;
      return newObj;
    } else {
      const newChildren = [];
      children.forEach((child, i) => {
        hasFound || path.unshift(i);
        newChildren.push(dfs(child));
        hasFound || path.shift();
      });

      newObj['children'] = newChildren;

      return newObj;
    }
  };

  return [dfs(vNode), path];
};

const switchActiveByPath = (root, path) => {
  let cur = root;
  while (path.length !== 1) {
    cur = root.children[path.pop()];
  }

  const { isActive } = cur;
  if (isActive === true) {
    cur.children.pop();
    cur.children.shift();
    cur.isActive = false;
  } else if (isActive === false) {
    cur.children.push({
      nodeType: 'suffix',
      tagName: 'span',
      children: cur.nodeType === 'bold' ? '**' : '*',
    });
    cur.children.push({
      nodeType: 'prefix',
      tagName: 'span',
      children: cur.nodeType === 'bold' ? '**' : '*',
    });
    cur.isActive = true;
  }

  return root;
};

const [newVNode, path] = walkNodeWithTrackNode(sourceVNode, target1);
console.log(switchActiveByPath(newVNode, path));
// const [newVNode, path] = walkNodeWithTrackNode(sourceVNode, target);
// console.log(switchActiveByPath(newVNode, path).children[1]);
