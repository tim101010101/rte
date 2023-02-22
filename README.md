# RTE

<p  align="center"><img  src="./logo.gif"  alt="logo"  height="150"></p>

A simple **WYSIWYG** rich text engine. According to classification, it belongs to **L2** level.

> **This project is still under development and there are many bug**
>
> **The document was written on February 22, 2023**

## Feature

1. WYSIWYG(What you see is what you get)
2. High degree of customization
   - DSL
   - Behavior before and after element activation
   - Behavior of cursor
3. State-driven architecture

## Install

Still in development process, can not be intalled by npm.

## Usage

For more information, see the `example` folder.

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

RTE allows users to define the DSL they want.

Let's take defining bold syntax as an example.

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
          // content
          groups.prefix,
          // font config
          { bold: true },
          // marker is not displayed when the cursor is not active
          { beforeActived: { show: false } }
        );
        const content = parsingRecursively(
          // the part that needs recursive parsing
          groups.content,
          // override font settings for content nodes
          { bold: true }
        );

        return syntax(NodeType.BOLD, [marker, ...content, marker]);
      },
    },
  };
};
```

This configuration means that **RTE does not care whether the syntax conforms to the markdown standard at all**. As long as users need it, they can configure the DSL they want.

> Moreover, because the architecture of RTE is very flexible, users can even configure the runtime model of syntax nodes to customize the interaction logic between page elements and cursors.
>
> This has not been realized yet😅, but it does support it in terms of architecture.

## Architecture

This project adopts a state-driven architecture and introduces a virtual-node system to better abstract the business model.

### State Driven

State-driven design is mainly reflected in cursor(Selection) and elements(OperableNode).

**Only need to change the internal state to map to the page in real time**

The global context(Page) captures the change in state through the proxy and then notify to the renderer to render.

> PS: Thanks to this, the state stack can be extracted directly into the history stack at a later stage, which can naturally support the undo operation.

### Virtual Node

This project uses a tree-like virtual node system to abstract page elements.

Virtual nodes are divided into the following two categories:

- SyntaxNode
  - type
  - current activation status
- TextNode
  - text
  - style, font
  - the behavior of this node when it is activated and not activated

### Fence

However, the tree structure is very troublesome to deal with, so in the actual implementation, **a special data structure is introduced to flatten the virtual node**, it called **fence**.

Fence is essentially **a forest with a height fixed at 2**, each of these **leaf nodes represents a location where the cursor can be inserted** and it carries the required information.

Just like this
