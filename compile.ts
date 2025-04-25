import { file, write } from "bun";
import { parseJSX } from "./src";
import { JSXEl2Token } from "./sample/transpiler";

const source = await file(process.argv[2]??"").text();

const result = parseJSX(source, JSXEl2Token);

write(process.argv[3]??"", result);
