module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: 'babel-eslint',
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-plusplus': [0],
    'no-await-in-loop': [0],
    'no-console': 'off',
    'no-constant-condition': 'off',
    'no-restricted-syntax': 'off',
    'no-mixed-operators': 'off',
    'import/named': 'off',
  },
};
