import { describe, expect, it } from "vitest";
import { tokenize } from "../../lib";
import { type LexerToken, LexerTokenType } from "../../lib/types";

const EOF: LexerToken = {
  type: LexerTokenType.EOF,
  value: "EOF",
};

describe("BinaryOperations", () => {
  it("Equals", () => {
    const equals = tokenize("1 == 1");
    const expected: LexerToken[] = [
      {
        type: LexerTokenType.Number,
        value: "1",
      },
      {
        type: LexerTokenType.Equals,
        value: "=",
      },
      {
        type: LexerTokenType.Equals,
        value: "=",
      },
      {
        type: LexerTokenType.Number,
        value: "1",
      },
      EOF,
    ];

    expect(equals).toStrictEqual(expected);
  });

  it("Add Numbers", () => {
    const add = tokenize("21 + 9999");
    const expected: LexerToken[] = [
      {
        type: LexerTokenType.Number,
        value: "21",
      },
      {
        type: LexerTokenType.BinaryOperator,
        value: "+",
      },
      {
        type: LexerTokenType.Number,
        value: "9999",
      },
      EOF,
    ];

    expect(add).toStrictEqual(expected);
  });

  it("Add Strings", () => {
    const addStr = tokenize('"Im\' " + "testing"');
    const expected: LexerToken[] = [
      {
        type: LexerTokenType.String,
        value: "Im' ",
      },
      {
        type: LexerTokenType.BinaryOperator,
        value: "+",
      },
      {
        type: LexerTokenType.String,
        value: "testing",
      },
      EOF,
    ];

    expect(addStr).toStrictEqual(expected);
  });
});
