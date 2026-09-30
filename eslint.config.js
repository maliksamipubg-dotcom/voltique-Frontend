import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // A context module intentionally exports both the provider and the
    // custom hook that reads it, so the fast-refresh rule does not apply.
    files: ['src/contexts/**/*.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // Build/config files run in Node, not the browser.
    files: ['*.config.js', 'api/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
