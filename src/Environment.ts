import { InterpreterValue } from "@/types/interpreter";

import InvalidVariableError from "@/src/errs/InvalidVariableError";

export default class Environment {
	readonly #parent?: Environment;
	#constants: Set<string>;
	#variables: Map<string, InterpreterValue>;

	public constructor(parent?: Environment) {
		this.#parent = parent;
		this.#constants = new Set<string>();
		this.#variables = new Map<string, InterpreterValue>();
	}

	public get parent(): Environment | undefined {
		return this.#parent;
	}

	public addVariable(
		identifier: string,
		value: InterpreterValue,
		isConstant: boolean,
	): InterpreterValue {
		if (this.#variables.has(identifier)) {
			throw new InvalidVariableError(
				`Variable "${identifier}" has already been declared.`,
			);
		}

		if (!isConstant) {
			let environment: Environment | undefined = this.#parent;

			while (environment) {
				if (environment.#constants.has(identifier)) {
					throw new InvalidVariableError(
						`Constant "${identifier}" from parent's scope cannot be shadowed.`,
					);
				}

				environment = environment.#parent;
			}
		}

		this.#variables.set(identifier, value);

		if (isConstant) {
			this.#constants.add(identifier);
		}

		return value;
	}

	public getVariable(identifier: string): InterpreterValue {
		let environment: Environment | undefined = this;

		while (environment) {
			if (environment.#variables.has(identifier)) {
				return <InterpreterValue>environment.#variables.get(identifier);
			}

			environment = environment.#parent;
		}

		throw new InvalidVariableError(`Variable "${identifier}" was not found.`);
	}

	public setVariable(
		identifier: string,
		value: InterpreterValue,
	): InterpreterValue {
		if (this.#variables.has(identifier)) {
			if (this.#constants.has(identifier)) {
				throw new InvalidVariableError(
					`Constant "${identifier}" cannot be reassigned`,
				);
			}

			this.#variables.set(identifier, value);

			return value;
		}

		if (this.#parent) {
			return this.#parent.setVariable(identifier, value);
		}

		throw new InvalidVariableError(`Variable "${identifier} was not found."`);
	}
}
