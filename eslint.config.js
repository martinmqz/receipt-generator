// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config({ ignores: ['dist'] }, {
  extends: [
    js.configs.recommended,
    // ...tseslint.configs.recommended
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked
  ],
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname
    }
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    'react-x': reactX,
    'react-dom': reactDom,
    '@stylistic': stylistic
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
    'react-refresh/only-export-components': [ 'warn', { allowConstantExport: true }],
    '@stylistic/semi': [ 'warn', 'never' ],
    '@stylistic/comma-dangle': [ 'warn', 'never' ],
    '@stylistic/quotes': [ 'warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
  }
}, storybook.configs["flat/recommended"]);
