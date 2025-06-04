/** @type {import('stylelint').Config} */
export default {
  // extends: ['stylelint-config-standard'],
  extends: [
    'stylelint-config-recess-order'
  ],
  plugins: [
		'stylelint-order'
	],
  rules: {
    'rule-empty-line-before': 'always',
    'declaration-empty-line-before': 'never'
  }
}
