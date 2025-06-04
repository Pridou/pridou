import { describe, expect, it } from "vitest";
import Lexer from "../../src/lexer";
import { T, tokens } from "../utils/lexer";

describe("Assignment and declarations", () => {
  it("Immut declaration (fix)", () => {
    const a = new Lexer();
    expect(a.toTokens("fix test;")).toStrictEqual(
      tokens([T.Fix, "fix"], [T.Identifier, "test"], [T.Semicolon, ";"]),
    );
  });

  it("Mut declaration", () => {
    const a = new Lexer();
    expect(a.toTokens("mut test;")).toStrictEqual(
      tokens([T.Mut, "mut"], [T.Identifier, "test"], [T.Semicolon, ";"]),
    );
  });

  it("Initialize immut", () => {
    const a = new Lexer();
    const result = a.toTokens("fix x = 5;");
    const expected = tokens(
      [T.Fix, "fix"],
      [T.Identifier, "x"],
      [T.Assignment, "="],
      [T.Number, "5"],
      [T.Semicolon, ";"],
    );

    expect(result).toStrictEqual(expected);
  });

  it("Initialize mut", () => {
    const a = new Lexer();
    const result = a.toTokens("mut y = 10;");
    const expected = tokens(
      [T.Mut, "mut"],
      [T.Identifier, "y"],
      [T.Assignment, "="],
      [T.Number, "10"],
      [T.Semicolon, ";"],
    );

    expect(result).toStrictEqual(expected);
  });
});

describe("BinaryOperations", () => {
  it("Greater than", () => {
    const a = new Lexer();
    const b = new Lexer();

    expect(a.toTokens("102 > 107")).toStrictEqual(
      tokens([T.Number, "102"], [T.GreaterThan, ">"], [T.Number, "107"]),
    );

    expect(b.toTokens("107 >= 107")).toStrictEqual(
      tokens(
        [T.Number, "107"],
        [T.GreaterThanOrEqual, ">="],
        [T.Number, "107"],
      ),
    );
  });

  it("Lower than", () => {
    const a = new Lexer();
    const b = new Lexer();

    expect(a.toTokens("102 < 107")).toStrictEqual(
      tokens([T.Number, "102"], [T.LessThan, "<"], [T.Number, "107"]),
    );

    expect(b.toTokens("107 <= 107")).toStrictEqual(
      tokens([T.Number, "107"], [T.LessThanOrEqual, "<="], [T.Number, "107"]),
    );
  });

  //TODO: fix this test
  it.todo("And", () => {
    const a = new Lexer();
    expect(a.toTokens("false && true")).toStrictEqual(
      tokens(
        [T.Identifier, "false"],
        [T.Identifier, "&&"],
        [T.Identifier, "true"],
      ),
    );
  });

  //TODO: fix this test
  it.todo("Or", () => {
    const a = new Lexer();
    expect(a.toTokens("false || true")).toStrictEqual(
      tokens(
        [T.Identifier, "false"],
        [T.Identifier, "||"],
        [T.Identifier, "true"],
      ),
    );
  });

  it("Equal", () => {
    const a = new Lexer();
    expect(a.toTokens("x == 5")).toStrictEqual(
      tokens([T.Identifier, "x"], [T.Equality, "=="], [T.Number, "5"]),
    );
  });

  //TODO: fix this test
  it.todo("Not equal", () => {
    const a = new Lexer();
    expect(a.toTokens("'hello' != 5")).toStrictEqual(
      tokens([T.String, "hello"], [T.Equality, "!="], [T.Number, "5"]),
    );
  });

  it("Increment number", () => {
    const a = new Lexer();
    expect(a.toTokens("10++")).toStrictEqual(
      tokens([T.Number, "10"], [T.Increment, "++"]),
    );
  });

  it("Decrement number", () => {
    const a = new Lexer();
    expect(a.toTokens("10--")).toStrictEqual(
      tokens([T.Number, "10"], [T.Decrement, "--"]),
    );
  });

  it("Increment number", () => {
    const a = new Lexer();
    expect(a.toTokens("10++")).toStrictEqual(
      tokens([T.Number, "10"], [T.Increment, "++"]),
    );
  });

  it("Add Numbers", () => {
    const a = new Lexer();
    expect(a.toTokens("21 + 9999")).toStrictEqual(
      tokens([T.Number, "21"], [T.Plus, "+"], [T.Number, "9999"]),
    );
  });

  it("Multiply Numbers", () => {
    const a = new Lexer();
    expect(a.toTokens("7 * 8")).toStrictEqual(
      tokens([T.Number, "7"], [T.Multiply, "*"], [T.Number, "8"]),
    );
  });

  it("Divide Numbers", () => {
    const a = new Lexer();
    expect(a.toTokens("100 / 4")).toStrictEqual(
      tokens([T.Number, "100"], [T.Divide, "/"], [T.Number, "4"]),
    );
  });

  it("Add Strings", () => {
    const a = new Lexer();
    expect(a.toTokens('"Im\' " + "testing"')).toStrictEqual(
      tokens([T.String, "Im' "], [T.Plus, "+"], [T.String, "testing"]),
    );
  });
});
