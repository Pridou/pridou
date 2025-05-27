import { describe, expect, it } from "vitest";
import { InvalidTokenError } from "../../src/errors";
import Lexer from "../../src/lexer";

const lexer = new Lexer();

const invalidInputs = ["@", "#", "?", "$"];

describe("Errors", () => {
  it("Invalid string error", () => {
    const singleQuote = () => lexer.toTokens("'hello");
    const doubleQuote = () => lexer.toTokens('"hello');
    const error = new InvalidTokenError("Unterminated string literal.");

    expect(singleQuote).toThrowError(error);
    expect(doubleQuote).toThrowError(error);
  });

  it.each(invalidInputs)('Unknown character error for "%s"', (input) => {
    expect(() => lexer.toTokens(input)).toThrowError(InvalidTokenError);
    expect(() => lexer.toTokens(input)).toThrowError(
      `Invalid identifier: ${input}`,
    );
  });
});
