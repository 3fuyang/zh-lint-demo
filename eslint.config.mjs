import react from '@eslint-react/eslint-plugin'
import * as tsParser from '@typescript-eslint/parser'
import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs.recommended,
    languageOptions: {
      parser: tsParser,
    },
  },
)
