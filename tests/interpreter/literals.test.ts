import { describe, expect, it } from "vitest";
import Interpreter from "../../lib/interpreter";
import Lexer from "../../lib/interpreter";
import { type LexerToken, LexerTokenType } from "../../lib/types";
import Parser from "../../src/parser";

const EOF: LexerToken = {
  type: LexerTokenType.EndOfFile,
  value: "EndOfFile",
};

const lexer = new Lexer();
const interpreter = new Interpreter();

//TODO: Interpreter tests
describe("Literals", () => {});
