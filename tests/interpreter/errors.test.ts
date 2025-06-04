import { describe, expect, it } from "vitest";
import { InvalidNodeError, InvalidVariableError } from "../../src/errors";
import Interpreter from "../../src/interpreter";

describe("Errors", () => {
  describe("Assignment and declarations", () => {
    it("Assign value to undeclared variable", () => {
      const a = new Interpreter();
      expect(() => a.eval("a = 1;")).toThrow(
        new InvalidVariableError('Variable "a was not found."'),
      );
    });

    it("Get value from undeclared variable", () => {
      const a = new Interpreter();
      expect(() => a.eval("a")).toThrow(
        new InvalidVariableError('Variable "a" was not found.'),
      );
    });

    it("Assign value to immutable variable", () => {
      const a = new Interpreter();
      expect(() => a.eval("fix a = 1; a = 2;")).toThrow(
        new InvalidVariableError('Constant "a" cannot be reassigned.'),
      );
    });

    it("Variable already declared", () => {
      const a = new Interpreter();
      const b = new Interpreter();

      expect(() => a.eval("fix hello = 1; mut hello = 2;")).toThrow(
        new InvalidVariableError('Variable "hello" has already been declared.'),
      );

      expect(() => b.eval("mut hello = 1; fix hello = 2;")).toThrow(
        new InvalidVariableError('Variable "hello" has already been declared.'),
      );
    });

    it("Shadow immut in function", () => {
      const a = new Interpreter();
      expect(() =>
        a.eval("fix hello = 2; fun test() { mut hello = 1; } test();"),
      ).toThrow(
        new InvalidVariableError(
          'Constant "hello" from parent\'s scope cannot be shadowed.',
        ),
      );
    });

    it("Expect a function", () => {
      const a = new Interpreter();
      expect(() => a.eval("mut test; test();")).toThrow(
        new InvalidNodeError("Expected a function, but got nil."),
      );
    });

    it("Expect variable in function", () => {
      const a = new Interpreter();
      expect(() => a.eval("fun test(a, b) {ret a + b;} test();")).toThrow(
        new InvalidVariableError('Variable "a" was not found.'),
      );
    });

    it("Call stack exceeded", () => {
      const a = new Interpreter();
      expect(() =>
        a.eval("fun test(a, b) {ret test(a, b);} test(1, 2);"),
      ).toThrow(new RangeError("Maximum call stack size exceeded"));
    });
  });

  describe("BinaryOperations", () => {
    it("Subtract string and number", () => {
      const a = new Interpreter();
      expect(() => a.eval("'hello' - 5")).toThrow(
        new InvalidNodeError("Invalid operation: hello - 5"),
      );
    });

    //? Can be an expected behavior ("hello" * 2 = "hellohello")
    it("Multiply string and number", () => {
      const a = new Interpreter();
      expect(() => a.eval("'hello' * 5")).toThrow(
        new InvalidNodeError("Invalid operation: hello * 5"),
      );
    });

    it("Divide string and number", () => {
      const a = new Interpreter();
      expect(() => a.eval("'hello' / 5")).toThrow(
        new InvalidNodeError("Invalid operation: hello / 5"),
      );
    });

    it("Substract boolean and string", () => {
      const a = new Interpreter();
      expect(() => a.eval("true - 'test'")).toThrow(
        new InvalidNodeError("Invalid operation: true - test"),
      );
    });

    it("Subtract string and string", () => {
      const a = new Interpreter();
      expect(() => a.eval("'hello' - 'hello2'")).toThrow(
        new InvalidNodeError("Invalid operation: hello - hello2"),
      );
    });
  });

  describe("Statements", () => {
    it("Return top level error", () => {
      const a = new Interpreter();
      expect(() => a.eval("mut ok = 'test'; ret ok + 2;")).toThrow(
        new InvalidNodeError(
          "Expected a number as return value, but got String.",
        ),
      );
    });
  });
});
