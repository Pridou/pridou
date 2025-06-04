// TODO: Add support for type-equality (===)
// TODO: Add support for missing comparisons (same for binary ops)

import {
  type InterpreterBoolean,
  type InterpreterFunction,
  type InterpreterNil,
  type InterpreterNumber,
  type InterpreterString,
  type InterpreterValue,
  InterpreterValueType,
} from "@/types/interpreter";
import { LexerTokenType } from "@/types/lexer";
import {
  type ASTAssignmentExpression,
  type ASTBinaryExpression,
  type ASTComparisonExpression,
  type ASTFunctionCallExpression,
  type ASTFunctionDeclarationStatement,
  type ASTIdentifier,
  type ASTNode,
  ASTNodeType,
  type ASTNumber,
  type ASTProgram,
  type ASTReturnStatement,
  type ASTString,
  type ASTVariableDeclarationStatement,
  type ASTWhileStatement,
} from "@/types/parser";

import Environment from "@/environment";
import Parser from "@/parser";

import { NATIVE_CONSTANTS, NATIVE_FUNCTIONS } from "@/config/builtin";

import InvalidNodeError from "@/errors/InvalidNodeError";
import InvalidTokenError from "@/errors/InvalidTokenError";

export default class Interpreter {
  private env: Environment;

  constructor(environment: Environment = new Environment()) {
    this.init(environment);
    this.env = environment;
  }

  private init(environment: Environment): void {
    for (const [identifier, value] of NATIVE_CONSTANTS) {
      environment.addVariable(identifier, value, true);
    }

    for (const [identifier, value] of NATIVE_FUNCTIONS) {
      environment.addVariable(identifier, value, true);
    }
  }

  private evaluateProgram(
    node: ASTNode,
    environment: Environment,
  ): InterpreterValue {
    let lastExpression: InterpreterValue = <InterpreterNil>{
      type: InterpreterValueType.Nil,
      value: null,
    };

    for (const expression of (<ASTProgram>node).body) {
      lastExpression = this.evaluateNode(expression, environment);
    }

    return lastExpression;
  }

  // TODO: Optimize
  private evaluateFunctionCallExpression(
    node: ASTNode,
    environment: Environment,
  ): InterpreterValue | InterpreterNil {
    const expression: ASTFunctionCallExpression = <ASTFunctionCallExpression>(
      node
    );
    const expressionValue: InterpreterFunction = <InterpreterFunction>(
      environment.getVariable(expression.identifier)
    );

    if (expressionValue.type !== InterpreterValueType.Function) {
      throw new InvalidNodeError(
        `Expected a function, but got ${expressionValue.type}.`,
      );
    }

    const parameters: string[] = expressionValue.parameters;
    const functionEnvironment = new Environment(expressionValue.environment);

    expression.arguments.forEach((argument: ASTNode, index: number): void => {
      const argumentValue: InterpreterValue = this.evaluateNode(
        argument,
        environment,
      );

      functionEnvironment.addVariable(parameters[index], argumentValue, false);
    });

    for (const statement of expressionValue.body) {
      if (statement.type === ASTNodeType.ReturnStatement) {
        return this.evaluateNode(
          (<ASTReturnStatement>statement).value,
          functionEnvironment,
        );
      }

      this.evaluateNode(statement, functionEnvironment);
    }

    return <InterpreterNil>{
      type: InterpreterValueType.Nil,
      value: null,
    };
  }

  private evaluateVariableDeclarationStatement(
    node: ASTNode,
    environment: Environment,
  ): InterpreterValue | InterpreterNil {
    const statement: ASTVariableDeclarationStatement = <
      ASTVariableDeclarationStatement
    >node;

    return environment.addVariable(
      statement.identifier,
      statement.value
        ? this.evaluateNode(<ASTNode>statement.value, environment)
        : <InterpreterNil>{
            type: InterpreterValueType.Nil,
            value: null,
          },
      statement.metadata.isConstant,
    );
  }

  private evaluateFunctionDeclarationStatement(
    node: ASTNode,
    environment: Environment,
  ): InterpreterNil {
    const statement: ASTFunctionDeclarationStatement = <
      ASTFunctionDeclarationStatement
    >node;

    environment.addVariable(
      statement.identifier,
      <InterpreterFunction>{
        type: InterpreterValueType.Function,
        body: statement.body,
        parameters: statement.parameters,
        environment: new Environment(environment),
      },
      true,
    );

    return <InterpreterNil>{
      type: InterpreterValueType.Nil,
      value: null,
    };
  }

  private evaluateReturnStatement(
    node: ASTNode,
    environment: Environment,
  ): InterpreterValue {
    const returnStatement = <ASTReturnStatement>node;
    const returnValue = this.evaluateNode(returnStatement.value, environment);

    if (returnValue.type !== InterpreterValueType.Number) {
      throw new InvalidNodeError(
        `Expected a number as return value, but got ${returnValue.type}.`,
      );
    }

    const exitCode = (<InterpreterNumber>returnValue).value;

    process.exit(exitCode);
  }

  private evaluateBinaryExpression(
    node: ASTNode,
    environment: Environment,
  ): InterpreterNumber {
    const expression: ASTBinaryExpression = <ASTBinaryExpression>node;

    // FIXME: Cast properly
    const leftExpressionValue: number = (<InterpreterNumber>(
      this.evaluateNode(expression.leftExpression, environment)
    )).value;
    const rightExpressionValue: number = (<InterpreterNumber>(
      this.evaluateNode(expression.rightExpression, environment)
    )).value;

    let value = 0;

    switch (expression.binaryOperator) {
      case LexerTokenType.Modulus:
        value = leftExpressionValue % rightExpressionValue;
        break;
      case LexerTokenType.Multiply:
        value = leftExpressionValue * rightExpressionValue;
        break;
      case LexerTokenType.Plus:
        value = leftExpressionValue + rightExpressionValue;
        break;
      case LexerTokenType.Minus:
        value = leftExpressionValue - rightExpressionValue;
        break;
      case LexerTokenType.Divide:
        value = leftExpressionValue / rightExpressionValue;
        break;
      // TODO: Support pow
      default:
        throw new InvalidTokenError(
          `Invalid token ${expression.binaryOperator} was found.`,
        );
    }

    if (Number.isNaN(value)) {
      throw new InvalidNodeError(
        `Invalid operation: ${leftExpressionValue} ${expression.binaryOperator} ${rightExpressionValue}`,
      );
    }

    const type =
      typeof value === "number"
        ? InterpreterValueType.Number
        : InterpreterValueType.String;

    return <InterpreterNumber>{
      type,
      value,
    };
  }

  private evaluateComparisonExpression(
    node: ASTNode,
    environment: Environment,
  ): InterpreterBoolean {
    const expression: ASTComparisonExpression = <ASTComparisonExpression>node;

    const leftExpressionValue: boolean = (<InterpreterBoolean>(
      this.evaluateNode(expression.leftExpression, environment)
    )).value;
    const rightExpressionValue: boolean = (<InterpreterBoolean>(
      this.evaluateNode(expression.rightExpression, environment)
    )).value;

    let value = false;

    switch (expression.comparisonOperator) {
      case LexerTokenType.LessThan:
        value = leftExpressionValue < rightExpressionValue;
        break;
      case LexerTokenType.LessThanOrEqual:
        value = leftExpressionValue <= rightExpressionValue;
        break;
      case LexerTokenType.Equality:
        value = leftExpressionValue === rightExpressionValue;
        break;
      case LexerTokenType.GreaterThan:
        value = leftExpressionValue > rightExpressionValue;
        break;
      case LexerTokenType.GreaterThanOrEqual:
        value = leftExpressionValue >= rightExpressionValue;
        break;
      default:
        throw new InvalidTokenError(
          `Invalid token ${expression.comparisonOperator} was found.`,
        );
    }

    return <InterpreterBoolean>{
      type: InterpreterValueType.Boolean,
      value,
    };
  }

  private evaluateWhileStatement(
    node: ASTNode,
    environment: Environment,
  ): InterpreterNil {
    const expression: ASTWhileStatement = <ASTWhileStatement>node;

    while (
      (<InterpreterBoolean>(
        this.evaluateNode(expression.comparison, environment)
      )).value
    ) {
      for (const statement of expression.body) {
        this.evaluateNode(statement, new Environment(environment));
      }
    }

    return <InterpreterNil>{
      type: InterpreterValueType.Nil,
      value: null,
    };
  }

  // TODO: Rework type-casting (please)
  private evaluateAssignmentExpression(
    node: ASTNode,
    environment: Environment,
  ) {
    return environment.setVariable(
      (<ASTIdentifier>(<ASTAssignmentExpression>node).leftExpression).value,
      this.evaluateNode(
        <ASTNode>(<ASTAssignmentExpression>node).value,
        environment,
      ),
    );
  }

  private evaluateNode(
    node: ASTNode,
    environment: Environment,
  ): InterpreterValue {
    // TODO: Add support for unary operators (+, -, etc)

    switch (node.type) {
      case ASTNodeType.Program:
        return this.evaluateProgram(node, environment);
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
      case ASTNodeType.FunctionCallExpression:
        return this.evaluateFunctionCallExpression(node, environment);
      case ASTNodeType.VariableDeclarationStatement:
        return this.evaluateVariableDeclarationStatement(node, environment);
      case ASTNodeType.FunctionDeclarationStatement:
        return this.evaluateFunctionDeclarationStatement(node, environment);
      case ASTNodeType.ReturnStatement:
        return this.evaluateReturnStatement(node, environment);
      case ASTNodeType.BinaryExpression:
        return this.evaluateBinaryExpression(node, environment);
      case ASTNodeType.ComparisonExpression:
        return this.evaluateComparisonExpression(node, environment);
      case ASTNodeType.WhileStatement:
        return this.evaluateWhileStatement(node, environment);
      case ASTNodeType.AssignmentExpression:
        return this.evaluateAssignmentExpression(node, environment);
    }
  }

  public setEnvironment(environment: Environment) {
    this.env = environment;
  }

  public eval(sourceCode: string): InterpreterValue {
    return this.evaluateNode(
      new Parser().sourceCodeToAST(sourceCode),
      this.env,
    );
  }

  public run(sourceCode: string): void {
    this.evaluateNode(new Parser().sourceCodeToAST(sourceCode), this.env);
  }
}
