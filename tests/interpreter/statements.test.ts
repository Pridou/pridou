import { describe, expect, it } from "vitest";
import Interpreter from "../../src/interpreter";

const interpreter = new Interpreter();

describe.todo("Statements", () => {
  it("If statement true branch", () => {
    const input = interpreter.evaluateSourceCode("if (true) { 42 } else { 0 }");
    expect(input).toStrictEqual({ type: "Number", value: 42 });
  });

  it("If statement false branch", () => {
    const input = interpreter.evaluateSourceCode(
      "if (false) { 42 } else { 0 }",
    );
    expect(input).toStrictEqual({ type: "Number", value: 0 });
  });

  it("For loop", () => {
    const input = interpreter.evaluateSourceCode(
      "let sum = 0; for (let i = 0; i < 3; i++) { sum = sum + i; } sum",
    );
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  it("For loop array access", () => {
    const input = interpreter.evaluateSourceCode(
      "let arr = [1, 2, 3]; let sum = 0; for (let i = 0; i < arr.length; i++) { sum = sum + arr[i]; } sum",
    );
    expect(input).toStrictEqual({ type: "Number", value: 6 });
  });

  it("While loop", () => {
    const input = interpreter.evaluateSourceCode(
      "let i = 0; let sum = 0; while (i < 3) { sum = sum + i; i = i + 1; } sum",
    );
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });
});
