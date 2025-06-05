// TODO: Maybe count boundaries (i.e. { { ... } }, /* /* ... */ */) for nesting

import { type LexerToken, LexerTokenType } from "@/types/lexer";

import {
  CLASSIC_TOKENS,
  RESERVED_TOKENS,
  SKIPPED_TOKENS,
} from "@/config/lexer";
import { isIdentifier, isNumber } from "@/utils";

import InvalidTokenError from "@/errors/InvalidTokenError";

export default class Lexer {
  #source: string[] = [];
  #tokens: LexerToken[] = [];

  private peek(offset = 0): string {
    return this.#source[offset];
  }

  private save(type: LexerTokenType, value: string): void {
    this.#tokens.push({ type, value });
  }

  private shift(offset = 1): string {
    let shift = "";

    for (let i = 0; i < offset; i++) {
      shift += this.#source.shift();
    }

    return shift;
  }

  public toTokens(sourceCode: string): LexerToken[] {
    this.#source = sourceCode.split("");

    while (this.#source.length > 0) {
      // Parse one-line comments
      if (this.peek() === "/" && this.peek(1) === "/") {
        while (this.peek() !== "\n") {
          this.shift();
        }

        // Shift "\n"
        this.shift();

        continue;
      }

      // Parse many-lines comments
      if (this.peek() === "/" && this.peek(1) === "*") {
        // Shift "/*"
        this.shift(2);

        while (this.peek() !== "*" && this.peek(1) !== "/") {
          this.shift();
        }

        // Shift "*/"
        this.shift(2);

        continue;
      }

      // Parse numbers
      if (isNumber(this.peek())) {
        let number: string = this.shift();

        while (isNumber(this.peek())) {
          number += this.shift();
        }

        if (this.peek() === LexerTokenType.Dot) {
          number += this.shift();
        }

        while (isNumber(this.peek())) {
          number += this.shift();
        }

        this.save(LexerTokenType.Number, number);

        continue;
      }

      // Parse identifiers
      if (isIdentifier(this.peek())) {
        let identifier: string = this.shift();

        while (isIdentifier(this.peek())) {
          identifier += this.shift();
        }

        this.save(
          RESERVED_TOKENS.get(identifier) ?? LexerTokenType.Identifier,
          identifier,
        );

        continue;
      }

      // Parse skipped
      if (SKIPPED_TOKENS.has(this.peek())) {
        this.shift();

        continue;
      }

      // Parse classics
      if (CLASSIC_TOKENS.has(this.peek())) {
        this.save(
          <LexerTokenType>CLASSIC_TOKENS.get(this.peek()),
          this.shift(),
        );

        continue;
      }

      let token = "";

      switch (this.peek()) {
        // Parse strings
        case LexerTokenType.SingleQuote:
        case LexerTokenType.DoubleQuote: {
          let string = "";
          const quote = this.shift();

          while (this.#source.length > 0 && this.peek() !== quote) {
            string += this.shift();
          }

          if (this.#source.length === 0) {
            throw new InvalidTokenError("Unterminated string literal.");
          }

          this.shift();

          this.save(LexerTokenType.String, string);

          break;
        }
        case LexerTokenType.Modulus:
        case LexerTokenType.Multiply:
        case LexerTokenType.Divide:
          token = this.shift();

          if (this.peek() === LexerTokenType.Assignment) {
            token += this.shift();
          }

          this.save(<LexerTokenType>token, token);

          break;
        case LexerTokenType.Plus:
          token = this.shift();

          if (this.peek() === LexerTokenType.Plus) {
            this.save(LexerTokenType.Increment, token + this.shift());

            break;
          }

          if (this.peek() === LexerTokenType.Assignment) {
            this.save(LexerTokenType.Assignment, token + this.shift());

            break;
          }

          if (isNumber(this.peek())) {
            while (isNumber(this.peek())) {
              token += this.shift();
            }

            if (this.peek() === LexerTokenType.Dot) {
              token += this.shift();
            }

            while (isNumber(this.peek())) {
              token += this.shift();
            }

            this.save(LexerTokenType.Number, token);

            break;
          }

          // TODO: Add support for identifiers (i.e. +<identifier>)

          this.save(LexerTokenType.Plus, token);

          break;
        case LexerTokenType.Minus:
          token = this.shift();

          if (this.peek() === LexerTokenType.Minus) {
            this.save(LexerTokenType.Decrement, token + this.shift());

            break;
          }

          if (this.peek() === LexerTokenType.Assignment) {
            this.save(LexerTokenType.Assignment, token + this.shift());

            break;
          }

          if (isNumber(this.peek())) {
            while (isNumber(this.peek())) {
              token += this.shift();
            }

            if (this.peek() === LexerTokenType.Dot) {
              token += this.shift();
            }

            while (isNumber(this.peek())) {
              token += this.shift();
            }

            this.save(LexerTokenType.Number, token);

            break;
          }

          // TODO: Add support for identifiers (i.e. -<identifier>)

          this.save(LexerTokenType.Minus, token);

          break;
        case LexerTokenType.Assignment:
          token = this.shift();

          if (this.peek() === LexerTokenType.Assignment) {
            this.save(LexerTokenType.Equality, token + this.shift());

            break;
          }

          this.save(LexerTokenType.Assignment, token);

          break;
        case LexerTokenType.LessThan:
        case LexerTokenType.GreaterThan:
          token = this.shift();

          if (this.peek() === LexerTokenType.Assignment) {
            token += this.shift();

            this.save(<LexerTokenType>token, token);

            break;
          }

          this.save(<LexerTokenType>token, token);

          break;
        default:
          throw new InvalidTokenError(
            `Invalid token ${this.peek()} was found.`,
          );
      }
    }

    return this.#tokens;
  }
}
