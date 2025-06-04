import { describe, expect, it } from "vitest";
import Interpreter from "../../src/interpreter";

const interpreter = new Interpreter();

describe("Literals", () => {
  it("String", () => {
    const input = interpreter.eval("'hello'");
    expect(input).toStrictEqual({ type: "String", value: "hello" });
  });

  it("Number", () => {
    const input = interpreter.eval("102");
    expect(input).toStrictEqual({ type: "Number", value: 102 });
  });

  it("Float", () => {
    const input = interpreter.eval("102.23");
    expect(input).toStrictEqual({ type: "Number", value: 102.23 });
  });

  it("Negative Integer", () => {
    const input = interpreter.eval("-42");
    expect(input).toStrictEqual({ type: "Number", value: -42 });
  });

  it("Negative Float", () => {
    const input = interpreter.eval("-3.14");
    expect(input).toStrictEqual({ type: "Number", value: -3.14 });
  });

  it("Boolean true", () => {
    const input = interpreter.eval("true");
    expect(input).toStrictEqual({ type: "Boolean", value: true });
  });

  it("Boolean false", () => {
    const input = interpreter.eval("false");
    expect(input).toStrictEqual({ type: "Boolean", value: false });
  });

  it("Nil", () => {
    const input = interpreter.eval("nil");
    expect(input).toStrictEqual({ type: "nil", value: null });
  });

  it("Empty String", () => {
    const input = interpreter.eval("''");
    expect(input).toStrictEqual({ type: "String", value: "" });
  });
});
