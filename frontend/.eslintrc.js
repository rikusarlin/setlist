module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      { endOfLine: 'lf', singleQuote: true, semi: false },
    ],
    'react/prop-types': 0,
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
      plugins: ['jest', 'prettier'],
      rules: {
        'prettier/prettier': [
          'error',
          { endOfLine: 'lf', singleQuote: true, semi: false },
        ],
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
