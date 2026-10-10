import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

/** Typed web/worker lint without the vulnerable fast-glob -> braces toolchain. */
export default [
  {ignores:["**/.next/**","**/node_modules/**","**/next-env.d.ts","**/coverage/**"]},
  {files:["**/*.{ts,tsx}"],
    languageOptions:{parser:tsParser,parserOptions:{ecmaFeatures:{jsx:true},sourceType:"module"}},
    plugins:{"@typescript-eslint":tsPlugin},
    rules:{"@typescript-eslint/no-explicit-any":"error","@typescript-eslint/no-unused-vars":["error",{argsIgnorePattern:"^_"}]}
  }
];
