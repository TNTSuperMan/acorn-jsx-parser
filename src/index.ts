import { Parser, type Expression } from "acorn";
import jsx from "acorn-jsx";
import { generate } from "escodegen";
import type { JSXElement } from "./jsxType";

const jsxParser = Parser.extend(jsx());

export const parseJSX = (code: string, transpile: (jsx: JSXElement) => Expression) => {
    
    const ast = jsxParser.parse(code, {ecmaVersion: "latest", sourceType: "module"});

    const json = JSON.stringify(ast, (_, v)=>
        v && typeof v == "object" && v.type == "JSXElement" ?
            transpile(v) : v
    )

    const transpiledAST = JSON.parse(json);

    const result = generate(transpiledAST);
    return result;
}
