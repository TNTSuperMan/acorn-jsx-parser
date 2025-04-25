import type { CallExpression, Expression, Node, SpreadElement } from "acorn";
import type { JSXChild, JSXElement } from "../src/jsxType";

function JSXChild2Token(token: JSXChild): (Expression|SpreadElement)[]{
    switch(token.type){
        case "JSXElement": return [JSXEl2Token(token)];
        case "JSXExpressionContainer": return [token.expression];
        case "JSXFragment": return token.children.map(e=>JSXChild2Token(e)).flat();
        case "JSXText": return [{
            ...token,
            type: "Literal"
        }]
    }
}

export function JSXEl2Token(token: JSXElement): Expression{
    console.log(token.children.map(e=>JSXChild2Token(e)))
    const jsxT: CallExpression = {
        type: "CallExpression",
        callee: { ...token.openingElement.name, type: "Identifier" },
        arguments: token.children.map(e=>JSXChild2Token(e)).flat(),
        optional: false,
        start: token.start,
        end: token.end
    };
    token.openingElement.attributes.forEach(e=>{
        jsxT.callee = {
            type: "CallExpression",
            arguments: [e.value] as any as Expression[],
            optional: false,
            start: e.value.start,
            end: e.value.end,
            callee: {
                type: "MemberExpression",
                object: jsxT.callee,
                property: { ...e.name, type: "Identifier" },
                computed: false,
                optional: false,
                start: e.name.start,
                end: e.name.end
            }
        }
    })

    return jsxT;
}
