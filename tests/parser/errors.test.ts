import { describe, expect, it } from "vitest";
import { InvalidTokenError } from "../../src/errors";
import Parser from "../../src/parser";

const parser = new Parser();

describe("Errors", () => {
  describe("Assignment and declarations", () => {
    it("Expect identifier after constant or variable declaration", () => {
      const inputImmut = () => parser.sourceCodeToAST("const = 'hello'");
      const inputMut = () => parser.sourceCodeToAST("let = 'hello'");
      const error = new InvalidTokenError(
        "Expected identifier after mut/immut declaration.",
      );

      expect(inputImmut).toThrow(error);
      expect(inputMut).toThrow(error);
    });

    it("Missing initializer after constant declaration", () => {
      expect(() => parser.sourceCodeToAST("const hello;")).toThrow(
        new InvalidTokenError("Missing initializer in immut declaration."),
      );
    });

    it("Expect '=' after variable declaration", () => {
      const inputImmut = () => parser.sourceCodeToAST("const hello");
      const inputMut = () => parser.sourceCodeToAST("let hello");
      const error = new InvalidTokenError(
        "Expected '=' after identifier in variable declaration.",
      );

      expect(inputImmut).toThrow(error);
      expect(inputMut).toThrow(error);
    });

    it("Expect ';' after variable assignment", () => {
      const inputImmut = () => parser.sourceCodeToAST("const hello = 1");
      const inputMut = () => parser.sourceCodeToAST("let hello = 1");
      const error = new InvalidTokenError(
        "Expected ';' after variable assignment.",
      );

      expect(inputImmut).toThrow(error);
      expect(inputMut).toThrow(error);
    });

    it("Expect ';' after assignment expression", () => {
      expect(() => parser.sourceCodeToAST("let a = 1; a = 2")).toThrow(
        new InvalidTokenError("Expected ';' after assignment expression."),
      );
    });

    it("Expect identifier after function declaration", () => {
      expect(() => parser.sourceCodeToAST("function;")).toThrow(
        new InvalidTokenError(
          "Expected identifier after function declaration.",
        ),
      );
    });

    it("Expect '(' after function identifier", () => {
      expect(() => parser.sourceCodeToAST("function hello")).toThrow(
        new InvalidTokenError("Expected '(' after function identifier."),
      );
    });

    it("Unexpected identifier parameter", () => {
      const inputParameterString = () =>
        parser.sourceCodeToAST("function hello('hello')");
      const inputParameterNumber = () =>
        parser.sourceCodeToAST("function hello(x, 1, '')");
      const error = new InvalidTokenError("Expected parameter identifier.");

      expect(inputParameterString).toThrow(error);
      expect(inputParameterNumber).toThrow(error);
    });

    it("Expect '{' after function declaration", () => {
      expect(() => parser.sourceCodeToAST("function hello(a, b, c)")).toThrow(
        new InvalidTokenError("Expected '{' after function declaration."),
      );
    });

    it("Expect '}' after function block", () => {
      expect(() =>
        parser.sourceCodeToAST("function hello(a, b, c) { return 1;"),
      ).toThrow(new InvalidTokenError("Expected '}' after function block."));
    });

    it("Expect ')' after function call", () => {
      expect(() =>
        parser.sourceCodeToAST("function hello(a, b) {} hello(a, b"),
      ).toThrow(new InvalidTokenError("Expected ')' after function call."));
    });

    it("Expect ';' after function call", () => {
      expect(() =>
        parser.sourceCodeToAST("function hello(a, b) {} hello(a, b)"),
      ).toThrow(new InvalidTokenError("Expected ';' after function call."));
    });

    it("Invalid identifier", () => {
      expect(() => parser.sourceCodeToAST("$")).toThrow(
        new InvalidTokenError("Invalid identifier: $"),
      );
    });
  });

  describe("BinaryOperations", () => {
    it("Unexpected assignment to binary expression", () => {
      expect(() =>
        parser.sourceCodeToAST("let a = 1; let b = 2; a + b = b;"),
      ).toThrow(
        new InvalidTokenError("Unexpected assignment to binary expression."),
      );
    });

    it("Expect ')' after binary expression", () => {
      expect(() => parser.sourceCodeToAST("let a = 1; (1 + a")).toThrow(
        new InvalidTokenError("Expected ')' after expression."),
      );
    });
  });

  describe("Statements", () => {
    it("Expect ';' after return statement", () => {
      expect(() =>
        parser.sourceCodeToAST("function hello(a, b, c) { return a + b }"),
      ).toThrow(new InvalidTokenError("Expected ';' after return statement."));
    });
  });
});
