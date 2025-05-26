import { LexerTokenType, type LexerToken } from "@/types";
import config from "./config";
import { InvalidTokenError } from "@/src/errs";
import { isAlpha, isNumber } from "@/src/utils";

function toToken(type: LexerTokenType, value?: string): LexerToken {
	if (!value) {
		throw new InvalidTokenError("Invalid or missing token value");
	}

	return { type, value };
}

const reservedKeywords: { [key: string]: LexerTokenType } = {
	let: LexerTokenType.Let,
	const: LexerTokenType.Const,
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
	"'",
	'"',
	"\\",
]);

function shouldBeSkipped(value: string): boolean {
	return canBeSkippedValues.has(value);
}

export function tokenize(sourceCode: string): LexerToken[] {
	const tokens: LexerToken[] = [];
	const source: string[] = <string[]>sourceCode.split("");

	while (source.length > 0) {
		const token = source[0]
		const keys = Object.keys(config);
		const type = config[token];
		if(keys.includes(token)){
			tokens.push(toToken(type, token));
			continue;
		}
				if (isAlpha(source[0])) {
					let alpha: string = "";

					while (source.length > 0 && isAlpha(source[0])) {
						alpha += source.shift();
					}

					tokens.push(toToken(reservedKeywords[alpha] ?? LexerTokenType.Alpha, alpha));

					break;
				}

				if (isNumber(source[0])) {
					let number: string = "";

					while (source.length > 0 && isNumber(source[0])) {
						number += source.shift();
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

	tokens.push(toToken(LexerTokenType.EOF, LexerTokenType.EOF.toString()));

	return tokens;
}



		