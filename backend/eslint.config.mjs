import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["src/controllers/gen", "dist", "src/views/gen"]),
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: { globals: globals.browser },
		rules: {
			"array-callback-return": "error",
			"no-await-in-loop": "error",
			"no-constructor-return": "error",
			"no-duplicate-imports": "error",
			"no-inner-declarations": ["error", "both"],
			"no-promise-executor-return": "error",
			"no-unassigned-vars": "error",
			"no-unreachable-loop": "error",
			"no-use-before-define": "error",
			"no-useless-assignment": "error",
			"block-scoped-var": "error",
			camelcase: "warn",
			"capitalized-comments": ["error", "never"],
			"consistent-return": "error",
			curly: "error",
			"dot-notation": "error",
			"init-declarations": ["error", "always"],
			"no-console": ["error", { allow: ["warn", "error"] }],
			"@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
		},
	},
	tseslint.configs.recommended,
]);
