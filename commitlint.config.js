export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'pref',
        'docs',
        'style',
        'chore',
        'merge',
        'test',
      ],
    ],
  },
};
