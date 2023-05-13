import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as tsconfig from "./tsconfig.json";

const alias = {};
for (const key in tsconfig.compilerOptions.paths) {
	alias[key] = __dirname + "/" + tsconfig.compilerOptions.baseUrl + "/" + tsconfig.compilerOptions.paths[key][0].replace("/*", "");
}
console.log(alias);

// https://vitejs.dev/config/
export default defineConfig({
  	plugins: [react()],
	resolve: {
		alias
	}
})
