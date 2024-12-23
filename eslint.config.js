import eslintConfig from "@igorkowalczyk/eslint-config/flat";
import turboPlugin from "eslint-plugin-turbo";

export default [
 ...eslintConfig,
 {
  plugins: {
   turbo: turboPlugin,
  },
  rules: {
   ...turboPlugin.configs["recommended"].rules,
   "turbo/no-undeclared-env-vars": "off",
  },
 },
];
