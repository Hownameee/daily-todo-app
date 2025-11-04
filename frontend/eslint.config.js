import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["dist", "src/lib/gen/**"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs["recommended-latest"], reactRefresh.configs.vite],
		languageOptions: { ecmaVersion: 2020, globals: globals.browser },
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
			camelcase: "error",
			"capitalized-comments": ["error", "never"],
			"consistent-return": "error",
			curly: "error",
			"dot-notation": "error",
			"init-declarations": ["error", "always"],
			"no-console": ["error", { allow: ["warn", "error"] }],
		},
	},
]);
