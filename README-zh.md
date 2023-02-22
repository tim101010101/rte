# RTE

<p align="center"><img src="./logo.gif" alt="logo" height="100"></p>
<p align="center"><a href="./README.md">English</a> | <a href="./README-zh.md">中文</a></p>

一个简单的 **WYSIWYG** 富文本引擎, 按照分类会属于 **L2** 级别

> **项目还在开发当中, 存在许多 bug**
>
> **该文档书写于 2023.2.22**

## Feature

1. 所见即所得 WYSIWYG(What you see is what you get)
2. 高度可定制
   - DSL
   - 页面元素激活前后的行为和表现
   - 光标行为
3. 状态驱动架构

## Current Progress

- 聚焦/取消聚焦
- 输入
- 删除
- 新行

## Install

项目仍在开发过程中, 暂时无法通过 npm 等方式安装

## Usage

移步 `example` 文件夹查看大致使用方式

## Configuration

### Basic

```typescript
const defaultConfig: EditorConfig = {
  font: {
    size: 20,
    family: 'Arial, Helvetica, sans-serif',
    bold: false,
    italic: false,
    color: '#000',
    textBaseline: 'bottom',
    textAlign: 'left',
  },
  page: {
    padding: 20,
    rowSpacing: 4,
  },
  container: '#editor',
};
```

### DSL

RTE 允许用户定义自己想要的 DSL

以下以粗体节点为例

```typescript
enum NodeType {
  BOLD,
}

export const inline: SchemaConfig['inline'] = (text, syntax) => {
  return {
    bold: {
      reg: /(?<prefix>\*\*|__)(?=\S)(?<content>[\s\S]+?)(\\*)\k<prefix>(?!(\*|_))/,
      render(groups, parsingRecursively) {
        const marker = text(
          // 节点文本
          groups.prefix,
          // 节点字体设置
          { bold: true },
          // marker 节点在激活前不显示
          { beforeActived: { show: false } }
        );
        const content = parsingRecursively(
          // 需要递归解析的文本
          groups.content,
          // 重写解析过程中的字体设置
          { bold: true }
        );

        return syntax(NodeType.BOLD, [marker, ...content, marker]);
      },
    },
  };
};
```

这样的配置方式意味着**RTE 完全不关心语法配置是否符合 markdown 标准**, 只要用户需要, 就可以配置出自己想要的 DSL

> 进一步说, 由于 RTE 的架构十分灵活, 用户甚至可以自行配置语法节点的运行时模型, 这意味着用户可以自定义页面元素与光标的交互逻辑
>
> 不过这一点暂时还没有体现出来 😅, 但从架构上来说, 确实是可以实现

## Architecture

RTE 采用状态驱动架构, 并引入虚拟 node 系统, 以此来更好的抽象业务模型

### State Driven

状态驱动的设计主要体现在光标(Selection)和页面元素(OperableNode)

**只需要改变内部状态, 就可以实时映射到页面**

而当页面元素状态改变时, 会产出一个特殊的数据结构, 称为**快照 Snapshot**

全局上下文(Page)会通过代理捕获到状态改变, 进而通知渲染器更新页面

![state-derive](https://user-images.githubusercontent.com/76992456/220551869-001f657e-bf56-4e6c-b005-92159afc6250.png)

可以看到, 光标的每一步操作都会产生一个快照, 而快照暂时由状态栈(State Stack)集中维护

> PS: 得益于此, 状态栈后续可以直接抽离为更改历史(History), 这样可以很自然的支持撤销操作

### Virtual Node

RTE 使用树状的虚拟 node 系统来抽象页面元素

虚拟 node 分为两类, 分别维护不同的数据

- SyntaxNode
  - 类型
  - 节点当前状态
- TextNode
  - 文本内容
  - 渲染样式
  - 光标激活前后的渲染表现

![vNode](https://user-images.githubusercontent.com/76992456/220551943-d68ab366-2c50-4250-b6de-6de9affd6f8b.png)

### Fence

然而, 树状结构在这样的业务需求中处理起来十分麻烦, 因此**在实际实现中, 引入了一层特殊的抽象层来对虚拟 node 进行扁平化**, 称为 **fence**

Fence 本质上是一个**森林, 由一些高度固定为 2 的树组成**, **每一个叶子节点都代表一个可以被光标插入的位置**, 并且叶子节点携带了一些有用的信息

大概长这样

![fence](https://user-images.githubusercontent.com/76992456/220551998-91b18b06-a938-464a-b30a-54e5060f556e.png)

## Contact

- Wechat: D1345118870
- Mailbox:
  - ethanteng1212@qq.com
  - ethanteng1212@gmail.com
