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
    'sourceType': 'module',
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
      { 'SwitchCase': 1 },
    ],
    'linebreak-style': [
      'error',
      process.platform === 'win32' ? 'windows' : 'unix',
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
    'arrow-parens': [
      'error',
      'always',
    ],
  },
};
