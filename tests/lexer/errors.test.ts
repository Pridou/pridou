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

    expect(singleQuote).toThrow(error);
    expect(doubleQuote).toThrow(error);
  });

  it.each(invalidInputs)('Unknown character error for "%s"', (input) => {
    const error = new InvalidTokenError(`Invalid identifier: ${input}`);

    expect(() => lexer.toTokens(input)).toThrow(error);
  });
});
