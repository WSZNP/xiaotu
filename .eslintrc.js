module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/vue3-essential', '@vue/standard'],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/comment-directive': 'off', // 关闭对html文件末尾的检查
    'space-before-function-paren': 0, // 关闭对函数小括号前空格的检查
    'vue/multi-word-component-names': 'off', // 关闭对Vue文件命名的检查
    'prefer-const': 0 // 防止let关键字默认变成const
    // 'space-before-function-paren': 0 // 使得eslint对于函数前空格不报错
  }
}
