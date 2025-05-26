import type { InterpreterValue } from "@/types";

import { InvalidAssignmentError, InvalidVariableError } from "./errors";

export default class Environment {
  readonly #parent?: Environment;
  readonly #constants: string[];
  readonly #variables: Map<string, InterpreterValue>;

  public constructor(parent?: Environment) {
    this.#parent = parent;
    this.#constants = [];
    this.#variables = new Map<string, InterpreterValue>();
  }

  private getEnvironment(name: string): Environment {
    if (this.#variables.get(name)) {
      return this;
    }

    if (!this.#parent) {
      throw new InvalidVariableError(`Variable "${name}" is not defined`);
    }

    return this.#parent.getEnvironment(name);
  }

  public addVariable(
    name: string,
    value: InterpreterValue,
    isConstant: boolean,
  ): InterpreterValue {
    if (Object.keys(this.#variables).includes(name)) {
      throw new InvalidVariableError(
        `Variable "${name}" has already been declared`,
      );
    }

    this.#variables.set(name, value);

    if (isConstant) {
      this.#constants.push(name);
    }

    return value;
  }

  public getVariable(name: string): InterpreterValue {
    const environment: Environment = this.getEnvironment(name);

    // TODO: Upgrade
    // biome-ignore lint/style/noNonNullAssertion: temp
    return environment.#variables.get(name)!;
  }

  public setVariable(name: string, value: InterpreterValue): InterpreterValue {
    const environment: Environment = this.getEnvironment(name);

    if (environment.#constants.includes(name)) {
      throw new InvalidAssignmentError(
        `Cannot reassign variable ${name} as it is a constant.`,
      );
    }

    environment.#variables.set(name, value);

    return value;
  }
}
