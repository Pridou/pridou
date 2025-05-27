import { describe, expect, it } from "vitest";
import Lexer from "../../src/lexer";
import { T, tokens } from "../utils/lexer";

const lexer = new Lexer();

describe("Variables", () => {
  it("Constant (immut)", () => {
    expect(lexer.toTokens("const")).toStrictEqual(tokens([T.Const, "const"]));
  });

  it("Variable (mut)", () => {
    expect(lexer.toTokens("let")).toStrictEqual(tokens([T.Let, "let"]));
  });
});

describe("Assignment and declarations", () => {
  it("Constant declaration (immut)", () => {
    expect(lexer.toTokens("const test;")).toStrictEqual(
      tokens([T.Const, "const"], [T.Identifier, "test"], [T.Semicolon, ";"]),
    );
  });

  it("Variable declaration (mut)", () => {
    expect(lexer.toTokens("let test;")).toStrictEqual(
      tokens([T.Let, "let"], [T.Identifier, "test"], [T.Semicolon, ";"]),
    );
  });

  it("Assign to const", () => {
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

  it("Assign to variable", () => {
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
