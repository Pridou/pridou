import { InvalidTokenError } from "@/errors";

import { isIdentifier, isNumber } from "@/utils";

import { type LexerToken, LexerTokenType } from "@/types/lexer";

const BASIC_TOKENS: Map<string, LexerTokenType> = new Map([
  ["%", LexerTokenType.BinaryOperator],
  ["*", LexerTokenType.BinaryOperator],
  ["+", LexerTokenType.BinaryOperator],
  ["-", LexerTokenType.BinaryOperator],
  ["/", LexerTokenType.BinaryOperator],
  [".", LexerTokenType.Dot],
  [",", LexerTokenType.Comma],
  [":", LexerTokenType.Colon],
  [";", LexerTokenType.Semicolon],
  ["(", LexerTokenType.OpeningParenthesis],
  [")", LexerTokenType.ClosingParenthesis],
  ["{", LexerTokenType.OpeningCurlyBracket],
  ["}", LexerTokenType.ClosingCurlyBracket],
  ["[", LexerTokenType.OpeningSquareBracket],
  ["]", LexerTokenType.ClosingSquareBracket],
]);

const RESERVED_TOKENS: Map<string, LexerTokenType> = new Map([
  ["let", LexerTokenType.Let],
  ["const", LexerTokenType.Const],
  ["function", LexerTokenType.Function],
  ["return", LexerTokenType.Return],
]);

const SKIPPED_TOKENS: Set<string> = new Set([
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

export default class Lexer {
  private toToken(type: LexerTokenType, value: string): LexerToken {
    return { type, value };
  }

  public toTokens(sourceCode: string): LexerToken[] {
    const tokens: LexerToken[] = [];
    const source: string[] = sourceCode.split("");

    while (source.length > 0) {
      if (BASIC_TOKENS.has(source[0])) {
        tokens.push(
          this.toToken(
            <LexerTokenType>BASIC_TOKENS.get(source[0]),
            <string>source.shift(),
          ),
        );

        continue;
      }

      switch (source[0]) {
        case '"':
        case "'": {
          const quote = <string>source.shift();
          let string = "";

          while (source.length > 0 && source[0] !== quote) {
            string += source.shift();
          }

          if (source[0] !== quote) {
            throw new InvalidTokenError("Unterminated string literal.");
          }

          source.shift();

          tokens.push(this.toToken(LexerTokenType.String, string));

          break;
        }
        case "=":
          if (source[1] === "=") {
            source.shift();
            source.shift();

            tokens.push(this.toToken(LexerTokenType.ComparisonOperator, "=="));

            break;
          }

          tokens.push(
            this.toToken(LexerTokenType.Equals, <string>source.shift()),
          );

          break;
        case "!":
        case "<":
        case ">":
          if (source[1] === "=") {
            tokens.push(
              this.toToken(
                LexerTokenType.ComparisonOperator,
                `${source.shift()}=`,
              ),
            );

            source.shift();

            break;
          }

          tokens.push(
            this.toToken(
              LexerTokenType.ComparisonOperator,
              <string>source.shift(),
            ),
          );

          break;
        default:
          if (isNumber(source[0])) {
            let number = "";

            while (source.length > 0 && isNumber(source[0])) {
              number += source.shift();
            }

            if (source[0] === ".") {
              number += source.shift();

              if (isNumber(source[0])) {
                while (source.length > 0 && isNumber(source[0])) {
                  number += source.shift();
                }
              }
            }

            tokens.push(this.toToken(LexerTokenType.Number, number));

            break;
          }

          if (isIdentifier(source[0])) {
            let identifier = "";

            while (source.length > 0 && isIdentifier(source[0])) {
              identifier += source.shift();
            }

            tokens.push(
              this.toToken(
                RESERVED_TOKENS.get(identifier) ?? LexerTokenType.Identifier,
                identifier,
              ),
            );

            break;
          }

          if (SKIPPED_TOKENS.has(source[0])) {
            source.shift();

            break;
          }

          throw new InvalidTokenError(`Invalid identifier: ${source[0]}`);
      }
    }

    tokens.push(
      this.toToken(LexerTokenType.EndOfFile, LexerTokenType.EndOfFile),
    );

    return tokens;
  }
}
