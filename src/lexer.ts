import { type LexerToken, LexerTokenType } from "@/types";

import { InvalidTokenError } from "@/errors";
import { isAlpha, isNumber } from "@/utils";

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
  "\\",
]);

function toToken(type: LexerTokenType, value?: string): LexerToken {
  if (!value) {
    throw new InvalidTokenError("Invalid or missing token value");
  }

  return { type, value };
}

function shouldBeSkipped(value: string): boolean {
  return canBeSkippedValues.has(value);
}

export function tokenize(sourceCode: string): LexerToken[] {
  const tokens: LexerToken[] = [];
  const source: string[] = <string[]>sourceCode.split("");
  let str = "";
  let isBuildStr = false;
  let stringDelimiter: string | null = null;

  while (source.length > 0) {
    switch (source[0]) {
      case "'":
      case '"': {
        const currentDelimiter = source.shift() ?? null;

        if (isBuildStr && currentDelimiter !== stringDelimiter) {
          str += currentDelimiter;
          continue;
        }

        if (isBuildStr) {
          tokens.push(toToken(LexerTokenType.String, str));
          str = "";
          stringDelimiter = null;
        } else {
          stringDelimiter = currentDelimiter;
        }

        isBuildStr = !isBuildStr;

        break;
      }

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
        if (isBuildStr) {
          str += source.shift();

          break;
        }

        if (isAlpha(source[0])) {
          let alpha = "";

          while (source.length > 0 && isAlpha(source[0])) {
            alpha += source.shift();
          }

          tokens.push(
            toToken(reservedKeywords[alpha] ?? LexerTokenType.Alpha, alpha),
          );

          break;
        }

        if (isNumber(source[0])) {
          let number = "";

          while (source.length > 0 && isNumber(source[0])) {
            number += source.shift();
          }
          if (source[0] === ".") {
            number += source.shift();

            while (source.length > 0 && isNumber(source[0])) {
              number += source.shift();
            }
            tokens.push(toToken(LexerTokenType.Float, number));
            break;
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
