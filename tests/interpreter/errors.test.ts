import { describe, expect, it } from "vitest";
import { InvalidNodeError } from "../../src/errors";
import Interpreter from "../../src/interpreter";

const interpreter = new Interpreter();

describe("Errors", () => {
  describe("Assignment and declarations", () => {
    it("Assign value to undeclared variable", () => {
      expect(() => interpreter.evaluateSourceCode("a = 1;")).toThrow(
        new Error("InvalidVariableError: Variable 'a' not found"),
      );
    });

    it("Get value from undeclared variable", () => {
      expect(() => interpreter.evaluateSourceCode("a")).toThrow(
        new Error("InvalidVariableError: Variable not found"),
      );
    });

    it("Assign value to immutable variable", () => {
      expect(() =>
        interpreter.evaluateSourceCode("const a = 1; a = 2;"),
      ).toThrow(new Error("Unable to assign value to immutable variable."));
    });

    it("Expect a function", () => {
      expect(() => interpreter.evaluateSourceCode("let test; test();")).toThrow(
        new InvalidNodeError("Expected a function, but got Null."),
      );
    });
  });

  describe("BinaryOperations", () => {
    it("Subtract string and number", () => {
      expect(() => interpreter.evaluateSourceCode("'hello' - 5")).toThrow(
        new InvalidNodeError("Invalid operation: hello - 5"),
      );
    });

    //? Can be an expected behavior ("hello" * 2 = "hellohello")
    it("Multiply string and number", () => {
      expect(() => interpreter.evaluateSourceCode("'hello' * 5")).toThrow(
        new InvalidNodeError("Invalid operation: hello * 5"),
      );
    });

    it("Divide string and number", () => {
      expect(() => interpreter.evaluateSourceCode("'hello' / 5")).toThrow(
        new InvalidNodeError("Invalid operation: hello / 5"),
      );
    });

    it("Substract boolean and string", () => {
      expect(() => interpreter.evaluateSourceCode("true - 'test'")).toThrow(
        new InvalidNodeError("Invalid operation: 1 - test"),
      );
    });

    it("Subtract string and string", () => {
      expect(() =>
        interpreter.evaluateSourceCode("'hello' - 'hello2'"),
      ).toThrow(new InvalidNodeError("Invalid operation: hello - hello2"));
    });
  });

  describe("Statements", () => {
    it("Return top level error", () => {
      expect(() =>
        interpreter.evaluateSourceCode("let ok = 'test'; return ok+2;"),
      ).toThrow(
        new InvalidNodeError(
          "Expected a number as return value, but got String.",
        ),
      );
    });
  });
});
