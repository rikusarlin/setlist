module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': [
      'error',
      { endOfLine: 'lf', singleQuote: true, semi: false },
    ],
  },
  plugins: ['prettier'],
}
