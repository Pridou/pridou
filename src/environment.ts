import { InvalidVariableError } from "@/errors";

import {
  type InterpreterBoolean,
  type InterpreterNull,
  type InterpreterValue,
  InterpreterValueType,
} from "@/types/interpreter";

export default class Environment {
  readonly #parent?: Environment;
  readonly #constants: string[];
  readonly #variables: Map<string, InterpreterValue>;

  public constructor(parent?: Environment) {
    this.#parent = parent;
    this.#constants = [];
    this.#variables = new Map<string, InterpreterValue>();

    if (!this.#parent) {
      this.addVariable(
        "false",
        <InterpreterBoolean>{
          type: InterpreterValueType.Boolean,
          value: 0,
        },
        true,
      );

      this.addVariable(
        "true",
        <InterpreterBoolean>{
          type: InterpreterValueType.Boolean,
          value: 1,
        },
        true,
      );

      this.addVariable(
        "null",
        <InterpreterNull>{
          type: InterpreterValueType.Null,
          value: null,
        },
        true,
      );
    }
  }

  public addVariable(
    name: string,
    value: InterpreterValue,
    isConstant: boolean,
  ): InterpreterValue {
    if (this.#variables.has(name)) {
      // TODO: Add message
      throw InvalidVariableError;
    }

    this.#variables.set(name, value);

    if (isConstant) {
      this.#constants.push(name);
    }

    return value;
  }

  // TODO: Simplify
  public getVariable(name: string): InterpreterValue {
    if (this.#variables.has(name)) {
      return (
        this.#variables.get(name) ??
        <InterpreterNull>{
          type: InterpreterValueType.Null,
          value: null,
        }
      );
    }

    if (!this.#parent) {
      // TODO: Add message
      throw new Error("InvalidVariableError: Variable not found");
    }

    let parent: Environment | undefined = this.#parent;

    while (parent) {
      if (parent.#variables.has(name)) {
        return (
          parent.#variables.get(name) ??
          <InterpreterNull>{
            type: InterpreterValueType.Null,
            value: null,
          }
        );
      }

      parent = parent.#parent;
    }

    // TODO: Add message
    throw new Error("InvalidVariableError: Variable not found");
  }

  public setVariable(name: string, value: InterpreterValue): InterpreterValue {
    if (this.#variables.has(name)) {
      if (this.#constants.includes(name)) {
        // TODO: Add message
        throw InvalidVariableError;
      }

      this.#variables.set(name, value);

      return value;
    }

    if (this.#parent) {
      return this.#parent.setVariable(name, value);
    }

    throw new Error(`InvalidVariableError: Variable '${name}' not found`);
  }
}
