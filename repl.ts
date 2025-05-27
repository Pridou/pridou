import Parser from "./src/parser.ts";
import { evaluate } from "./src/interpreter.ts";
import Environment from "./src/environment.ts";
import {
	InterpreterValueType,
	type ASTProgram,
	type InterpreterBoolean,
	type InterpreterNumber,
} from "./types/index.ts";

import { tokenize } from "./src/lexer";

((): void => {
	const parser: Parser = new Parser();
	const environment: Environment = new Environment();

/* 	environment.addVariable("x", <InterpreterNumber>{
		type: InterpreterValueType.Number,
		value: 5,
	}, true);

	environment.addVariable("y", <InterpreterBoolean>{
		type: InterpreterValueType.Boolean,
		value: false,
	}, true);

	environment.addVariable("z", <InterpreterBoolean>{
		type: InterpreterValueType.Boolean,
		value: true,
	}, true); */

	// Bun.file("./src/demos/index.pri").text().then(v => console.log(parser.toAST(v)));

console.log(tokenize('const x = "bonjour"; let y = 3 ;'));

return;
	while (true) {
		const input: string | null = prompt();

		if (!input) {
			process.exit(0);
		}

		const program: ASTProgram = parser.toAST(input);

		console.log(JSON.stringify(program, null, 4));
		console.log(JSON.stringify(evaluate(program, environment), null, 4));
	}
})();
