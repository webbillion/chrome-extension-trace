module.exports =  {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
  rules: {
    'no-console': 'off',
    'no-case-declarations': 'off'
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  globals: {
    chrome: true
  }
}