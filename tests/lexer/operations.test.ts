import { describe, expect, it } from "vitest";
import Lexer from "../../src/lexer";
import { T, tokens } from "../utils/lexer";

const lexer = new Lexer();

describe("Assignment and declarations", () => {
  it("Immut declaration", () => {
    expect(lexer.toTokens("const test;")).toStrictEqual(
      tokens([T.Const, "const"], [T.Identifier, "test"], [T.Semicolon, ";"]),
    );
  });

  it("Mut declaration", () => {
    expect(lexer.toTokens("let test;")).toStrictEqual(
      tokens([T.Let, "let"], [T.Identifier, "test"], [T.Semicolon, ";"]),
    );
  });

  it("Initialize immut", () => {
    const result = lexer.toTokens("const x = 5;");
    const expected = tokens(
      [T.Const, "const"],
      [T.Identifier, "x"],
      [T.Equals, "="],
      [T.Number, "5"],
      [T.Semicolon, ";"],
    );

    expect(result).toStrictEqual(expected);
  });

  it("Initialize mut", () => {
    const result = lexer.toTokens("let y = 10;");
    const expected = tokens(
      [T.Let, "let"],
      [T.Identifier, "y"],
      [T.Equals, "="],
      [T.Number, "10"],
      [T.Semicolon, ";"],
    );

    expect(result).toStrictEqual(expected);
  });
});

describe("BinaryOperations", () => {
  it("Greater than", () => {
    expect(lexer.toTokens("102 > 107")).toStrictEqual(
      tokens([T.Number, "102"], [T.ComparisonOperator, ">"], [T.Number, "107"]),
    );

    expect(lexer.toTokens("107 >= 107")).toStrictEqual(
      tokens(
        [T.Number, "107"],
        [T.ComparisonOperator, ">="],
        [T.Number, "107"],
      ),
    );
  });

  it("Lower than", () => {
    expect(lexer.toTokens("102 < 107")).toStrictEqual(
      tokens([T.Number, "102"], [T.ComparisonOperator, "<"], [T.Number, "107"]),
    );

    expect(lexer.toTokens("107 <= 107")).toStrictEqual(
      tokens(
        [T.Number, "107"],
        [T.ComparisonOperator, "<="],
        [T.Number, "107"],
      ),
    );
  });

  it.todo("And", () => {
    expect(lexer.toTokens("false && true")).toStrictEqual(
      tokens(
        [T.Identifier, "false"],
        [T.ComparisonOperator, "&&"],
        [T.Identifier, "true"],
      ),
    );
  });

  it.todo("Or", () => {
    expect(lexer.toTokens("false || true")).toStrictEqual(
      tokens(
        [T.Identifier, "false"],
        [T.ComparisonOperator, "||"],
        [T.Identifier, "true"],
      ),
    );
  });

  it("Equal", () => {
    expect(lexer.toTokens("x == 5")).toStrictEqual(
      tokens(
        [T.Identifier, "x"],
        [T.ComparisonOperator, "=="],
        [T.Number, "5"],
      ),
    );
  });

  it("Not equal", () => {
    expect(lexer.toTokens("'hello' != 5")).toStrictEqual(
      tokens(
        [T.String, "hello"],
        [T.ComparisonOperator, "!="],
        [T.Number, "5"],
      ),
    );
  });

  it("Add Numbers", () => {
    expect(lexer.toTokens("21 + 9999")).toStrictEqual(
      tokens([T.Number, "21"], [T.BinaryOperator, "+"], [T.Number, "9999"]),
    );
  });

  it("Multiply Numbers", () => {
    expect(lexer.toTokens("7 * 8")).toStrictEqual(
      tokens([T.Number, "7"], [T.BinaryOperator, "*"], [T.Number, "8"]),
    );
  });

  it("Divide Numbers", () => {
    expect(lexer.toTokens("100 / 4")).toStrictEqual(
      tokens([T.Number, "100"], [T.BinaryOperator, "/"], [T.Number, "4"]),
    );
  });

  it("Add Strings", () => {
    expect(lexer.toTokens('"Im\' " + "testing"')).toStrictEqual(
      tokens(
        [T.String, "Im' "],
        [T.BinaryOperator, "+"],
        [T.String, "testing"],
      ),
    );
  });
});
