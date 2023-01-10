import { NodeType } from 'lib/static';
import { SyntaxNode } from 'lib/types';

export const line: SyntaxNode = {
  type: NodeType.LINE,
  isActive: false,

  children: [
    {
      type: NodeType.PLAIN_TEXT,
      text: '**',
      font: {
        size: 20,
        family: 'Arial, Helvetica, sans-serif',
        bold: true,
        italic: false,
      },
      behavior: { beforeActived: { show: false } },
    },
    {
      type: NodeType.PLAIN_TEXT,
      text: 'hello ',
      font: {
        size: 20,
        family: 'Arial, Helvetica, sans-serif',
        bold: true,
        italic: false,
      },
    },
    {
      type: NodeType.ITALIC,
      isActive: false,
      children: [
        {
          type: NodeType.PLAIN_TEXT,
          text: '_',
          font: {
            size: 20,
            family: 'Arial, Helvetica, sans-serif',
            bold: true,
            italic: true,
          },
          behavior: { beforeActived: { show: false } },
        },
        {
          type: NodeType.PLAIN_TEXT,
          text: 'world',
          font: {
            size: 20,
            family: 'Arial, Helvetica, sans-serif',
            bold: true,
            italic: true,
          },
        },
        {
          type: NodeType.PLAIN_TEXT,
          text: '_',
          font: {
            size: 20,
            family: 'Arial, Helvetica, sans-serif',
            bold: true,
            italic: true,
          },
          behavior: { beforeActived: { show: false } },
        },
      ],
    },
    {
      type: NodeType.PLAIN_TEXT,
      text: '**',
      font: {
        size: 20,
        family: 'Arial, Helvetica, sans-serif',
        bold: true,
        italic: false,
      },
      behavior: { beforeActived: { show: false } },
    },
  ],
};

export const activedLine: SyntaxNode = {
  type: NodeType.LINE,
  isActive: true,

  children: [
    {
      type: NodeType.PLAIN_TEXT,
      text: '**',
      font: {
        size: 20,
        family: 'Arial, Helvetica, sans-serif',
        bold: true,
        italic: false,
      },
      behavior: { beforeActived: { show: false } },
    },
    {
      type: NodeType.PLAIN_TEXT,
      text: 'hello ',
      font: {
        size: 20,
        family: 'Arial, Helvetica, sans-serif',
        bold: true,
        italic: false,
      },
    },
    {
      type: NodeType.ITALIC,
      isActive: true,
      children: [
        {
          type: NodeType.PLAIN_TEXT,
          text: '_',
          font: {
            size: 20,
            family: 'Arial, Helvetica, sans-serif',
            bold: true,
            italic: true,
          },
          behavior: { beforeActived: { show: false } },
        },
        {
          type: NodeType.PLAIN_TEXT,
          text: 'world',
          font: {
            size: 20,
            family: 'Arial, Helvetica, sans-serif',
            bold: true,
            italic: true,
          },
        },
        {
          type: NodeType.PLAIN_TEXT,
          text: '_',
          font: {
            size: 20,
            family: 'Arial, Helvetica, sans-serif',
            bold: true,
            italic: true,
          },
          behavior: { beforeActived: { show: false } },
        },
      ],
    },
    {
      type: NodeType.PLAIN_TEXT,
      text: '**',
      font: {
        size: 20,
        family: 'Arial, Helvetica, sans-serif',
        bold: true,
        italic: false,
      },
      behavior: { beforeActived: { show: false } },
    },
  ],
};
