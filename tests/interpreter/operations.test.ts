import { describe, expect, it } from "vitest";
import Interpreter from "../../src/interpreter";

describe("Assignment and declarations", () => {
  it("Variable declaration and assignment", () => {
    const a = new Interpreter();
    const input = a.eval("mut a; a = 5; a");
    expect(input).toStrictEqual({ type: "Number", value: 5 });
  });

  it("Variable declaration show", () => {
    const a = new Interpreter();
    const input = a.eval("mut a; a");
    expect(input).toStrictEqual({ type: "nil", value: null });
  });

  it("Variable reassignment", () => {
    const a = new Interpreter();
    const input = a.eval("mut b = 2; b = 7; b");
    expect(input).toStrictEqual({ type: "Number", value: 7 });
  });

  it("Function call reassignment", () => {
    const a = new Interpreter();
    const input = a.eval(
      "fun hello() { fix a = 1; ret a + 2; } mut b = 2; b = hello(); b",
    );
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  it("Multiple variables declaration and assignment", () => {
    const a = new Interpreter();
    const input = a.eval("mut x = 1; mut y = 2; x + y");
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  //TODO: Add array compatibility
  it.todo("Array declaration and access", () => {
    const a = new Interpreter();
    const input = a.eval("mut arr = [1, 2, 3]; arr[1]");
    expect(input).toStrictEqual({ type: "Number", value: 2 });
  });

  //TODO: Add array compatibility
  it.todo("Array reassignment", () => {
    const a = new Interpreter();
    const input = a.eval("mut arr = [1, 2, 3]; arr[0] = 10; arr[0]");
    expect(input).toStrictEqual({ type: "Number", value: 10 });
  });

  it("Function void declaration and call", () => {
    const a = new Interpreter();
    const input = a.eval("fun greet() { fix test = 1; } greet();");
    expect(input).toStrictEqual({ type: "nil", value: null });
  });

  it("Function return declaration and call", () => {
    const a = new Interpreter();
    const input = a.eval("fun add(a, b) { ret a + b; } add(2, 3);");
    expect(input).toStrictEqual({ type: "Number", value: 5 });
  });

  it("Function return call with variable argument", () => {
    const a = new Interpreter();
    const input = a.eval("fun square(x) { ret x * x; } mut n = 4; square(n);");
    expect(input).toStrictEqual({ type: "Number", value: 16 });
  });
});

describe("BinaryOperations", () => {
  it("Addition", () => {
    const a = new Interpreter();
    const input = a.eval("2 + 3");
    expect(input).toStrictEqual({ type: "Number", value: 5 });
  });

  it("Subtraction", () => {
    const a = new Interpreter();
    const input = a.eval("7 - 4");
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  it("Multiplication", () => {
    const a = new Interpreter();
    const input = a.eval("6 * 3");
    expect(input).toStrictEqual({ type: "Number", value: 18 });
  });

  it("Division", () => {
    const a = new Interpreter();
    const input = a.eval("8 / 2");
    expect(input).toStrictEqual({ type: "Number", value: 4 });
  });

  it("Parentheses precedence", () => {
    const a = new Interpreter();
    const b = new Interpreter();
    const input = a.eval("2 + 3 * 4");
    const input2 = b.eval("(2 * 3) + 4");

    expect(input).toStrictEqual({ type: "Number", value: 14 });
    expect(input2).toStrictEqual({ type: "Number", value: 10 });
  });

  it("Float operations", () => {
    const a = new Interpreter();
    const b = new Interpreter();
    const input = a.eval("2.5 + 3.1");
    const input2 = b.eval("5.5 - 2.2");

    expect(input).toStrictEqual({ type: "Number", value: 5.6 });
    expect(input2).toStrictEqual({ type: "Number", value: 3.3 });
  });

  it("Modulus operation", () => {
    const a = new Interpreter();
    const b = new Interpreter();
    const input = a.eval("10 % 3");
    const input2 = b.eval("10 % 5");

    expect(input).toStrictEqual({ type: "Number", value: 1 });
    expect(input2).toStrictEqual({ type: "Number", value: 0 });
  });

  it("Comparison ==", () => {
    const a = new Interpreter();
    const b = new Interpreter();
    const input = a.eval("5 == 5");
    const input2 = b.eval("5 == 4");

    expect(input).toStrictEqual({ type: "Boolean", value: true });
    expect(input2).toStrictEqual({ type: "Boolean", value: false });
  });

  //TODO: fix this test
  it.todo("Comparison !=", () => {
    const a = new Interpreter();
    const b = new Interpreter();
    const input = a.eval("5 != 4");
    const input2 = b.eval("5 != 5");

    expect(input).toStrictEqual({ type: "Boolean", value: true });
    expect(input2).toStrictEqual({ type: "Boolean", value: false });
  });

  it("Comparison <, >, <=, >=", () => {
    const a = new Interpreter();

    expect(a.eval("3 < 5")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
    expect(a.eval("5 < 3")).toStrictEqual({
      type: "Boolean",
      value: false,
    });
    expect(a.eval("3 > 5")).toStrictEqual({
      type: "Boolean",
      value: false,
    });
    expect(a.eval("5 > 3")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
    expect(a.eval("3 <= 3")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
    expect(a.eval("3 >= 3")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
  });

  //TODO: fix this test
  it.todo("Boolean AND/OR", () => {
    const a = new Interpreter();

    expect(a.eval("true && false")).toStrictEqual({
      type: "Boolean",
      value: false,
    });
    expect(a.eval("true && true")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
    expect(a.eval("false || true")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
    expect(a.eval("false || false")).toStrictEqual({
      type: "Boolean",
      value: false,
    });
  });

  //TODO: fix this test
  it.todo("Boolean NOT", () => {
    const a = new Interpreter();

    expect(a.eval("!true")).toStrictEqual({
      type: "Boolean",
      value: false,
    });
    expect(a.eval("!false")).toStrictEqual({
      type: "Boolean",
      value: true,
    });
  });

  it("String concatenation", () => {
    const a = new Interpreter();
    expect(a.eval("'a' + 'b'")).toStrictEqual({
      type: "String",
      value: "ab",
    });
  });

  it("String/Number concatenation", () => {
    const a = new Interpreter();
    expect(a.eval("'a' + 2")).toStrictEqual({
      type: "String",
      value: "a2",
    });
  });

  it("Bool concatenation", () => {
    const a = new Interpreter();
    expect(a.eval("true+false")).toStrictEqual({
      type: "Number",
      value: 1,
    });
  });
});
