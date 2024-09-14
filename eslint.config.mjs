import react from '@eslint-react/eslint-plugin'
import * as tsParser from '@typescript-eslint/parser'
import tseslint from 'typescript-eslint'
import * as depend from 'eslint-plugin-depend'
import oxlint from 'eslint-plugin-oxlint'

export default tseslint.config(
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  depend.configs['flat/recommended'],
  oxlint.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs['recommended-type-checked'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['**/node_modules/**', 'dist/**'],
  },
)
