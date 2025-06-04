import { describe, expect, it } from "vitest";
import Interpreter from "../../src/interpreter";

const interpreter = new Interpreter();

describe("Statements", () => {
  //TODO: fix this test
  it.todo("If statement true branch", () => {
    const input = interpreter.eval("if (true) { 42 } else { 0 }");
    expect(input).toStrictEqual({ type: "Number", value: 42 });
  });

  //TODO: fix this test
  it.todo("If statement false branch", () => {
    const input = interpreter.eval("if (false) { 42 } else { 0 }");
    expect(input).toStrictEqual({ type: "Number", value: 0 });
  });

  //TODO: fix this test
  it.todo("For loop", () => {
    const input = interpreter.eval(
      "mut sum = 0; for (let i = 0; i < 3; i++) { sum = sum + i; } sum",
    );
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  //TODO: fix this test
  it.todo("For loop array access", () => {
    const input = interpreter.eval(
      "let arr = [1, 2, 3]; let sum = 0; for (let i = 0; i < arr.length; i++) { sum = sum + arr[i]; } sum",
    );
    expect(input).toStrictEqual({ type: "Number", value: 6 });
  });

  it("While loop", () => {
    const input = interpreter.eval(
      "mut i = 0; mut sum = 0; wil (i < 3) { sum = sum + i; i = i + 1; } sum",
    );
    expect(input).toStrictEqual({ type: "Number", value: 3 });
  });

  //TODO: fix this test
  it.todo("Switch case", () => {
    const input = interpreter.eval(
      "fix test = 10; mut val = 5; switch(test + 1) { case val + 6: val + 2 break; case 0: val break; default: val break; }",
    );
    expect(input).toStrictEqual({ type: "Number", value: 7 });
  });

  it("Return top level", () => {
    expect(() => interpreter.eval("mut ok = 1; ok = 3; ret ok + 2;")).toThrow(
      new Error('process.exit unexpectedly called with "5"'),
    );
  });

  it("Return top level without exit code", () => {
    expect(() => interpreter.eval("ret;")).toThrow(
      new Error('process.exit unexpectedly called with "0"'),
    );
  });
});
