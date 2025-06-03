import { describe, expect, it } from "vitest";
import Interpreter from "../../src/interpreter";

const interpreter = new Interpreter();

describe("Assignment and declarations", () => {
  it("Variable declaration and assignment", () => {
    const input = interpreter.evaluateSourceCode("let a; a = 5; a");
    expect(input).toStrictEqual({ type: "Number", value: 5 });
  });

  it("Variable declaration show", () => {
    const input = interpreter.evaluateSourceCode("let a; a");
    expect(input).toStrictEqual({ type: "Null", value: null });
  });

  it("Variable reassignment", () => {
    const input = interpreter.evaluateSourceCode("let b = 2; b = 7; b");
    expect(input).toStrictEqual({ type: "Number", value: 7 });
  });

  //! Error when assigning function call to variable
  it.todo("Function call reassignment", () => {
    const input = interpreter.evaluateSourceCode(
      "function hello() { const a = 1; return a + 2; } let b = 2; b = hello(); b",
    );
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  it("Multiple variables declaration and assignment", () => {
    const input = interpreter.evaluateSourceCode("let x = 1; let y = 2; x + y");
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  //TODO: Add array compatibility
  it.todo("Array declaration and access", () => {
    const input = interpreter.evaluateSourceCode("let arr = [1, 2, 3]; arr[1]");
    expect(input).toStrictEqual({ type: "Number", value: 2 });
  });

  //TODO: Add array compatibility
  it.todo("Array reassignment", () => {
    const input = interpreter.evaluateSourceCode(
      "let arr = [1, 2, 3]; arr[0] = 10; arr[0]",
    );
    expect(input).toStrictEqual({ type: "Number", value: 10 });
  });

  it("Function void declaration and call", () => {
    const input = interpreter.evaluateSourceCode(
      "function greet() { const test = 1; } greet();",
    );
    expect(input).toStrictEqual({ type: "Null", value: null });
  });

  it("Function return declaration and call", () => {
    const input = interpreter.evaluateSourceCode(
      "function add(a, b) { return a + b; } add(2, 3);",
    );
    expect(input).toStrictEqual({ type: "Number", value: 5 });
  });

  it("Function return call with variable argument", () => {
    const input = interpreter.evaluateSourceCode(
      "function square(x) { return x * x; } let n = 4; square(n);",
    );
    expect(input).toStrictEqual({ type: "Number", value: 16 });
  });
});

describe("BinaryOperations", () => {
  it("Addition", () => {
    const input = interpreter.evaluateSourceCode("2 + 3");
    expect(input).toStrictEqual({ type: "Number", value: 5 });
  });

  it("Subtraction", () => {
    const input = interpreter.evaluateSourceCode("7 - 4");
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  it("Multiplication", () => {
    const input = interpreter.evaluateSourceCode("6 * 3");
    expect(input).toStrictEqual({ type: "Number", value: 18 });
  });

  it("Division", () => {
    const input = interpreter.evaluateSourceCode("8 / 2");
    expect(input).toStrictEqual({ type: "Number", value: 4 });
  });

  it("Parentheses precedence", () => {
    const input = interpreter.evaluateSourceCode("2 + 3 * 4");
    expect(input).toStrictEqual({ type: "Number", value: 14 });
    const input2 = interpreter.evaluateSourceCode("(2 * 3) + 4");
    expect(input2).toStrictEqual({ type: "Number", value: 10 });
  });

  it("Float operations", () => {
    const input = interpreter.evaluateSourceCode("2.5 + 3.1");
    expect(input).toStrictEqual({ type: "Number", value: 5.6 });
    const input2 = interpreter.evaluateSourceCode("5.5 - 2.2");
    expect(input2).toStrictEqual({ type: "Number", value: 3.3 });
  });

  it("Modulus operation", () => {
    const input = interpreter.evaluateSourceCode("10 % 3");
    expect(input).toStrictEqual({ type: "Number", value: 1 });
    const input2 = interpreter.evaluateSourceCode("10 % 5");
    expect(input2).toStrictEqual({ type: "Number", value: 0 });
  });

  it.todo("Comparison ==", () => {
    const input = interpreter.evaluateSourceCode("5 == 5");
    expect(input).toStrictEqual({ type: "Boolean", value: 1 });
    const input2 = interpreter.evaluateSourceCode("5 == 4");
    expect(input2).toStrictEqual({ type: "Boolean", value: 0 });
  });

  it.todo("Comparison !=", () => {
    const input = interpreter.evaluateSourceCode("5 != 4");
    expect(input).toStrictEqual({ type: "Boolean", value: 1 });
    const input2 = interpreter.evaluateSourceCode("5 != 5");
    expect(input2).toStrictEqual({ type: "Boolean", value: 0 });
  });

  it.todo("Comparison <, >, <=, >=", () => {
    expect(interpreter.evaluateSourceCode("3 < 5")).toStrictEqual({
      type: "Boolean",
      value: 1,
    });
    expect(interpreter.evaluateSourceCode("5 < 3")).toStrictEqual({
      type: "Boolean",
      value: 0,
    });
    expect(interpreter.evaluateSourceCode("3 > 5")).toStrictEqual({
      type: "Boolean",
      value: 0,
    });
    expect(interpreter.evaluateSourceCode("5 > 3")).toStrictEqual({
      type: "Boolean",
      value: 1,
    });
    expect(interpreter.evaluateSourceCode("3 <= 3")).toStrictEqual({
      type: "Boolean",
      value: 1,
    });
    expect(interpreter.evaluateSourceCode("3 >= 3")).toStrictEqual({
      type: "Boolean",
      value: 1,
    });
  });

  it.todo("Boolean AND/OR", () => {
    expect(interpreter.evaluateSourceCode("true && false")).toStrictEqual({
      type: "Boolean",
      value: 0,
    });
    expect(interpreter.evaluateSourceCode("true && true")).toStrictEqual({
      type: "Boolean",
      value: 1,
    });
    expect(interpreter.evaluateSourceCode("false || true")).toStrictEqual({
      type: "Boolean",
      value: 1,
    });
    expect(interpreter.evaluateSourceCode("false || false")).toStrictEqual({
      type: "Boolean",
      value: 0,
    });
  });

  it.todo("Boolean NOT", () => {
    expect(interpreter.evaluateSourceCode("!true")).toStrictEqual({
      type: "Boolean",
      value: 0,
    });
    expect(interpreter.evaluateSourceCode("!false")).toStrictEqual({
      type: "Boolean",
      value: 1,
    });
  });

  it("String concatenation", () => {
    expect(interpreter.evaluateSourceCode("'a' + 'b'")).toStrictEqual({
      type: "String",
      value: "ab",
    });
  });

  it("String/Number concatenation", () => {
    expect(interpreter.evaluateSourceCode("'a' + 2")).toStrictEqual({
      type: "String",
      value: "a2",
    });
  });

  it("Bool concatenation", () => {
    expect(interpreter.evaluateSourceCode("true+false")).toStrictEqual({
      type: "Number",
      value: 1,
    });
  });
});
