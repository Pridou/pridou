import {
	InterpreterNil,
	InterpreterNumber,
	InterpreterString,
	InterpreterValue,
	InterpreterValueType,
} from "@/types/interpreter";
import {
	ASTIdentifier,
	ASTNode,
	ASTNodeType,
	ASTNumber,
	ASTProgram,
	ASTString,
} from "@/types/parser";

import Environment from "@/src/Environment";
import Parser from "@/src/Parser";

import {NATIVE_CONSTANTS, NATIVE_FUNCTIONS} from "@/src/else/base";

import InvalidNodeError from "@/src/errs/InvalidNodeError";

export default class Interpreter {
	private init(environment: Environment): void {
		for (const [identifier, value] of NATIVE_CONSTANTS) {
			environment.addVariable(identifier, value, true);
		}

		for (const [identifier, value] of NATIVE_FUNCTIONS) {
			environment.addVariable(identifier, value, true);
		}
	}

	private evaluateProgram() {
		let lastExpression: InterpreterValue = <InterpreterNil>{
			type: InterpreterValueType.Nil,
			value: "nil",
		};

		for (const expression of (<ASTProgram>node).body) {
			lastExpression = this.evaluateNode(expression, environment);
		}

		return lastExpression;
	}

	private evaluateNode(
		node: ASTNode,
		environment: Environment,
	): InterpreterValue {
		if (!environment.parent) {
			this.init(environment);
		}

		switch (node.type) {
			case ASTNodeType.Program:
				return this.evaluateProgram();
			case ASTNodeType.Number:
				return <InterpreterNumber>{
					type: InterpreterValueType.Number,
					value: (<ASTNumber>node).value,
				};
			case ASTNodeType.String:
				return <InterpreterString>{
					type: InterpreterValueType.String,
					value: (<ASTString>node).value,
				};
			case ASTNodeType.Identifier:
				return environment.getVariable((<ASTIdentifier>node).value);
			// TODO: Add support for unary operators (+, -, etc)
			default:
				throw new InvalidNodeError(`Invalid node "${node.type}" was found.`);
		}
	}

	public run(sourceCode: string): void {
		this.evaluateNode(
			new Parser().sourceCodeToAST(sourceCode),
			new Environment(),
		);
	}
}
