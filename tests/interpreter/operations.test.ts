import { describe, expect, it } from "vitest";
import Interpreter from "../../src/interpreter";

const interpreter = new Interpreter();

describe("Assignment and declarations", () => {
  it("Variable declaration and assignment", () => {
    const input = interpreter.eval("mut a; a = 5; a");
    expect(input).toStrictEqual({ type: "Number", value: 5 });
  });

  it("Variable declaration show", () => {
    const input = interpreter.eval("mut a; a");
    expect(input).toStrictEqual({ type: "nil", value: null });
  });

  it("Variable reassignment", () => {
    const input = interpreter.eval("mut b = 2; b = 7; b");
    expect(input).toStrictEqual({ type: "Number", value: 7 });
  });

  it("Function call reassignment", () => {
    const input = interpreter.eval(
      "fun hello() { fix a = 1; ret a + 2; } mut b = 2; b = hello(); b",
    );
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  it("Multiple variables declaration and assignment", () => {
    const input = interpreter.eval("mut x = 1; mut y = 2; x + y");
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  //TODO: Add array compatibility
  it.todo("Array declaration and access", () => {
    const input = interpreter.eval("mut arr = [1, 2, 3]; arr[1]");
    expect(input).toStrictEqual({ type: "Number", value: 2 });
  });

  //TODO: Add array compatibility
  it.todo("Array reassignment", () => {
    const input = interpreter.eval("mut arr = [1, 2, 3]; arr[0] = 10; arr[0]");
    expect(input).toStrictEqual({ type: "Number", value: 10 });
  });

  it("Function void declaration and call", () => {
    const input = interpreter.eval("fun greet() { fix test = 1; } greet();");
    expect(input).toStrictEqual({ type: "nil", value: null });
  });

  it("Function return declaration and call", () => {
    const input = interpreter.eval("fun add(a, b) { ret a + b; } add(2, 3);");
    expect(input).toStrictEqual({ type: "Number", value: 5 });
  });

  it("Function return call with variable argument", () => {
    const input = interpreter.eval(
      "fun square(x) { ret x * x; } mut n = 4; square(n);",
    );
    expect(input).toStrictEqual({ type: "Number", value: 16 });
  });
});

describe("BinaryOperations", () => {
  it("Addition", () => {
    const input = interpreter.eval("2 + 3");
    expect(input).toStrictEqual({ type: "Number", value: 5 });
  });

  it("Subtraction", () => {
    const input = interpreter.eval("7 - 4");
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  it("Multiplication", () => {
    const input = interpreter.eval("6 * 3");
    expect(input).toStrictEqual({ type: "Number", value: 18 });
  });

  it("Division", () => {
    const input = interpreter.eval("8 / 2");
    expect(input).toStrictEqual({ type: "Number", value: 4 });
  });

  it("Parentheses precedence", () => {
    const input = interpreter.eval("2 + 3 * 4");
    expect(input).toStrictEqual({ type: "Number", value: 14 });
    const input2 = interpreter.eval("(2 * 3) + 4");
    expect(input2).toStrictEqual({ type: "Number", value: 10 });
  });

  it("Float operations", () => {
    const input = interpreter.eval("2.5 + 3.1");
    expect(input).toStrictEqual({ type: "Number", value: 5.6 });
    const input2 = interpreter.eval("5.5 - 2.2");
    expect(input2).toStrictEqual({ type: "Number", value: 3.3 });
  });

  it("Modulus operation", () => {
    const input = interpreter.eval("10 % 3");
    expect(input).toStrictEqual({ type: "Number", value: 1 });
    const input2 = interpreter.eval("10 % 5");
    expect(input2).toStrictEqual({ type: "Number", value: 0 });
  });

  it("Comparison ==", () => {
    const input = interpreter.eval("5 == 5");
    expect(input).toStrictEqual({ type: "Boolean", value: true });
    const input2 = interpreter.eval("5 == 4");
    expect(input2).toStrictEqual({ type: "Boolean", value: false });
  });

  //TODO: fix this test
  it.todo("Comparison !=", () => {
    const input = interpreter.eval("5 != 4");
    expect(input).toStrictEqual({ type: "Boolean", value: true });
    const input2 = interpreter.eval("5 != 5");
    expect(input2).toStrictEqual({ type: "Boolean", value: false });
  });

  it("Comparison <, >, <=, >=", () => {
    expect(interpreter.eval("3 < 5")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
    expect(interpreter.eval("5 < 3")).toStrictEqual({
      type: "Boolean",
      value: false,
    });
    expect(interpreter.eval("3 > 5")).toStrictEqual({
      type: "Boolean",
      value: false,
    });
    expect(interpreter.eval("5 > 3")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
    expect(interpreter.eval("3 <= 3")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
    expect(interpreter.eval("3 >= 3")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
  });

  //TODO: fix this test
  it.todo("Boolean AND/OR", () => {
    expect(interpreter.eval("true && false")).toStrictEqual({
      type: "Boolean",
      value: false,
    });
    expect(interpreter.eval("true && true")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
    expect(interpreter.eval("false || true")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
    expect(interpreter.eval("false || false")).toStrictEqual({
      type: "Boolean",
      value: false,
    });
  });

  //TODO: fix this test
  it.todo("Boolean NOT", () => {
    expect(interpreter.eval("!true")).toStrictEqual({
      type: "Boolean",
      value: false,
    });
    expect(interpreter.eval("!false")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
  });

  it("String concatenation", () => {
    expect(interpreter.eval("'a' + 'b'")).toStrictEqual({
      type: "String",
      value: "ab",
    });
  });

  it("String/Number concatenation", () => {
    expect(interpreter.eval("'a' + 2")).toStrictEqual({
      type: "String",
      value: "a2",
    });
  });

  it("Bool concatenation", () => {
    expect(interpreter.eval("true+false")).toStrictEqual({
      type: "Number",
      value: 1,
    });
  });
});
