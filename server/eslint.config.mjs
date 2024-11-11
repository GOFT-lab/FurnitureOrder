import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: '@babel/eslint-parser',
      sourceType: 'commonjs',
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
];
