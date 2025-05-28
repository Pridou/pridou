import { describe, expect, it } from "vitest";
import Interpreter from "../../src/interpreter";

const interpreter = new Interpreter();

describe("Literals", () => {
  it("String", () => {
    const input = interpreter.evaluateSourceCode("'hello'");
    expect(input).toStrictEqual({ type: "String", value: "hello" });
  });

  it("Number", () => {
    const input = interpreter.evaluateSourceCode("102");
    expect(input).toStrictEqual({ type: "Number", value: 102 });
  });

  it("Float", () => {
    const input = interpreter.evaluateSourceCode("102.23");
    expect(input).toStrictEqual({ type: "Number", value: 102.23 });
  });

  it.todo("Negative Integer", () => {
    const input = interpreter.evaluateSourceCode("-42");
    expect(input).toStrictEqual({ type: "Number", value: -42 });
  });

  it.todo("Negative Float", () => {
    const input = interpreter.evaluateSourceCode("-3.14");
    expect(input).toStrictEqual({ type: "Number", value: -3.14 });
  });

  it("Boolean true", () => {
    const input = interpreter.evaluateSourceCode("true");
    expect(input).toStrictEqual({ type: "Boolean", value: 1 });
  });

  it("Boolean false", () => {
    const input = interpreter.evaluateSourceCode("false");
    expect(input).toStrictEqual({ type: "Boolean", value: 0 });
  });

  it("Null", () => {
    const input = interpreter.evaluateSourceCode("null");
    expect(input).toStrictEqual({ type: "Null", value: null });
  });

  it("Empty String", () => {
    const input = interpreter.evaluateSourceCode("''");
    expect(input).toStrictEqual({ type: "String", value: "" });
  });
});
