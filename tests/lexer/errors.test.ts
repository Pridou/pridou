import { describe, expect, it } from "vitest";
import { InvalidTokenError } from "../../src/errors";
import Lexer from "../../src/lexer";

const invalidInputs = ["@", "#", "?", "$"];

describe("Errors", () => {
  it("Invalid string error", () => {
    const a = new Lexer();
    const b = new Lexer();
    const singleQuote = () => a.toTokens("'hello");
    const doubleQuote = () => b.toTokens('"hello');
    const error = new InvalidTokenError("Unterminated string literal.");

    expect(singleQuote).toThrow(error);
    expect(doubleQuote).toThrow(error);
  });

  it.each(invalidInputs)('Unknown character error for "%s"', (input) => {
    const a = new Lexer();
    const error = new InvalidTokenError(`Invalid token ${input} was found.`);

    expect(() => a.toTokens(input)).toThrow(error);
  });
});
