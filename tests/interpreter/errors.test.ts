import { describe, expect, it } from "vitest";
import { InvalidNodeError, InvalidVariableError } from "../../src/errors";
import Interpreter from "../../src/interpreter";

const interpreter = new Interpreter();

describe("Errors", () => {
  describe("Assignment and declarations", () => {
    it("Assign value to undeclared variable", () => {
      expect(() => interpreter.eval("a = 1;")).toThrow(
        new InvalidVariableError('Variable "a was not found."'),
      );
    });

    it("Get value from undeclared variable", () => {
      expect(() => interpreter.eval("a")).toThrow(
        new InvalidVariableError('Variable "a" was not found.'),
      );
    });

    it("Assign value to immutable variable", () => {
      expect(() => interpreter.eval("fix a = 1; a = 2;")).toThrow(
        new InvalidVariableError('Constant "a" cannot be reassigned.'),
      );
    });

    it("Variable already declared", () => {
      expect(() => interpreter.eval("fix hello = 1; mut hello = 2;")).toThrow(
        new InvalidVariableError('Variable "hello" has already been declared.'),
      );

      expect(() => interpreter.eval("mut hello = 1; fix hello = 2;")).toThrow(
        new InvalidVariableError('Variable "hello" has already been declared.'),
      );
    });

    it("Shadow immut in function", () => {
      expect(() =>
        interpreter.eval(
          "fix hello = 2; fun test() { mut hello = 1; } test();",
        ),
      ).toThrow(
        new InvalidVariableError(
          'Constant "hello" from parent\'s scope cannot be shadowed.',
        ),
      );
    });

    it("Expect a function", () => {
      expect(() => interpreter.eval("mut test; test();")).toThrow(
        new InvalidNodeError("Expected a function, but got nil."),
      );
    });

    it("Expect variable in function", () => {
      expect(() =>
        interpreter.eval("fun test(a, b) {ret a + b;} test();"),
      ).toThrow(new InvalidVariableError('Variable "a" was not found.'));
    });

    it("Call stack exceeded", () => {
      expect(() =>
        interpreter.eval("fun test(a, b) {ret test(a, b);} test(1, 2);"),
      ).toThrow(new RangeError("Maximum call stack size exceeded"));
    });
  });

  describe("BinaryOperations", () => {
    it("Subtract string and number", () => {
      expect(() => interpreter.eval("'hello' - 5")).toThrow(
        new InvalidNodeError("Invalid operation: hello - 5"),
      );
    });

    //? Can be an expected behavior ("hello" * 2 = "hellohello")
    it("Multiply string and number", () => {
      expect(() => interpreter.eval("'hello' * 5")).toThrow(
        new InvalidNodeError("Invalid operation: hello * 5"),
      );
    });

    it("Divide string and number", () => {
      expect(() => interpreter.eval("'hello' / 5")).toThrow(
        new InvalidNodeError("Invalid operation: hello / 5"),
      );
    });

    it("Substract boolean and string", () => {
      expect(() => interpreter.eval("true - 'test'")).toThrow(
        new InvalidNodeError("Invalid operation: true - test"),
      );
    });

    it("Subtract string and string", () => {
      expect(() => interpreter.eval("'hello' - 'hello2'")).toThrow(
        new InvalidNodeError("Invalid operation: hello - hello2"),
      );
    });
  });

  describe("Statements", () => {
    it("Return top level error", () => {
      expect(() => interpreter.eval("mut ok = 'test'; ret ok + 2;")).toThrow(
        new InvalidNodeError(
          "Expected a number as return value, but got String.",
        ),
      );
    });
  });
});
