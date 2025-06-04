import { describe, expect, it } from "vitest";
import { InvalidTokenError } from "../../src/errors";
import Parser from "../../src/parser";

const parser = new Parser();

describe("Errors", () => {
  describe("Assignment and declarations", () => {
    it("Expect identifier after constant or variable declaration", () => {
      const inputImmut = () => parser.sourceCodeToAST("fix = 'hello'");
      const inputMut = () => parser.sourceCodeToAST("mut = 'hello'");
      const error = new InvalidTokenError(
        "Expected identifier after mut/immut declaration.",
      );

      expect(inputImmut).toThrow(error);
      expect(inputMut).toThrow(error);
    });

    it("Missing initializer after constant declaration", () => {
      expect(() => parser.sourceCodeToAST("fix hello;")).toThrow(
        new InvalidTokenError(
          "Cannot declare a constant without an initializer.",
        ),
      );
    });

    it("Expect '=' after variable declaration", () => {
      const inputImmut = () => parser.sourceCodeToAST("fix hello mut ok;");
      const inputMut = () => parser.sourceCodeToAST("mut hello mut ok;");
      const error = new InvalidTokenError(
        'Invalid token "mut" was found, expected "=".',
      );

      expect(inputImmut).toThrow(error);
      expect(inputMut).toThrow(error);
    });

    it("Expect ';' after variable assignment", () => {
      const inputImmut = () => parser.sourceCodeToAST("fix hello = 1 mut ok;");
      const inputMut = () => parser.sourceCodeToAST("mut hello = 1 mut ok;");
      const error = new InvalidTokenError(
        'Invalid token "mut" was found, expected ";".',
      );

      expect(inputImmut).toThrow(error);
      expect(inputMut).toThrow(error);
    });

    it("Expect ';' after assignment expression", () => {
      expect(() => parser.sourceCodeToAST("let a = 1; a = 2 mut ok;")).toThrow(
        new InvalidTokenError('Invalid token "mut" was found, expected ";".'),
      );
    });

    it("Expect identifier after function declaration", () => {
      expect(() => parser.sourceCodeToAST("fun;")).toThrow(
        new InvalidTokenError(
          "Expected identifier after function declaration.",
        ),
      );
    });

    it("Expect '(' after function identifier", () => {
      expect(() => parser.sourceCodeToAST("fun hello mut a;")).toThrow(
        new InvalidTokenError('Invalid token "mut" was found, expected "(".'),
      );
    });

    it("Unexpected identifier parameter", () => {
      const inputParameterString = () =>
        parser.sourceCodeToAST("fun hello('hello')");
      const inputParameterNumber = () =>
        parser.sourceCodeToAST("fun hello(x, 1, '')");
      const error = new InvalidTokenError("Expected parameter's identifier.");

      expect(inputParameterString).toThrow(error);
      expect(inputParameterNumber).toThrow(error);
    });

    it("Expect '{' after function declaration", () => {
      expect(() => parser.sourceCodeToAST("fun hello(a, b, c) mut a;")).toThrow(
        new InvalidTokenError('Invalid token "mut" was found, expected "{".'),
      );
    });

    it("Expect '}' after function block", () => {
      expect(() =>
        parser.sourceCodeToAST("fun hello(a, b, c) { ret 1;"),
      ).toThrow(new InvalidTokenError("Expected '}' after function block."));
    });

    it("Expect ')' after function call", () => {
      expect(() =>
        parser.sourceCodeToAST("fun hello(a, b) {} hello(a, b"),
      ).toThrow(new InvalidTokenError("Expected ')' after function call."));
    });

    it("Expect ';' after function call", () => {
      expect(() =>
        parser.sourceCodeToAST("fun hello(a, b) {} hello(a, b) mut ok;"),
      ).toThrow(
        new InvalidTokenError('Invalid token "mut" was found, expected ";".'),
      );
    });

    it("Invalid identifier", () => {
      expect(() => parser.sourceCodeToAST("$")).toThrow(
        new InvalidTokenError("Invalid token $ was found."),
      );
    });
  });

  describe("BinaryOperations", () => {
    it("Unexpected assignment to binary expression", () => {
      expect(() =>
        parser.sourceCodeToAST("mut a = 1; mut b = 2; a + b = b;"),
      ).toThrow(
        new InvalidTokenError("Unexpected assignment to binary expression."),
      );
    });

    //TODO: fix this test
    it.todo("Expect ')' after binary expression", () => {
      expect(() => parser.sourceCodeToAST("mut a = 1; (1 + a")).toThrow(
        new InvalidTokenError("Expected ')' after expression."),
      );
    });
  });

  describe("Statements", () => {
    it("Expect ';' after return statement", () => {
      expect(() =>
        parser.sourceCodeToAST("fun hello(a, b, c) { ret a + b }"),
      ).toThrow(
        new InvalidTokenError('Invalid token "}" was found, expected ";".'),
      );
    });
  });
});
