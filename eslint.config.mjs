import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/rules-of-hooks": "off",
      "@typescript-eslint/no-explicit-any": "off"
    },
  },
];

overrides: [
    // já pode haver outros overrides
    {
      files: ["src/types/**/*.d.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]

export default eslintConfig;
