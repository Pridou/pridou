import { describe, expect, it } from "vitest";
import Lexer from "../../lib";
import { type LexerToken, LexerTokenType } from "../../lib/types";

const EOF: LexerToken = {
  type: LexerTokenType.EndOfFile,
  value: "EndOfFile",
};

const lexer = new Lexer();

describe("Statements", () => {
  it("");
});
