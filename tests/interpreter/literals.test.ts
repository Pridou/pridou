import { describe, expect, it } from "vitest";
import Interpreter from "../../src/interpreter";

describe("Literals", () => {
  it("String", () => {
    const a = new Interpreter();
    const input = a.eval("'hello'");
    expect(input).toStrictEqual({ type: "String", value: "hello" });
  });

  it("Number", () => {
    const a = new Interpreter();
    const input = a.eval("102");
    expect(input).toStrictEqual({ type: "Number", value: 102 });
  });

  it("Float", () => {
    const a = new Interpreter();
    const input = a.eval("102.23");
    expect(input).toStrictEqual({ type: "Number", value: 102.23 });
  });

  it("Negative Integer", () => {
    const a = new Interpreter();
    const input = a.eval("-42");
    expect(input).toStrictEqual({ type: "Number", value: -42 });
  });

  it("Negative Float", () => {
    const a = new Interpreter();
    const input = a.eval("-3.14");
    expect(input).toStrictEqual({ type: "Number", value: -3.14 });
  });

  it("Boolean true", () => {
    const a = new Interpreter();
    const input = a.eval("true");
    expect(input).toStrictEqual({ type: "Boolean", value: true });
  });

  it("Boolean false", () => {
    const a = new Interpreter();
    const input = a.eval("false");
    expect(input).toStrictEqual({ type: "Boolean", value: false });
  });

  it("Nil", () => {
    const a = new Interpreter();
    const input = a.eval("nil");
    expect(input).toStrictEqual({ type: "nil", value: null });
  });

  it("Empty String", () => {
    const a = new Interpreter();
    const input = a.eval("''");
    expect(input).toStrictEqual({ type: "String", value: "" });
  });
});
