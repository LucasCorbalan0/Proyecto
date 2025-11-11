// Proyecto/eslint.config.js

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // Ignora las carpetas 'dist' y 'node_modules' de ambos proyectos
  globalIgnores(['dist', 'node_modules', 'Backend/node_modules']),

  // --- 1. Configuración para el FRONT-END (React) ---
  {
    files: ['src/**/*.{js,jsx}'], // Solo aplica a la carpeta 'src'
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // <-- REGLAS DE NAVEGADOR
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },

  // --- 2. NUEVA Configuración para el BACK-END (Node.js) ---
  {
    files: ['Backend/**/*.{js,mjs}'], // Solo aplica a la carpeta 'Backend'
    extends: [
      js.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module', // Mantenemos 'module' porque usas 'import'
      globals: {
        ...globals.node, // <-- ¡REGLAS DE NODE.JS! (Aquí SÍ existe 'process')
      },
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  }
]);