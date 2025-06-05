// TODO: Add support for type-equality (===)
// TODO: Add support for missing comparisons (same for binary ops)
import { InterpreterValueType, } from "./types/interpreter.js";
import { LexerTokenType } from "./types/lexer.js";
import { ASTNodeType, } from "./types/parser.js";
import Environment from "./environment.js";
import Parser from "./parser.js";
import { NATIVE_CONSTANTS, NATIVE_FUNCTIONS } from "./config/builtin.js";
import InvalidNodeError from "./errors/InvalidNodeError.js";
import InvalidTokenError from "./errors/InvalidTokenError.js";
export default class Interpreter {
    constructor(environment = new Environment()) {
        this.init(environment);
        this.env = environment;
    }
    init(environment) {
        for (const [identifier, value] of NATIVE_CONSTANTS) {
            environment.addVariable(identifier, value, true);
        }
        for (const [identifier, value] of NATIVE_FUNCTIONS) {
            environment.addVariable(identifier, value, true);
        }
    }
    evaluateProgram(node, environment) {
        let lastExpression = {
            type: InterpreterValueType.Nil,
            value: null,
        };
        for (const expression of node.body) {
            lastExpression = this.evaluateNode(expression, environment);
        }
        return lastExpression;
    }
    // TODO: Optimize
    evaluateFunctionCallExpression(node, environment) {
        const expression = (node);
        const expressionValue = (environment.getVariable(expression.identifier));
        if (expressionValue.type !== InterpreterValueType.Function) {
            throw new InvalidNodeError(`Expected a function, but got ${expressionValue.type}.`);
        }
        const parameters = expressionValue.parameters;
        const functionEnvironment = new Environment(expressionValue.environment);
        expression.arguments.forEach((argument, index) => {
            const argumentValue = this.evaluateNode(argument, environment);
            functionEnvironment.addVariable(parameters[index], argumentValue, false);
        });
        for (const statement of expressionValue.body) {
            if (statement.type === ASTNodeType.ReturnStatement) {
                return this.evaluateNode(statement.value, functionEnvironment);
            }
            this.evaluateNode(statement, functionEnvironment);
        }
        return {
            type: InterpreterValueType.Nil,
            value: null,
        };
    }
    evaluateVariableDeclarationStatement(node, environment) {
        const statement = node;
        return environment.addVariable(statement.identifier, statement.value
            ? this.evaluateNode(statement.value, environment)
            : {
                type: InterpreterValueType.Nil,
                value: null,
            }, statement.metadata.isConstant);
    }
    evaluateFunctionDeclarationStatement(node, environment) {
        const statement = node;
        environment.addVariable(statement.identifier, {
            type: InterpreterValueType.Function,
            body: statement.body,
            parameters: statement.parameters,
            environment: new Environment(environment),
        }, true);
        return {
            type: InterpreterValueType.Nil,
            value: null,
        };
    }
    evaluateReturnStatement(node, environment) {
        const returnStatement = node;
        const returnValue = this.evaluateNode(returnStatement.value, environment);
        if (returnValue.type !== InterpreterValueType.Number) {
            throw new InvalidNodeError(`Expected a number as return value, but got ${returnValue.type}.`);
        }
        const exitCode = returnValue.value;
        process.exit(exitCode);
    }
    evaluateBinaryExpression(node, environment) {
        const expression = node;
        // FIXME: Cast properly
        const leftExpressionValue = (this.evaluateNode(expression.leftExpression, environment)).value;
        const rightExpressionValue = (this.evaluateNode(expression.rightExpression, environment)).value;
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
                throw new InvalidTokenError(`Invalid token ${expression.binaryOperator} was found.`);
        }
        if (Number.isNaN(value)) {
            throw new InvalidNodeError(`Invalid operation: ${leftExpressionValue} ${expression.binaryOperator} ${rightExpressionValue}`);
        }
        const type = typeof value === "number"
            ? InterpreterValueType.Number
            : InterpreterValueType.String;
        return {
            type,
            value,
        };
    }
    evaluateComparisonExpression(node, environment) {
        const expression = node;
        const leftExpressionValue = (this.evaluateNode(expression.leftExpression, environment)).value;
        const rightExpressionValue = (this.evaluateNode(expression.rightExpression, environment)).value;
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
                throw new InvalidTokenError(`Invalid token ${expression.comparisonOperator} was found.`);
        }
        return {
            type: InterpreterValueType.Boolean,
            value,
        };
    }
    evaluateWhileStatement(node, environment) {
        const expression = node;
        while ((this.evaluateNode(expression.comparison, environment)).value) {
            for (const statement of expression.body) {
                this.evaluateNode(statement, new Environment(environment));
            }
        }
        return {
            type: InterpreterValueType.Nil,
            value: null,
        };
    }
    // TODO: Rework type-casting (please)
    evaluateAssignmentExpression(node, environment) {
        return environment.setVariable(node.leftExpression.value, this.evaluateNode(node.value, environment));
    }
    evaluateNode(node, environment) {
        // TODO: Add support for unary operators (+, -, etc)
        switch (node.type) {
            case ASTNodeType.Program:
                return this.evaluateProgram(node, environment);
            case ASTNodeType.Number:
                return {
                    type: InterpreterValueType.Number,
                    value: node.value,
                };
            case ASTNodeType.String:
                return {
                    type: InterpreterValueType.String,
                    value: node.value,
                };
            case ASTNodeType.Identifier:
                return environment.getVariable(node.value);
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
    setEnvironment(environment) {
        this.env = environment;
    }
    eval(sourceCode) {
        return this.evaluateNode(new Parser().sourceCodeToAST(sourceCode), this.env);
    }
    run(sourceCode) {
        this.evaluateNode(new Parser().sourceCodeToAST(sourceCode), this.env);
    }
}
