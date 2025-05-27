import { describe, expect, it } from "vitest";
import Lexer from "../../lib";
import { InvalidTokenError } from "../../lib/errors";

const lexer = new Lexer();

describe("Errors", () => {
  it("String error", () => {
    const singleQuote = () => lexer.toTokens("'hello");
    const doubleQuote = () => lexer.toTokens('"hello');

    expect(singleQuote).toThrowError(InvalidTokenError);
    expect(doubleQuote).toThrowError(InvalidTokenError);
  });
});
