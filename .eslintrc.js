module.exports = {
  parser: '@babel/eslint-parser',
  extends: [
    'react-app',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['jsx-a11y'],
  rules: {
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'no-unused-vars': 'warn',
    'no-console': 'off',
  },
};
