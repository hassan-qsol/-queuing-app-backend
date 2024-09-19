import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/*courses/**',
      '**/*interceptors/**',
      '**/*ui/**',
      '**/*.storybook/**',
      '**/*public/**',
      '**/*.config.*',
      'system.d.ts',
      '.eslintrc.cjs',
    ],
  },
  {
    rules: {
      'no-constant-condition': 'off'
    },
  },
];
