import { describe, expect, it } from "vitest";
import Lexer from "../../src/lexer";
import { T, t, tokens } from "../utils/lexer";
describe("Statements", () => {
  //TODO: fix this test
  it.todo("If statement", () => {
    const a = new Lexer();
    const input = "if(1 == 4) {}";
    const expected = [
      t(T.Identifier, "if"),
      t(T.LeftRoundBracket, "("),
      t(T.Number, "1"),
      t(T.Equality, "=="),
      t(T.Number, "4"),
      t(T.RightRoundBracket, ")"),
      t(T.LeftCurlyBracket, "{"),
      t(T.RightCurlyBracket, "}"),
    ];

    expect(a.toTokens(input)).toStrictEqual(expected);
  });

  //TODO: fix this test
  it.todo("If Else statement", () => {
    const a = new Lexer();
    const input = "if(1 == 4) {} else {}";
    const expected = [
      t(T.Identifier, "if"),
      t(T.LeftRoundBracket, "("),
      t(T.Number, "1"),
      t(T.Equality, "=="),
      t(T.Number, "4"),
      t(T.RightRoundBracket, ")"),
      t(T.LeftCurlyBracket, "{"),
      t(T.RightCurlyBracket, "}"),
      t(T.Identifier, "else"),
      t(T.LeftCurlyBracket, "{"),
      t(T.RightCurlyBracket, "}"),
    ];

    expect(a.toTokens(input)).toStrictEqual(expected);
  });

  it("For loop", () => {
    const a = new Lexer();
    const input = "for(mut a = 0; a < 4; a = a + 1) {a}";
    const expected = [
      t(T.For, "for"),
      t(T.LeftRoundBracket, "("),
      t(T.Mut, "mut"),
      t(T.Identifier, "a"),
      t(T.Assignment, "="),
      t(T.Number, "0"),
      t(T.Semicolon, ";"),
      t(T.Identifier, "a"),
      t(T.LessThan, "<"),
      t(T.Number, "4"),
      t(T.Semicolon, ";"),
      t(T.Identifier, "a"),
      t(T.Assignment, "="),
      t(T.Identifier, "a"),
      t(T.Plus, "+"),
      t(T.Number, "1"),
      t(T.RightRoundBracket, ")"),
      t(T.LeftCurlyBracket, "{"),
      t(T.Identifier, "a"),
      t(T.RightCurlyBracket, "}"),
    ];

    expect(a.toTokens(input)).toStrictEqual(expected);
  });

  it("While loop", () => {
    const a = new Lexer();
    const input = "wil(true) {fix a = 2;}";
    const expected = [
      t(T.Wil, "wil"),
      t(T.LeftRoundBracket, "("),
      t(T.Identifier, "true"),
      t(T.RightRoundBracket, ")"),
      t(T.LeftCurlyBracket, "{"),
      t(T.Fix, "fix"),
      t(T.Identifier, "a"),
      t(T.Assignment, "="),
      t(T.Number, "2"),
      t(T.Semicolon, ";"),
      t(T.RightCurlyBracket, "}"),
    ];

    expect(a.toTokens(input)).toStrictEqual(expected);
  });

  //TODO: fix this test
  it.todo("Switch case", () => {
    const a = new Lexer();
    const input = "switch (10) { case 10: break; default: break;}";
    const expected = [
      t(T.Identifier, "switch"),
      t(T.LeftRoundBracket, "("),
      t(T.Number, "10"),
      t(T.RightRoundBracket, ")"),
      t(T.LeftCurlyBracket, "{"),
      t(T.Identifier, "case"),
      t(T.Number, "10"),
      t(T.Colon, ":"),
      t(T.Identifier, "break"),
      t(T.Semicolon, ";"),
      t(T.Identifier, "default"),
      t(T.Colon, ":"),
      t(T.Identifier, "break"),
      t(T.Colon, ":"),
      t(T.RightCurlyBracket, "}"),
    ];

    expect(a.toTokens(input)).toStrictEqual(expected);
  });
});

describe("Variables", () => {
  it("Constant (fix)", () => {
    const a = new Lexer();
    expect(a.toTokens("fix")).toStrictEqual(tokens([T.Fix, "fix"]));
  });

  it("Variable (mut)", () => {
    const a = new Lexer();
    expect(a.toTokens("mut")).toStrictEqual(tokens([T.Mut, "mut"]));
  });
});
