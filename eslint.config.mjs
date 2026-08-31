import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "public/uploads/**"],
  },
  ...coreWebVitals,
  ...typescript,
  {
    // eslint-plugin-react's "detect" breaks under ESLint 10 (getFilename removed);
    // pin the React version explicitly.
    settings: { react: { version: "19" } },
  },
];

export default eslintConfig;
