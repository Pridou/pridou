import {type LexerToken, LexerTokenType} from "@/types";

import {InvalidTokenError} from "@/src/errs";
import {isAlpha, isNumber} from "@/src/utils";

function toToken(type: LexerTokenType, value?: string): LexerToken {
	if (!value && value !== "") {
		throw new InvalidTokenError("Invalid or missing token value");
	}

	return { type, value };
}

const reservedKeywords: { [key: string]: LexerTokenType } = {
	const: LexerTokenType.Const,
	function: LexerTokenType.Function,
	let: LexerTokenType.Let,
};

// TODO: Support unicode and hex
const canBeSkippedValues: Set<string> = new Set<string>([
	" ",
	"\0",
	"\b",
	"\f",
	"\n",
	"\r",
	"\t",
	"\v",
	"\\",
]);

function shouldBeSkipped(value: string): boolean {
	return canBeSkippedValues.has(value);
}

export function tokenize(sourceCode: string): LexerToken[] {
	const tokens: LexerToken[] = [];
	const source: string[] = <string[]>sourceCode.split("");

	let temporaryString: string = "";
	let isBuildingString: boolean = false;

	while (source.length > 0) {
		switch (source[0]) {
			case "'":
			case '"':
				source.shift();

				if (isBuildingString) {
					tokens.push(toToken(LexerTokenType.String, temporaryString));
					temporaryString = "";
				}

				isBuildingString = !isBuildingString;

				break;

			case "=":
				tokens.push(toToken(LexerTokenType.Equals, source.shift()));
				break;
			case "%":
			case "*":
			case "+":
			case "-":
			case "/":
				tokens.push(toToken(LexerTokenType.BinaryOperator, source.shift()));
				break;
			case ",":
				tokens.push(toToken(LexerTokenType.Comma, source.shift()));
				break;
			case ".":
				tokens.push(toToken(LexerTokenType.Dot, source.shift()));
				break;
			case ":":
				tokens.push(toToken(LexerTokenType.Colon, source.shift()));
				break;
			case ";":
				tokens.push(toToken(LexerTokenType.Semicolon, source.shift()));
				break;
			case "(":
				tokens.push(toToken(LexerTokenType.OpeningParenthesis, source.shift()));
				break;
			case ")":
				tokens.push(toToken(LexerTokenType.ClosingParenthesis, source.shift()));
				break;
			case "{":
				tokens.push(
					toToken(LexerTokenType.OpeningCurlyBracket, source.shift()),
				);
				break;
			case "}":
				tokens.push(
					toToken(LexerTokenType.ClosingCurlyBracket, source.shift()),
				);
				break;
			case "[":
				tokens.push(
					toToken(LexerTokenType.OpeningSquareBracket, source.shift()),
				);
				break;
			case "]":
				tokens.push(
					toToken(LexerTokenType.ClosingSquareBracket, source.shift()),
				);
				break;
			default:
				if (isBuildingString) {
					temporaryString += source.shift();

					break;
				}

				if (isAlpha(source[0])) {
					let alpha: string = "";

					while (source.length > 0 && isAlpha(source[0])) {
						alpha += source.shift();
					}

					tokens.push(
						toToken(reservedKeywords[alpha] ?? LexerTokenType.Alpha, alpha),
					);

					break;
				}

				if (isNumber(source[0])) {
					let number: string = "";

					while (source.length > 0 && (isNumber(source[0]) || source[0] === ".")) {
						if (!(source[0] === "." && number.includes("."))) {
							number += source.shift();
						}
					}

					tokens.push(toToken(LexerTokenType.Number, number));
					break;
				}

				if (shouldBeSkipped(source[0])) {
					source.shift();
					break;
				}

				throw new InvalidTokenError(`Unrecognized token: '${source[0]}'`);
		}
	}

	tokens.push(toToken(LexerTokenType.EOF, LexerTokenType.EOF.toString()));

	return tokens;
}
