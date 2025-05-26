import {
	ASTNodeType,
	InterpreterValueType,
	type ASTAlpha,
	type ASTArray,
	type ASTAssignmentExpression,
	type ASTBinaryExpression,
	type ASTNumber,
	type ASTProgram,
	type ASTStatement,
	type ASTVariableDeclaration,
	type InterpreterArray,
	type InterpreterNull,
	type InterpreterNumber,
	type InterpreterValue,
} from "@/types";

import { InvalidNodeError } from "@/src/errs";
import type Environment from "@/src/environment";

export function evaluate(
	node: ASTStatement,
	environment: Environment,
): InterpreterValue {
	switch (node.type) {
		case ASTNodeType.Program: {
			let lastEvaluatedValue: InterpreterValue = {
				type: InterpreterValueType.Null,
				value: null,
			} as InterpreterNull;

			for (const statement of (<ASTProgram>node).body) {
				lastEvaluatedValue = evaluate(statement, environment);
			}

			return lastEvaluatedValue;
		}
		case ASTNodeType.VariableDeclaration:
			return environment.addVariable(
				(<ASTVariableDeclaration>node).alpha,
				evaluate((<ASTVariableDeclaration>node).value!, environment) ??
					<InterpreterNull>{
						type: InterpreterValueType.Null,
						value: null,
					},
					(<ASTVariableDeclaration>node).metadata.isConstant,
			);
		case ASTNodeType.Alpha:
			return environment.getVariable((<ASTAlpha>node).value);
		case ASTNodeType.Number:
			return <InterpreterNumber>{
				type: InterpreterValueType.Number,
				value: (<ASTNumber>node).value,
			};
		case ASTNodeType.BinaryExpression: {
			const leftHandSide: InterpreterNumber = <InterpreterNumber>(
				evaluate((<ASTBinaryExpression>node).leftExpression, environment)
			);
			const rightHandSide: InterpreterNumber = <InterpreterNumber>(
				evaluate((<ASTBinaryExpression>node).rightExpression, environment)
			);

			if (
				leftHandSide.type === InterpreterValueType.Number &&
				rightHandSide.type === InterpreterValueType.Number
			) {
				let value = 0;

				switch ((<ASTBinaryExpression>node).binaryOperator) {
					case "%":
						value = leftHandSide.value % rightHandSide.value;
						break;
					case "*":
						value = leftHandSide.value * rightHandSide.value;
						break;
					case "+":
						value = leftHandSide.value + rightHandSide.value;
						break;
					case "-":
						value = leftHandSide.value - rightHandSide.value;
						break;
					case "/":
						value = leftHandSide.value / rightHandSide.value;
						break;
				}

				return <InterpreterNumber>{
					type: InterpreterValueType.Number,
					value,
				};
			}

			return <InterpreterNull>{ type: InterpreterValueType.Null, value: null };
		}
		case ASTNodeType.AssignmentExpression:
			if ((<ASTAssignmentExpression>node).assignee.type !== ASTNodeType.Alpha) {
				// TODO: Add custom error
				throw Error;
			}

			return environment.setVariable(
				(<ASTAlpha>(<ASTAssignmentExpression>node).assignee).value,
				evaluate((<ASTAssignmentExpression>node).value, environment),
			);

		case ASTNodeType.Array: {
			const elements: InterpreterValue[] = [];
			for(const expression of (<ASTArray>node).body){
				elements.push(evaluate(expression,environment));
			}

			return <InterpreterArray>{
				type: InterpreterValueType.Array,
				elements
			};
		}

		default:
			throw new InvalidNodeError(`Unexpected AST node type: '${node.type}'`);
	}
}
