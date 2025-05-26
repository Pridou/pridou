import {
  type ASTAlpha,
  type ASTArray,
  type ASTAssignmentExpression,
  type ASTBinaryExpression,
  ASTNodeType,
  type ASTNumber,
  type ASTProgram,
  type ASTStatement,
  type ASTString,
  type ASTVariableDeclaration,
  type InterpreterArray,
  type InterpreterNull,
  type InterpreterNumber,
  type InterpreterString,
  type InterpreterValue,
  InterpreterValueType,
} from "@/types";

import type Environment from "@/environment";
import { InvalidNodeError } from "@/errors";

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
        // biome-ignore lint/style/noNonNullAssertion: temp
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

    case ASTNodeType.Float:
      return <InterpreterNumber>{
        type: InterpreterValueType.Number,
        value: (<ASTNumber>node).value,
      };

    case ASTNodeType.BinaryExpression: {
      const leftHandSide = evaluate(
        (<ASTBinaryExpression>node).leftExpression,
        environment,
      );
      const rightHandSide = evaluate(
        (<ASTBinaryExpression>node).rightExpression,
        environment,
      );
      const operator = (<ASTBinaryExpression>node).binaryOperator;

      if (
        operator === "*" &&
        ((leftHandSide.type === InterpreterValueType.String &&
          rightHandSide.type === InterpreterValueType.Number) ||
          (leftHandSide.type === InterpreterValueType.Number &&
            rightHandSide.type === InterpreterValueType.String))
      ) {
        const str =
          leftHandSide.type === InterpreterValueType.String
            ? (<InterpreterString>leftHandSide).value.toString()
            : (<InterpreterString>rightHandSide).value.toString();

        const count =
          leftHandSide.type === InterpreterValueType.Number
            ? (<InterpreterNumber>leftHandSide).value
            : (<InterpreterNumber>rightHandSide).value;

        return <InterpreterString>{
          type: InterpreterValueType.String,
          value: str.repeat(count),
        };
      }

      if (
        leftHandSide.type === InterpreterValueType.Number &&
        rightHandSide.type === InterpreterValueType.Number
      ) {
        const leftValue = (<InterpreterNumber>leftHandSide).value;
        const rightValue = (<InterpreterNumber>rightHandSide).value;
        let value = 0;

        switch ((<ASTBinaryExpression>node).binaryOperator) {
          case "%":
            value = leftValue % rightValue;
            break;
          case "*":
            value = leftValue * rightValue;
            break;
          case "+":
            value = leftValue + rightValue;
            break;
          case "-":
            value = leftValue - rightValue;
            break;
          case "/":
            value = leftValue / rightValue;
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

    case ASTNodeType.String:
      return <InterpreterString>{
        type: InterpreterValueType.String,
        value: (<ASTString>node).value,
      };

    case ASTNodeType.Array: {
      const elements: InterpreterValue[] = [];
      for (const expression of (<ASTArray>node).body) {
        elements.push(evaluate(expression, environment));
      }

      return <InterpreterArray>{ type: InterpreterValueType.Array, elements };
    }

    default:
      throw new InvalidNodeError(`Unexpected AST node type: '${node.type}'`);
  }
}
