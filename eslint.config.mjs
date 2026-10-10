// ESLint for JavaScript build/runtime configuration and scripts.
// Strict TypeScript 5.9 handles typed source; a safe AST TypeScript lint
// pipeline may be reconsidered after upstream braces dependency is removed.
export default [
  { ignores:["**/.next/**","**/node_modules/**","**/next-env.d.ts","**/coverage/**",
             "**/pnpm-lock.yaml","**/*.ts","**/*.tsx"] },
  { files:["**/*.{js,mjs}"],
    languageOptions:{ecmaVersion:"latest",sourceType:"module"},
    rules:{"no-eval":"error","no-var":"error","eqeqeq":"error",
           "no-unused-vars":["error",{argsIgnorePattern:"^_",varsIgnorePattern:"^_"}]}
  }
];
