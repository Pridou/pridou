import { describe, expect, it } from "vitest";
import Interpreter from "../../src/interpreter";

const interpreter = new Interpreter();

describe("Statements", () => {
  it.todo("If statement true branch", () => {
    const input = interpreter.evaluateSourceCode("if (true) { 42 } else { 0 }");
    expect(input).toStrictEqual({ type: "Number", value: 42 });
  });

  it.todo("If statement false branch", () => {
    const input = interpreter.evaluateSourceCode(
      "if (false) { 42 } else { 0 }",
    );
    expect(input).toStrictEqual({ type: "Number", value: 0 });
  });

  it.todo("For loop", () => {
    const input = interpreter.evaluateSourceCode(
      "let sum = 0; for (let i = 0; i < 3; i++) { sum = sum + i; } sum",
    );
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  it.todo("For loop array access", () => {
    const input = interpreter.evaluateSourceCode(
      "let arr = [1, 2, 3]; let sum = 0; for (let i = 0; i < arr.length; i++) { sum = sum + arr[i]; } sum",
    );
    expect(input).toStrictEqual({ type: "Number", value: 6 });
  });

  it.todo("While loop", () => {
    const input = interpreter.evaluateSourceCode(
      "let i = 0; let sum = 0; while (i < 3) { sum = sum + i; i = i + 1; } sum",
    );
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  it("Return top level", () => {
    expect(() =>
      interpreter.evaluateSourceCode("let ok = 1; ok = 3; return ok+2;"),
    ).toThrow(new Error('process.exit unexpectedly called with "5"'));
  });

  it("Return top level without exit code", () => {
    expect(() => interpreter.evaluateSourceCode("return;")).toThrow(
      new Error('process.exit unexpectedly called with "0"'),
    );
  });
});
