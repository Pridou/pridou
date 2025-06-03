import Lexer from "./src/Lexer";
import Parser from "./src/Parser";
import Interpreter from "./src/Interpreter";

(async (): Promise<void> => {
	const program =
		"fix x = 5 ; mut r = x + 2 ; fun add(a,b) { ret a + b * 2 ; } fix m = add(1,2) * 10 ; fix z = 1 > 2 ;";
	// const program: string = await Bun.file("../pridou-demo/index.pri").text();

	const lexer: Lexer = new Lexer();
	console.log(lexer.toTokens(program));

	const parser: Parser = new Parser();
	console.log(parser.sourceCodeToAST(program));

	const interpreter: Interpreter = new Interpreter();
	interpreter.run(program);
})();
