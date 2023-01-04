const config = {
  schema: {
    inline: [
      {
        key: PLAIN_TEXT,
        type: PLAIN_TEXT,
        marker: {},
        render(text) {
          return t(SPAN, { classList: [RTE_PLAIN_TEXT] }, text);
        },
      },
      {
        key: BOLD,
        type: BOLD,
        marker: {
          prefix: '**',
          suffix: '**',
        },
        render(text) {
          return s(BOLD, SPAN, { classList: [RTE_BOLD] }, [
            t(SPAN, { classList: [RTE_PLAIN_TEXT] }, text),
          ]);
        },
      },
      {
        key: EM,
        type: EM,
        marker: {
          prefix: '_|*',
          suffix: '_|*',
        },
        render(text) {
          return s(EM, SPAN, { classList: [RTE_BOLD] }, [
            t(SPAN, { classList: [RTE_PLAIN_TEXT] }, text),
          ]);
        },
      },
    ],
    line: [
      {
        key: LINE,
        type: LINE,
        marker: {},
        render(line, utils, hooks) {
          const { parseInline } = utils;

          return s(LINE, DIV, { classList: [RTE_LINE] }, parseInline(line));
        },
      },
      {
        key: 'todo',
        type: 'todo',
        marker: {
          prefix: '- [ ]',
        },
        render(text, utils, hooks) {
          const { setContent, patch } = utils;
          const {} = hooks;

          const clickHandler = e => {
            setContent(prev => prev.replace(/^- \[ \]/, '- [x]'));
            patch();
          };

          return s(EM, DIV, { classList: ['r-todo'] }, [
            s(
              EM,
              SPAN,
              { classList: ['r-todo-checkbox'], type: 'checkbox' },
              [],
              [[EventName.CLICK, clickHandler, false]]
            ),
            t(SPAN, { classList: ['r-todo-content'] }, text),
          ]);
        },
      },
    ],
    block: [
      {
        key: 'code-block',
        type: 'code-block',
        marker: {
          prefix: '```[a-zA-Z0-9]+',
          suffix: '```',
        },
        render(lines, utils, hooks) {
          const parseCodeBlock = lines => {
            return [];
          };

          return s(
            EM,
            DIV,
            { classList: ['r-code-block'] },
            parseCodeBlock(lines)
          );
        },
      },
    ],
  },
};
