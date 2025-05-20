import { type Token, TokenType } from "@/types";

import { TokenError } from "@/src/exceptions/TokenError";

function toToken(type: TokenType, value?: string): Token {
	if (!value) {
		throw new TokenError("Invalid token : " + value);
	}

	return { type, value };
}

function isAlpha(value: string): boolean {
	return /^[A-Z]$/i.test(value);
}

function isNumber(value: string): boolean {
	return /^[0-9]$/.test(value);
}

const canBeSkippedValues: string[] = [" ", "\n", "\t"];

function shouldBeSkipped(value: string): boolean {
	return canBeSkippedValues.includes(value);
}

const reservedKeywordsMap: { [key: string]: TokenType } = {
	let: TokenType.Let,
	const: TokenType.Const,
};

function tokenize(sourceCode: string): Token[] {
	const tokens: Token[] = [];
	const source: string[] = sourceCode.split("");

	while (source.length > 0) {
		switch (source[0]) {
			case "=":
				tokens.push(toToken(TokenType.Equals, source.shift()));
				break;
			case "*":
			case "+":
			case "-":
			case "/":
				tokens.push(toToken(TokenType.BinaryOperator, source.shift()));
				break;
			case "(":
				tokens.push(toToken(TokenType.OpeningParenthesis, source.shift()));
				break;
			case ")":
				tokens.push(toToken(TokenType.ClosingParenthesis, source.shift()));
				break;
			default:
				if (isAlpha(source[0])) {
					let a: string = "";

					while (source.length > 0 && isAlpha(source[0])) {
						a += source.shift();
					}

					tokens.push(toToken(reservedKeywordsMap[a] ?? TokenType.Alpha, a));

					break;
				}

				if (isNumber(source[0])) {
					let n: string = "";

					while (source.length > 0 && isNumber(source[0])) {
						n += source.shift();
					}

					tokens.push(toToken(TokenType.Number, n));

					break;
				}

				if (shouldBeSkipped(source[0])) {
					source.shift();

					break;
				}

				throw new TokenError("Invalid token : " + source[0]);
		}
	}

	return tokens;
}

console.log(tokenize("const x = 5"));
