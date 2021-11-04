module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 12,
  },
  'plugins': [
    'react',
  ],
  'rules': {
    'indent': [
      'error',
      2,
      // { 'switchCase': 4 },
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'no-unused-vars': [
      'off',
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
  },
};
