import Environment from "@/environment";
import Parser from "@/parser";

import { InvalidNodeError } from "@/errors";

import {
  type ASTAssignmentExpression,
  type ASTBinaryExpression,
  type ASTFunctionCall,
  type ASTFunctionDeclaration,
  type ASTIdentifier,
  type ASTNode,
  ASTNodeType,
  type ASTNumber,
  type ASTProgram,
  type ASTString,
  type ASTVariableDeclaration,
} from "@/types/ast";
import {
  type InterpreterFunction,
  type InterpreterNull,
  type InterpreterNumber,
  type InterpreterString,
  type InterpreterValue,
  InterpreterValueType,
} from "@/types/interpreter";

export default class Interpreter {
  public evaluateNode(
    node: ASTNode,
    environment: Environment,
  ): InterpreterValue {
    switch (node.type) {
      case ASTNodeType.Program: {
        let lastEvaluatedValue: InterpreterValue = {
          type: InterpreterValueType.Null,
          value: null,
        } as InterpreterNull;

        for (const statement of (<ASTProgram>node).body) {
          lastEvaluatedValue = this.evaluateNode(statement, environment);
        }

        return lastEvaluatedValue;
      }
      case ASTNodeType.Number:
        return <InterpreterNumber>{
          type: InterpreterValueType.Number,
          value: (<ASTNumber>node).value,
        };
      case ASTNodeType.Identifier:
        return environment.getVariable((<ASTIdentifier>node).value);
      case ASTNodeType.String:
        return <InterpreterString>{
          type: InterpreterValueType.String,
          value: (<ASTString>node).value,
        };
      case ASTNodeType.FunctionDeclaration: {
        const functionDeclaration: ASTFunctionDeclaration = <
          ASTFunctionDeclaration
        >node;
        environment.addVariable(
          functionDeclaration.identifier,
          <InterpreterFunction>{
            type: InterpreterValueType.Function,
            value: {
              body: functionDeclaration.body,
              environment: environment,
              parameters: functionDeclaration.parameters,
            },
          },
          true,
        );

        return {
          type: InterpreterValueType.Null,
          value: null,
        } as InterpreterNull;
      }
      case ASTNodeType.FunctionCall: {
        // TODO: Simplify type casting

        const functionCall: ASTFunctionCall = <ASTFunctionCall>node;
        const functionValue: InterpreterValue = environment.getVariable(
          functionCall.identifier,
        );

        if (functionValue.type !== InterpreterValueType.Function) {
          throw new InvalidNodeError(
            `Expected a function, but got ${functionValue.type}.`,
          );
        }

        const { parameters } = <ASTFunctionDeclaration>(
          (<InterpreterFunction>functionValue).value
        );
        const functionEnvironment = new Environment(
          (<ASTFunctionDeclaration>(<InterpreterFunction>functionValue).value)
            .environment,
        );

        functionCall.arguments.forEach(
          (argument: ASTNode, index: number): void => {
            const identifier: string = parameters[index];
            const argumentValue: InterpreterValue = this.evaluateNode(
              argument,
              environment,
            );
            functionEnvironment.addVariable(identifier, argumentValue, false);
          },
        );

        let result: InterpreterValue = {
          type: InterpreterValueType.Null,
          value: null,
        } as InterpreterNull;

        for (const statement of (<ASTFunctionDeclaration>(
          (<InterpreterFunction>functionValue).value
        )).body) {
          result = this.evaluateNode(statement, functionEnvironment);
        }

        return result;
      }
      case ASTNodeType.VariableDeclaration: {
        const variableDeclaration: ASTVariableDeclaration = <
          ASTVariableDeclaration
        >node;

        if (!variableDeclaration.value) {
          throw new InvalidNodeError("Variable declaration must have a value.");
        }

        return environment.addVariable(
          variableDeclaration.identifier,
          this.evaluateNode(variableDeclaration.value, environment),
          variableDeclaration.metadata.isConstant,
        );
      }
      case ASTNodeType.AssignmentExpression:
        return environment.setVariable(
          (<ASTIdentifier>(<ASTAssignmentExpression>node).assignee).value,
          this.evaluateNode((<ASTAssignmentExpression>node).value, environment),
        );
      case ASTNodeType.BinaryExpression: {
        const binaryExpression: ASTBinaryExpression = <ASTBinaryExpression>node;

        const leftHandSideExpression: InterpreterValue = this.evaluateNode(
          (<ASTBinaryExpression>node).leftExpression,
          environment,
        );
        const rightHandSideExpression: InterpreterValue = this.evaluateNode(
          (<ASTBinaryExpression>node).rightExpression,
          environment,
        );

        // TODO: Add type-checking (number)
        const leftValue: number = (<InterpreterNumber>leftHandSideExpression)
          .value;
        const rightValue: number = (<InterpreterNumber>rightHandSideExpression)
          .value;

        let value = 0;

        switch (binaryExpression.binaryOperator) {
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
          default:
            throw new InvalidNodeError(
              `Unsupported binary operator: ${binaryExpression.binaryOperator}`,
            );
        }

        return <InterpreterNumber>{
          type: InterpreterValueType.Number,
          value,
        };
      }
    }
  }

  public evaluateSourceCode(sourceCode: string): InterpreterValue {
    return this.evaluateNode(
      new Parser().sourceCodeToAST(sourceCode),
      new Environment(),
    );
  }
}
