//import RuntimeError from "@/src/errs/RuntimeError";
import {
	
	ASTNodeType,
	InterpreterValueType,
	type ASTAlpha,
	type ASTAssignmentExpression,
	type ASTBinaryExpression,
	type ASTNumber,
	type ASTWhileStatement,
	type ASTProgram,
	type ASTStatement,
	type ASTBlockStatement,
	type ASTVariableDeclaration,
	type InterpreterNull,
	type InterpreterNumber,
	type InterpreterValue,
	type InterpreterBoolean,
	
	
} from "@/types";

import { InvalidNodeError } from "@/src/errs";
import Environment from "@/src/environment";
//import type Environment from "@/src/environment";

import RuntimeError from "@/src/errs/RuntimeError";

export function evaluate(
	node: ASTStatement,
	environment: Environment,
): InterpreterValue {
	switch (node.type) {
		case ASTNodeType.WhileStatement:{
			const { test, body } = node as ASTWhileStatement;

			while (true) {
				const condition: InterpreterBoolean = <InterpreterBoolean>evaluate(test, environment);

				
				if (!condition.value) break;



				evaluate(body, environment);
	}

			return {
				type: InterpreterValueType.Null,
				value: null,
	}		 as InterpreterNull;
}

		

		case ASTNodeType.BlockStatement: {
			const blockEnv = new Environment(environment); 
			let result: InterpreterValue = <InterpreterNull>{
				type: InterpreterValueType.Null,
				value: null,
			};
			const blockNode = node as ASTBlockStatement;
			for (const statement of blockNode.body) {
				result = evaluate(statement, blockEnv);
			}

			return result;
}

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
				true
				
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
					case "&&":
						value = leftHandSide.value && rightHandSide.value;
						break;
						
					case "||":
						value = leftHandSide.value || rightHandSide.value;
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

		default:
			throw new InvalidNodeError(`Unexpected AST node type: '${node.type}'`);
	}
}
